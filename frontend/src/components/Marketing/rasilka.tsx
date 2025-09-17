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
import { Plus, Search, Edit, Trash2 } from "lucide-react"; // Icons uchun lucide-react (shadcn bilan mos)
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
import toast from "react-hot-toast"; // Toast xabarlari uchun (shadcn toast qo'shing: npx shadcn-ui@latest add toast)
import { DeleteOutlined } from "@ant-design/icons";

interface RassilkaType {
  key: string;
  title: string;
  description: string; // Yangi: tarifi (description)
  totalUsers: number;
  sent: number;
  failed: number;
  clicks: number;
  sentDate: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Rassilka nomi kiritilishi shart" }),
  description: z.string().min(1, { message: "Tarif (tavsif) kiritilishi shart" }),
});

const Rasilka: React.FC = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<RassilkaType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RassilkaType | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Kelajak backend integratsiyasi misoli
  // useEffect(() => {
  //   // Fetch data from backend
  //   fetch('/api/rassilka')
  //     .then(res => res.json())
  //     .then(setData)
  //     .catch(() => toast({ title: "Xato", description: "Ma'lumotlarni yuklab bo'lmadi", variant: "destructive" }));
  // }, []);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const openDialog = (item?: RassilkaType) => {
    if (item) {
      setEditingItem(item);
      form.setValue("title", item.title);
      form.setValue("description", item.description);
    } else {
      form.reset();
      setEditingItem(null);
    }
    setIsOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingItem) {
      // Edit
      const updated = data.map((item) =>
        item.key === editingItem.key
          ? { ...item, title: values.title, description: values.description }
          : item
      );
      setData(updated);
      toast.success("Rassilka yaratildi");
      // Backend: fetch(`/api/rassilka/${editingItem.key}`, { method: 'PUT', body: JSON.stringify(values) });
    } else {
      // Add
      const newItem: RassilkaType = {
        key: Date.now().toString(),
        title: values.title,
        description: values.description,
        totalUsers: 0, // Default, backend hisoblaydi
        sent: 0,
        failed: 0,
        clicks: 0,
        sentDate: new Date().toLocaleString(),
      };
      setData([...data, newItem]);
      toast.success("Rassilka yaratildi");
      // Backend: fetch('/api/rassilka', { method: 'POST', body: JSON.stringify(newItem) });
    }
    setIsOpen(false);
    form.reset();
    setEditingItem(null);
  };

  const handleDelete = (key: string) => {
    setData(data.filter((item) => item.key !== key));
    toast.success("Rassilka o'chirildi");
    // Backend: fetch(`/api/rassilka/${key}`, { method: 'DELETE' });
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Rassilka
          <span className="text-sm text-muted-foreground ml-2">
            {data.length} ta
          </span>
        </h2>
      </div>

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-4 rounded-lg border">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rassilka nomi bo'yicha qidiring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Rassilka yaratish
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Rassilkani tahrirlash" : "Yangi rassilka yaratish"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rassilka nomi</FormLabel>
                      <FormControl>
                        <Input placeholder="Nomi kiriting" {...field} />
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
                      <FormLabel>Tarifi (tavsif)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tavsif kiriting" {...field} />
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
                    {editingItem ? "Saqlash" : "Yaratish"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table or Empty State */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No rassilka"
            className="mx-auto mb-4 w-32 h-32 opacity-50"
          />
          <p className="text-lg text-muted-foreground">
            Sizda rassilka yo'q
          </p>
        </div>
      ) : (
        <Table>
          <TableCaption>Rassilka ro'yxati</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Rassilka nomi</TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tarifi</TableHead> {/* Yangi kolonna */}
              <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Umumiy foydalanuvchilar</TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Yuborilgan sana</TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.key}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.totalUsers}</TableCell>
                <TableCell>{item.sentDate}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.key)}
                    className="text-destructive"
                  >
                    <DeleteOutlined className="cursor-pointer w-6 h-6 text-red-600 hover:opacity-80" />
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

export default Rasilka;