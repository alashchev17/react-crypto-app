import { createContext, useContext, useEffect, useState } from "react";
import { fetchCrypto, fetchAssets } from "../api";
import { percentDifference } from "../utils";

const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
});

export function CryptoContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);

  function mapAssets(assets, result) {
    return assets.map((asset) => {
      const coin = result.find((c) => c.id === asset.id);
      return {
        grow: asset.price < coin.price,
        growPercent: percentDifference(asset.price, coin.price),
        totalAmount: asset.amount * coin.price,
        totalProfit: asset.amount * coin.price - asset.amount * asset.price,
        spentAmount: asset.amount * asset.price,
        name: coin.name,
        ...asset,
      };
    });
  }

  async function preload() {
    const { result } = await fetchCrypto();
    const storedAssets = JSON.parse(localStorage.getItem("assets"));
    // Load assets from localStorage
    if (storedAssets && storedAssets.length) {
      console.log(storedAssets);
      setAssets(storedAssets);
      setCrypto(result);
      setLoading(false);
    } else {
      const assets = await fetchAssets();
      setAssets(mapAssets(assets, result));
      localStorage.setItem("assets", JSON.stringify(mapAssets(assets, result)));
      setCrypto(result);
      setLoading(false);
    }
  }

  useEffect(() => {
    preload();
  }, []);

  function addAsset(newAsset) {
    setAssets((prev) => {
      localStorage.setItem(
        "assets",
        JSON.stringify(mapAssets([...prev, newAsset], crypto)),
      );
      return mapAssets([...prev, newAsset], crypto);
    });
  }

  function editAsset(newAsset) {
    setAssets((prev) => {
      const coin = crypto.find((c) => c.id === newAsset.id);
      const newAssetsWithoutCurrentAsset = prev.filter(
        (a) => a.id !== newAsset.id,
      );

      const newAssets = [
        ...newAssetsWithoutCurrentAsset,
        {
          name: coin.name,
          grow: newAsset.price < coin.price,
          growPercent: percentDifference(newAsset.price, coin.price),
          totalAmount: newAsset.amount * coin.price,
          totalProfit:
            newAsset.amount * coin.price - newAsset.amount * newAsset.price,
          spentAmount: newAsset.amount * newAsset.price,
          ...newAsset,
        },
      ];
      localStorage.setItem("assets", JSON.stringify(newAssets));
      return newAssets;
    });
  }

  return (
    <CryptoContext.Provider
      value={{ loading, crypto, assets, addAsset, editAsset, setAssets }}
    >
      {children}
    </CryptoContext.Provider>
  );
}

export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
