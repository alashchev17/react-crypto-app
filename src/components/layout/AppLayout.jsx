import { Layout, Spin } from "antd";
import AppHeader from "./AppHeader";
import AppSider from "./AppSider";
import AppContent from "./AppContent";
import { useCrypto } from "../../context/crypto-context";

export default function AppLayout() {
  const { loading } = useCrypto();

  return (
    <>
      {loading && <Spin fullscreen style={{ backgroundColor: "#001529" }} />}
      <Layout
        style={{
          backgroundColor: "#001529",
        }}
      >
        <AppHeader />
        <Layout>
          <AppSider />
          <AppContent />
        </Layout>
      </Layout>
    </>
  );
}
