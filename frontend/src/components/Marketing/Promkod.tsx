import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Space,
  Popconfirm,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

interface Promo {
  key: string;
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
}

const initialData: Promo[] = [
  {
    key: "1",
    code: "SAVE20",
    discount: "20%",
    startDate: "2025-08-01",
    endDate: "2025-08-10",
  },
  {
    key: "2",
    code: "WELCOME10",
    discount: "10%",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
  },
];

const Promokod: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);

  const filteredData = data.filter((item) =>
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  const showModal = (record?: Promo) => {
    setIsModalOpen(true);
    if (record) {
      setEditKey(record.key);
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      setEditKey(null);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editKey) {
          setData((prev) =>
            prev.map((item) =>
              item.key === editKey ? { ...item, ...values } : item
            )
          );
          message.success("Promokod tahrirlandi");
        } else {
          const newPromo: Promo = {
            key: Date.now().toString(),
            ...values,
          };
          setData((prev) => [newPromo, ...prev]);
          message.success("Yangi promokod qo‘shildi");
        }
        setIsModalOpen(false);
      })
      .catch((info) => console.log("Validate Failed:", info));
  };

  const handleDelete = (key: string) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success("Promokod o‘chirildi");
  };

  const columns = [
    {
      title: "Promokod",
      dataIndex: "code",
      key: "code",
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide",
    },
    {
      title: "Chegirma",
      dataIndex: "discount",
      key: "discount",
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide",
    },
    {
      title: "Boshlanish sanasi",
      dataIndex: "startDate",
      key: "startDate",
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide",
    },
    {
      title: "Tugash sanasi",
      dataIndex: "endDate",
      key: "endDate",
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide",
    },
    {
      title: "Amallar",
      key: "actions",
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide",
      render: (_: any, record: Promo) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm
            title="O‘chirishni istaysizmi?"
            onConfirm={() => handleDelete(record.key)}
            okText="Ha"
            cancelText="Yo‘q"
            className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition-colors"
          >
            <Button danger icon={<DeleteOutlined className="text-red-600" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      <div className="mb-5">
        <h1 className="text-lg font-medium">Promokod</h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Promokod qidirish..."
          style={{ width: 250 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Yangi promokod
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredData} />

      <Modal
        title={editKey ? "Promokodni tahrirlash" : "Yangi promokod qo‘shish"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        okText={editKey ? "Saqlash" : "Qo‘shish"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Promokod nomi"
            rules={[{ required: true, message: "Promokod nomi kerak" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discount"
            label="Chegirma"
            rules={[{ required: true, message: "Chegirma miqdori kerak" }]}
          >
            <Input placeholder="Masalan: 10%" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Boshlanish sanasi"
            rules={[{ required: true, message: "Boshlanish sanasi kerak" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Tugash sanasi"
            rules={[{ required: true, message: "Tugash sanasi kerak" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Promokod;
