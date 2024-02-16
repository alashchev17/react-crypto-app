import React from "react";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
} from "antd";
import { useCrypto } from "../context/crypto-context";
import CoinInfo from "./CoinInfo";

export default function AssetEditForm({ open, onCreate, onCancel, asset }) {
  if (!asset) {
    return;
  }

  const { crypto } = useCrypto();
  const coin = crypto.find((c) => c.id === asset.id);
  const [form] = Form.useForm();
  const handleAmountChange = (value) => {
    const price = form.getFieldValue("price");
    form.setFieldsValue({
      total: +(value * price).toFixed(4),
    });
  };

  const handlePriceChange = (value) => {
    const amount = form.getFieldValue("amount");
    form.setFieldsValue({
      total: +(amount * value).toFixed(4),
    });
  };

  return (
    <Modal
      open={open}
      title="Edit asset"
      okText="Save"
      cancelText="Discard changes"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values, asset.id);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        name="asset"
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 20,
        }}
        initialValues={{
          price: +coin.price,
          amount: asset.amount,
        }}
      >
        <CoinInfo coin={coin} />
        <Divider />

        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              type: "number",
              min: 0,
            },
          ]}
        >
          <InputNumber
            placeholder="Enter coin amount"
            onChange={handleAmountChange}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Date & Time" name="date">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Price" name="price">
          <InputNumber style={{ width: "100%" }} onChange={handlePriceChange} />
        </Form.Item>

        <Form.Item label="Total" name="total">
          <InputNumber disabled style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
