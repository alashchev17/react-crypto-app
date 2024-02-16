import { Table } from "antd";
import { useCrypto } from "../context/crypto-context";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "Price, $",
    dataIndex: "price",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.amount - b.amount,
  },
];

export default function AssetsTable() {
  const { assets, loading } = useCrypto();

  const data = assets.map((asset) => ({
    key: asset.id,
    name: asset.name,
    price: asset.price,
    amount: asset.amount,
  }));

  return (
    <Table
      pagination={false}
      style={{
        width: "100%",
        opacity: loading ? 0 : 1,
        transition: "opacity 0.5s",
        transitionDelay: "2s",
        ease: "ease-in-out",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: "hidden",
      }}
      columns={columns}
      dataSource={data}
      scroll={{
        y: 165,
      }}
    />
  );
}
