import { createContext, useContext, useEffect, useState } from "react";
import { fetchCrypto } from "../api";
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
      console.log("coin: ", coin);
      console.log("asset: ", asset);
      return {
        ...asset,
        grow: asset.price < coin.price,
        growPercent: percentDifference(asset.price, coin.price),
        totalAmount: asset.amount * coin.price,
        totalProfit: asset.amount * coin.price - asset.amount * asset.price,
        spentAmount: asset.amount * asset.price,
        name: coin.name,
        price: coin.price,
      };
    });
  }
  async function preload() {
    const { result } = await fetchCrypto();
    console.log(result.find((c) => c.id === "worldcoin-wld"));
    const storedAssets = JSON.parse(localStorage.getItem("assets"));
    // Load assets from localStorage
    if (storedAssets && storedAssets.length) {
      console.log("storedAssets: ", storedAssets);
      setAssets(mapAssets(storedAssets, result));
      setCrypto(result);
      setLoading(false);
    } else {
      setCrypto(result);
      setLoading(false);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(preload, 5000);

    return () => clearInterval(intervalId);
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
