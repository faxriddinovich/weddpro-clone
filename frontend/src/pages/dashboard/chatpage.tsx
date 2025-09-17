import React, { useEffect, useRef, useState } from "react";
import { Avatar, Badge } from "antd";
import { MessageOutlined, CheckOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/button";

interface Message {
  from: "me" | "user";
  text: string;
  time: string;
  read: boolean;
}

interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
  messages: Message[];
  unread: boolean;
  online: boolean;
}

const initialUsers: ChatUser[] = [
  {
    id: 1,
    name: "Ali",
    avatar: "https://i.pravatar.cc/150?img=3",
    unread: true,
    online: true,
    messages: [
      {
        from: "user",
        text: "Salom, ishlaring qalay?",
        time: "10:00",
        read: true,
      },
      {
        from: "me",
        text: "Yaxshi, rahmat!",
        time: "10:01",
        read: true,
      },
    ],
  },
  {
    id: 2,
    name: "Laylo",
    avatar: "https://i.pravatar.cc/150?img=5",
    unread: false,
    online: false,
    messages: [
      {
        from: "user",
        text: "Ok, rahmat 🙂",
        time: "12:30",
        read: true,
      },
    ],
  },
];

const ChatPage: React.FC = () => {
  const [users, setUsers] = useState<ChatUser[]>(initialUsers);
  const [activeChatId, setActiveChatId] = useState<number>(users[0].id);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeUser = users.find((u) => u.id === activeChatId)!;

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedUsers = users.map((u) =>
      u.id === activeUser.id
        ? {
            ...u,
            messages: [
              ...u.messages,
              {
                from: "me",
                text: newMessage,
                time: new Date().toLocaleTimeString().slice(0, 5),
                read: false,
              },
            ],
          }
        : u
    );

    setUsers(updatedUsers);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [users, activeChatId]);

  return (
    <div className="flex h-screen bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Chap panel - kontaktlar */}
      <div className="w-[300px] bg-white border-r rounded-l-lg overflow-y-auto">
        <div className="p-4 text-lg font-semibold border-b">Xabarlar</div>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              setActiveChatId(user.id);
              setUsers((prev) =>
                prev.map((u) =>
                  u.id === user.id ? { ...u, unread: false } : u
                )
              );
            }}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
              activeChatId === user.id ? "bg-gray-100" : ""
            }`}
          >
            <Badge
              dot={user.online}
              offset={[-6, 32]}
              color="green"
            >
              <Avatar src={user.avatar} size="large" icon={<MessageOutlined />} />
            </Badge>
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-gray-500 text-sm truncate w-[200px]">
                {user.messages[user.messages.length - 1]?.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* O‘ng panel - chat oynasi */}
      <div className="flex-1 bg-[#fafafa] flex flex-col rounded-r-lg">
        <div className="p-4 border-b font-medium flex items-center gap-2">
          <Avatar src={activeUser.avatar} />
          <div>{activeUser.name}</div>
          {activeUser.online && (
            <span className="ml-2 text-green-500 text-xs">(Online)</span>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {activeUser.messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[70%] px-4 py-2 rounded-xl shadow-sm relative ${
                msg.from === "me"
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              <div>{msg.text}</div>
              <div className="text-xs text-right opacity-70 mt-1 flex items-center justify-end gap-1">
                {msg.time}
                {msg.from === "me" && (
                  <>
                    {msg.read ? (
                      <>
                        <CheckOutlined style={{ fontSize: 12, color: "#fff" }} />
                        <CheckOutlined style={{ fontSize: 12, color: "#fff" }} />
                      </>
                    ) : (
                      <CheckOutlined style={{ fontSize: 12, color: "#ccc" }} />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            placeholder="Xabar yozing..."
            className="flex-1 border px-3 py-2 rounded-lg outline-none"
          />
          <Button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Yuborish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
