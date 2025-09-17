import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const notifications = [
  { id: 1, title: "New Order", message: "You received a new order #1234", time: "2m ago" },
  { id: 2, title: "User Registered", message: "John Doe has registered", time: "10m ago" },
  { id: 3, title: "Stock Alert", message: "Product A is low in stock", time: "1h ago" },
  { id: 4, title: "Feedback", message: "New feedback received", time: "3h ago" },
  // ... add more to test scrolling
];

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="relative cursor-pointer hover:bg-gray-100 p-6 rounded-full hover:bg-muted transition"
      >
        <Bell className="w-14 h-14 text-gray-700 dark:text-white" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping" />
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 max-w-[95vw] bg-white dark:bg-zinc-900 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b dark:border-zinc-700 font-semibold text-lg">
              Notifications
            </div>
            <div className="max-h-[350px] overflow-y-auto custom-scroll px-4 py-2 space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition cursor-pointer"
                >
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {n.message}
                  </div>
                  <div className="text-xs text-right text-gray-400">{n.time}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
