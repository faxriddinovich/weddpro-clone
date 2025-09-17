import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, Edit2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { DeleteOutlined } from "@ant-design/icons";

interface ResourceType {
  key: string;
  title: string;
  link: string;
  description: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Nomi kiritilishi shart" }),
  link: z.string().url({ message: "To‘g‘ri URL kiriting" }),
  description: z.string().min(1, { message: "Izoh kiritilishi shart" }),
});

const Resources: React.FC = () => {
  const [data, setData] = useState<ResourceType[]>([
    {
      key: "1",
      title: "Najot Ta'lim",
      link: "https://najottalim.uz",
      description: "Frontend va backend o‘quv kurslari",
    },
    {
      key: "2",
      title: "MDN Web Docs",
      link: "https://developer.mozilla.org",
      description: "HTML, CSS, JS rasmiy hujjatlari",
    },
  ]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceType | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", link: "", description: "" },
  });

  // Kelajakda backenddan ma'lumot olish uchun
  // useEffect(() => {
  //   fetch('/api/resources')
  //     .then(res => res.json())
  //     .then(setData)
  //     .catch(() => toast.error("Ma'lumotlarni yuklashda xato"));
  // }, []);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const openDialog = (item?: ResourceType) => {
    if (item) {
      setEditingItem(item);
      form.setValue("title", item.title);
      form.setValue("link", item.link);
      form.setValue("description", item.description);
    } else {
      form.reset();
      setEditingItem(null);
    }
    setIsOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingItem) {
      // Tahrirlash
      const updated = data.map((item) =>
        item.key === editingItem.key ? { ...item, ...values } : item
      );
      setData(updated);
      toast.success("Manba tahrirlandi");
      // Backend: fetch(`/api/resources/${editingItem.key}`, { method: 'PUT', body: JSON.stringify(values) });
    } else {
      // Yangi qo'shish
      const newItem: ResourceType = {
        key: Date.now().toString(),
        ...values,
      };
      setData([...data, newItem]);
      toast.success("Yangi manba qo‘shildi");
      // Backend: fetch('/api/resources', { method: 'POST', body: JSON.stringify(newItem) });
    }
    setIsOpen(false);
    form.reset();
    setEditingItem(null);
  };

  const handleDelete = (key: string) => {
    setData(data.filter((item) => item.key !== key));
    toast.success("Manba o‘chirildi");
    // Backend: fetch(`/api/resources/${key}`, { method: 'DELETE' });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Sarlavha */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          Manbalar
          <span className="text-sm text-muted-foreground ml-2">
            {data.length} ta
          </span>
        </h2>
      </div>

      {/* Qidiruv va Qo'shish */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-4 rounded-lg border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Manba nomi bo‘yicha qidirish"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Yangi manba
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Manbani tahrirlash" : "Yangi manba qo‘shish"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomi</FormLabel>
                      <FormControl>
                        <Input placeholder="Manba nomini kiriting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Izoh</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Manba haqida qisqacha" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"  
                    type="submit">
                    {editingItem ? "Saqlash" : "Qo‘shish"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Jadval yoki Bo'sh holat */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No resources"
            className="mx-auto mb-4 w-32 h-32 opacity-50"
          />
          <p className="text-lg text-muted-foreground">Sizda manbalar yo‘q</p>
        </div>
      ) : (
        <Table>
          <TableCaption>Manbalar ro‘yxati</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Nomi
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Link
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Izoh
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Amallar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.key} className="hover:bg-muted/50">
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {item.link}
                  </a>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDialog(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.key)}
                    className="text-red-600 border-red-500 hover:bg-red-100 hover:text-red-500"
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Resources;