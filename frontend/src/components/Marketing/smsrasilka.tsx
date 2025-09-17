import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  message,
  Typography,
  Divider,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const { Title } = Typography;

const receiversOptions = [
  { label: "Barcha foydalanuvchilar", value: "all" },
  { label: "Faol foydalanuvchilar", value: "active" },
  { label: "Yangi ro‘yxatdan o‘tganlar", value: "new" },
];

const SmsRassilka: React.FC = () => {
  const [loading, setLoading] = useState(false);

const onFinish = async (values: any) => {
  setLoading(true);

  try {
    // Fake backend simulation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Yuborildi:", values);
    message.success("✅ SMS muvaffaqiyatli yuborildi");
  } catch (error) {
    console.error(error);
    message.error("❌ Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <Title level={4}>SMS Rassilka</Title>
      <Divider />
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="receiver"
          label="Qabul qiluvchilar"
          rules={[{ required: true, message: "Qabul qiluvchini tanlang!" }]}
        >
          <Select
            placeholder="Foydalanuvchilarni tanlang"
            options={receiversOptions}
          />
        </Form.Item>

        <Form.Item
          name="message"
          label="SMS matni"
          rules={[{ required: true, message: "SMS matnini kiriting!" }]}
        >
          <TextArea rows={4} placeholder="Xabar matnini yozing..." />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<SendOutlined />}
            htmlType="submit"
            loading={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            SMS yuborish
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SmsRassilka;
