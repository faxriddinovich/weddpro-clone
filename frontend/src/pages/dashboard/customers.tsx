import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Tag,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getCustomers, deleteCustomer, PLATFORM_MAP } from '@/services/customerService'; // Adjust path as needed

interface Customer {
  id: number;
  name: string;
  phone: string | null;
  order_count: number;
  registered_at: string;
  last_visit: string | null;
  platform: number;
}

const Customers: React.FC = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [viewModal, setViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const customers = await getCustomers();
        setData(customers);
      } catch (err) {
        const error = err as Error;
        if (error.message.includes('401')) {
          message.error('Sessiya tugadi. Qayta login qiling.');
          window.location.href = '/login';
        } else {
          message.error(error.message || 'Ma\'lumotlarni yuklashda xatolik');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleView = (record: Customer) => {
    setSelectedCustomer(record);
    setViewModal(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "❗️ Mijozni o'chirishni tasdiqlaysizmi?",
      content: "Bu amalni bekor qilib bo'lmaydi.",
      okText: "Ha, o'chir",
      okType: "danger",
      cancelText: "Bekor qilish",
      onOk: async () => {
        setLoading(true);
        try {
          await deleteCustomer(id);
          setData((prev) => prev.filter((item) => item.id !== id));
          message.success("Mijoz muvaffaqiyatli o'chirildi");
        } catch (err) {
          message.error((err as Error).message || 'O\'chirishda xatolik');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 🔍 Search filter
  const filteredData = data.filter((customer) =>
    `${customer.name} ${customer.phone || ''}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Customer> = [
    {
      title: "Mijoz",
      dataIndex: "name",
      key: "name",
      responsive: ["sm"],
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium">{record.name}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      responsive: ["md"],
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide",
      render: (phone) => phone || 'N/A',
    },
    {
      title: "Buyurtmalar",
      dataIndex: "order_count",
      key: "order_count",
      render: (count) => <span className="font-semibold">{count}</span>,
      responsive: ["md"],
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide"
    },
    {
      title: "Ro'yxatdan o'tgan",
      dataIndex: "registered_at",
      key: "registered_at",
      responsive: ["lg"],
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide",
      render: (date) => new Date(date).toLocaleString('uz-UZ'),
    },
    {
      title: "So'nggi tashrif",
      dataIndex: "last_visit",
      key: "last_visit",
      responsive: ["lg"],
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide",
      render: (date) => date ? new Date(date).toLocaleString('uz-UZ') : 'N/A',
    },
    {
      title: "Platforma",
      dataIndex: "platform",
      key: "platform",
      className: "text-xs font-semibold text-gray-600 uppercase tracking-wide",
      render: (platform) => {
        const label = PLATFORM_MAP[platform] || 'Unknown';
        const color =
          label === "Telegram"
            ? "blue"
            : label === "Web"
              ? "purple"
              : label === "Mobile App"
                ? "green"
                : "gray";
        return <Tag color={color}>{label}</Tag>;
      },
      responsive: ["md"],
    },
    {
      title: "Amallar",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={loading}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200 mx-auto max-w-7xl min-h-[600px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wide">
            Mijozlar ro'yxati
          </h2>
          <Input
            placeholder="🔍 Qidiruv (Ism yoki Telefon)"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 300 }}
            allowClear
          />
        </div>

        <div className="overflow-auto">
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{ pageSize: 5 }}
            rowClassName={() => "hover:bg-gray-50"}
            scroll={{ x: "max-content" }}
            loading={loading}
            locale={{
              emptyText: (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-gray-500 text-xl font-semibold">
                    Sizda hali mijozlar mijozlar mavjud emas.
                  </p>
                </div>
              ),
            }}
          />
        </div>

        {/* View Modal */}
        <Modal
          title="👤 Mijoz haqida"
          open={viewModal}
          onCancel={() => setViewModal(false)}
          footer={null}
        >
          {selectedCustomer && (
            <div className="flex flex-col gap-2">
              <p>
                <strong>Ismi:</strong> {selectedCustomer.name}
              </p>
              <p>
                <strong>Telefon:</strong> {selectedCustomer.phone || 'N/A'}
              </p>
              <p>
                <strong>Buyurtmalar:</strong> {selectedCustomer.order_count}
              </p>
              <p>
                <strong>Ro'yxatdan o'tgan:</strong>{" "}
                {new Date(selectedCustomer.registered_at).toLocaleString('uz-UZ')}
              </p>
              <p>
                <strong>So'nggi tashrif:</strong> {selectedCustomer.last_visit ? new Date(selectedCustomer.last_visit).toLocaleString('uz-UZ') : 'N/A'}
              </p>
              <p>
                <strong>Platforma:</strong> {PLATFORM_MAP[selectedCustomer.platform] || 'Unknown'}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Customers;