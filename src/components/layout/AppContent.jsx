import { Flex, Layout, Typography } from "antd";
import { useCrypto } from "../../context/crypto-context";
import PortfolioChart from "../PortfolioChart";
import AssetsTable from "../AssetsTable";

const contentStyle = {
  textAlign: "center",
  minHeight: "calc(100vh - 80px)",
  // height: "100%",
  padding: "1rem",
  color: "#fff",
  backgroundColor: "#001529",
};
export default function AppContent() {
  const { assets, crypto, loading } = useCrypto();

  const cryptoPriceMap = crypto.reduce((acc, coin) => {
    acc[coin.id] = coin.price;
    return acc;
  }, {});

  return (
    <Layout.Content style={contentStyle}>
      <Typography.Title
        level={3}
        style={{
          color: "#fff",
          textAlign: "left",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.5s",
          transitionDelay: "1s",
          ease: "ease-in-out",
        }}
      >
        Portfolio value:{" "}
        {assets
          .map((asset) => asset.amount * cryptoPriceMap[asset.id])
          .reduce((acc, v) => acc + v, 0)
          .toFixed(2)}
        $
      </Typography.Title>
      <Flex
        justify="space-between"
        // gap="5vh"
        align="stretch"
        vertical
        style={{
          height: "calc(100% - 3rem)",
        }}
      >
        <PortfolioChart />
        <AssetsTable />
      </Flex>

      {/*<AssetsTable />*/}
    </Layout.Content>
  );
}
