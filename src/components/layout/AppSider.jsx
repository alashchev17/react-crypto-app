import {
  Layout,
  Card,
  Statistic,
  List,
  Typography,
  Tag,
  Empty,
  Button,
  Modal,
  Form,
} from "antd";

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

import { capitalize } from "../../utils";
import { useCrypto } from "../../context/crypto-context";
import AssetEditForm from "../AssetEditForm";

const siderStyle = {
  padding: "1rem",
  maxHeight: "calc(100vh - 80px)",
  overflow: "auto",
};

export default function AppSider() {
  const { assets, loading, setAssets, editAsset } = useCrypto();
  const [revealCards, setRevealCards] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      setRevealCards(true);
    }
  }, [loading]);

  if (!assets.length > 0) {
    return (
      <Layout.Sider width="25%" style={siderStyle}>
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={
            <span>
              The list of assets in your <a href="/">portfolio</a> is empty
            </span>
          }
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginInline: "unset",
            padding: "1rem 1rem 2rem 1rem",
            borderRadius: 10,
            backgroundColor: "white",
            opacity: loading ? 0 : 1,
            transition: "opacity 0.5s",
            transitionDelay: "0.5s",
            ease: "ease-in-out",
          }}
        ></Empty>
      </Layout.Sider>
    );
  }

  function handleEditAsset(id) {
    const asset = assets.find((a) => a.id === id);
    console.log(id);
    setCurrentAsset(asset);
    setEditOpen(true);
    console.log(asset);
  }

  const handleCancelEdit = () => {
    setEditOpen(false);
    setTimeout(() => {
      setCurrentAsset(null);
    }, 300);
  };

  const onCreate = (values, assetId) => {
    console.log("Received values of form: ", values);
    const newAsset = {
      id: assetId,
      amount: values.amount,
      price: values.price,
      date: values.date?.$d ?? new Date(),
    };
    console.log(newAsset);
    editAsset(newAsset);
    setEditOpen(false);
    setTimeout(() => {
      setCurrentAsset(null);
    }, 300);
  };

  function handleDeleteAsset(id) {
    Modal.confirm({
      title: "Confirm",
      content: "Are you sure you want to delete this asset?",
      onOk: () => {
        const newAssets = assets.filter((a) => a.id !== id);
        localStorage.setItem("assets", JSON.stringify(newAssets));
        setAssets(newAssets);
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  }

  return (
    <Layout.Sider width="25%" style={siderStyle}>
      {assets.map((asset, index) => (
        <Card
          key={asset.id}
          style={{
            marginBottom: "1rem",
            opacity: revealCards ? 1 : 0,
            transition: "opacity 0.5s",
            transitionDelay: `${(index + 1) * 0.25}s`,
            ease: "ease-in-out",
          }}
          actions={[
            <EditOutlined onClick={() => handleEditAsset(asset.id)} />,
            <CloseOutlined onClick={() => handleDeleteAsset(asset.id)} />,
          ]}
        >
          <Statistic
            title={capitalize(asset.id)}
            value={asset.totalAmount}
            precision={2}
            valueStyle={{
              color: asset.grow ? "#3f8600" : "#cf1322",
            }}
            prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="$"
          />
          <List
            dataSource={[
              {
                title: "Total Profit",
                value: asset.totalProfit,
                withTag: true,
              },
              {
                title: "Asset Amount",
                value: asset.amount,
                isPlain: true,
              },
              {
                title: "Spent on Asset",
                value: asset.spentAmount,
              },
            ]}
            size="small"
            renderItem={(item) => (
              <List.Item>
                <span>{item.title}</span>
                <span>
                  {item.withTag && (
                    <Tag color={asset.grow ? "green" : "red"}>
                      {asset.growPercent}%
                    </Tag>
                  )}
                  {item.isPlain && item.value}
                  {!item.isPlain && (
                    <Typography.Text type={asset.grow ? "success" : "danger"}>
                      {item.value.toFixed(2)}$
                    </Typography.Text>
                  )}
                </span>
              </List.Item>
            )}
          />
        </Card>
      ))}
      <AssetEditForm
        asset={currentAsset}
        onCreate={onCreate}
        open={editOpen}
        onCancel={handleCancelEdit}
      />
    </Layout.Sider>
  );
}
