import React, {useState, useMemo} from "react";
import {motion} from "framer-motion";
import {useToast} from "@/hooks/use-toast.ts";

// DeliveryPlatformUI.tsx
// Single-file React component using TailwindCSS + Framer Motion
// - Responsive grid of delivery service cards
// - Search + filter + add modal (local state demo)
// - Card actions: toggle active, edit (modal), quick settings
// - Replace sample data with API calls as needed

type Service = {
    id: string;
    name: string;
    logo?: string; // url
    category: "internal" | "external";
    price?: string; // e.g. "20,000 so'm"
    eta?: string; // e.g. "1-2 kun"
    status: "active" | "inactive";
    region?: string[];
};

const SAMPLE_SERVICES: Service[] = [
    {
        id: "fargo",
        name: "Fargo",
        logo: "https://robosell.uz/static/media/fargo-logo.png",
        category: "external",
        price: "20,000 so'm",
        eta: "1-2 kun",
        status: "active",
        region: ["Toshkent", "Samarqand"],
    },
    {
        id: "uzpost",
        name: "Uzpost",
        logo: "https://robosell.uz/static/media/uzpost-logo.png",
        category: "external",
        price: "15,000 so'm",
        eta: "2-4 kun",
        status: "inactive",
        region: ["Butun O‘zbekiston"],
    },
    {
        id: "inhouse",
        name: "Olib ketish (Bizning yetkazib berish)",
        category: "internal",
        price: "Bepul",
        eta: "30-60 daqiqa",
        status: "active",
        region: ["Toshkent shahri"],
    },
];

export default function DeliveryPlatformUI() {
    const [services, setServices] = useState<Service[]>(SAMPLE_SERVICES);
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Service | null>(null);
    const {toast} = useToast();

    const filtered = useMemo(() => {
        return services.filter((s) => {
            const matchesQuery =
                s.name.toLowerCase().includes(query.toLowerCase()) ||
                (s.category && s.category.includes(query.toLowerCase()));
            const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
            return matchesQuery && matchesCategory;
        });
    }, [services, query, categoryFilter]);

    function toggleStatus(id: string) {
        setServices((prev) => prev.map((s) => (s.id === id ? {
            ...s,
            status: s.status === "active" ? "inactive" : "active"
        } : s)));
    }

    function openEdit(s?: Service) {
        setEditing(s ?? null);
        setShowModal(true);
    }

    function saveService(values: Partial<Service>) {
        if (editing) {
            setServices((prev) => prev.map((p) => (p.id === editing.id ? {...p, ...values} as Service : p)));
        } else {
            const newService: Service = {
                id: (Math.random() * 1e9).toFixed(0),
                name: (values.name as string) || "Yangi xizmat",
                category: (values.category as "internal" | "external") || "external",
                price: values.price || "—",
                eta: values.eta || "—",
                status: (values.status as "active" | "inactive") || "inactive",
            };
            setServices((prev) => [newService, ...prev]);
        }
        setShowModal(false);
        setEditing(null);
    }

    function removeService(id: string) {
        if (!confirm("Haqiqatan ham ushbu xizmatni o'chirmoqchimisiz?")) return;
        setServices((prev) => prev.filter((s) => s.id !== id));
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Yetkazib berish xizmatlari</h2>
                    <p className="text-sm text-slate-500 mt-1">Ichki va tashqi yetkazib berish usullarini bu yerdan
                        boshqaring.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Qidiruv: xizmat, nom yoki kategoriya..."
                            className="w-64 pl-3 pr-10 py-2 border rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                        <button
                            onClick={() => setQuery("")}
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-slate-500 px-2"
                        >
                            Tozalash
                        </button>
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="py-2 px-3 border rounded-md bg-white text-sm shadow-sm"
                    >
                        <option value="all">Barchasi</option>
                        <option value="internal">Ichki</option>
                        <option value="external">Tashqi</option>
                    </select>

                    <button
                        onClick={() => openEdit()}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm"
                    >
                        + Yangi xizmat
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((s) => (
                    <motion.div
                        key={s.id}
                        layout
                        whileHover={{y: -4}}
                        className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg border">
                                {s.logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={s.logo} alt={s.name} className="max-h-12 object-contain"/>
                                ) : (
                                    <div className="text-slate-500 text-lg">📦</div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-800 truncate">{s.name}</h3>
                                        <div className="mt-1 text-sm text-slate-500 truncate">
                                            {s.price} · {s.eta}
                                        </div>
                                    </div>

                                    <div className="text-right">
                    <span
                        className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-md ${
                            s.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-slate-600"
                        }`}
                    >
                      {s.status === "active" ? "Faol" : "Nofaol"}
                    </span>

                                        <div className="mt-2 flex gap-2 justify-end">
                                            <button
                                                onClick={() => toggleStatus(s.id)}
                                                title="Faoliyatni almashtirish"
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-gray-50"
                                            >
                                                {s.status === "active" ? "🔌" : "⚡"}
                                            </button>
                                            <button
                                                onClick={() => openEdit(s)}
                                                title="Tahrirlash"
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-gray-50"
                                            >
                                                ✏️
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 7h18M3 12h18M3 17h18"/>
                                        </svg>
                                        <span>{s.category === "internal" ? "Ichki yetkazib berish" : "Tashqi xizmat"}</span>
                                    </div>

                                    <div className="ml-auto text-xs text-slate-400">ID: {s.id}</div>
                                </div>

                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => toast({
                                            title: "Qo'shimcha amaliyot",
                                            description: "Sozlamalar modali yoki yangi route",
                                            duration: 5000,
                                        })}
                                        className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
                                    >
                                        Sozlash
                                    </button>
                                    <button
                                        onClick={() => removeService(s.id)}
                                        className="text-sm px-3 py-1 rounded-md border text-red-600 hover:bg-red-50"
                                    >
                                        O'chirish
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="mt-10 text-center text-slate-500">Hech qanday xizmat topilmadi. Yangi xizmat qo'shish
                    uchun "Yangi xizmat" tugmasini bosing.</div>
            )}

            {/* Modal (basic) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)}/>
                    <motion.div
                        initial={{scale: 0.96, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        className="relative z-10 w-full max-w-xl bg-white rounded-lg shadow-lg p-6"
                    >
                        <h3 className="text-lg font-semibold">{editing ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}</h3>
                        <div className="mt-4 grid grid-cols-1 gap-3">
                            <label className="text-sm text-slate-600">Nomi</label>
                            <input defaultValue={editing?.name} id="svc-name"
                                   className="w-full px-3 py-2 border rounded-md"/>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-slate-600">Kategoriya</label>
                                    <select defaultValue={editing?.category || "external"} id="svc-cat"
                                            className="w-full px-3 py-2 border rounded-md">
                                        <option value="external">Tashqi</option>
                                        <option value="internal">Ichki</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-slate-600">Narx</label>
                                    <input defaultValue={editing?.price} id="svc-price"
                                           className="w-full px-3 py-2 border rounded-md"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-slate-600">ETA</label>
                                    <input defaultValue={editing?.eta} id="svc-eta"
                                           className="w-full px-3 py-2 border rounded-md"/>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-600">Holati</label>
                                    <select defaultValue={editing?.status || "inactive"} id="svc-status"
                                            className="w-full px-3 py-2 border rounded-md">
                                        <option value="active">Faol</option>
                                        <option value="inactive">Nofaol</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 justify-end mt-4">
                                <button onClick={() => {
                                    setShowModal(false);
                                    setEditing(null);
                                }} className="px-4 py-2 rounded-md border">Bekor qilish
                                </button>
                                <button
                                    onClick={() => {
                                        // read values and save
                                        const name = (document.getElementById("svc-name") as HTMLInputElement).value;
                                        const category = (document.getElementById("svc-cat") as HTMLSelectElement).value as any;
                                        const price = (document.getElementById("svc-price") as HTMLInputElement).value;
                                        const eta = (document.getElementById("svc-eta") as HTMLInputElement).value;
                                        const status = (document.getElementById("svc-status") as HTMLSelectElement).value as any;
                                        saveService({name, category, price, eta, status});
                                    }}
                                    className="px-4 py-2 rounded-md bg-indigo-600 text-white"
                                >
                                    Saqlash
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
