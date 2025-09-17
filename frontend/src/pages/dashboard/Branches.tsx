import { useState, useEffect } from "react";
import { Edit2, Pencil, Trash2, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import location from "@/images/icons8-location-50.png";
import { getBranches, createBranch, updateBranch, deleteBranch, Branch } from "@/services/branchService";

const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newBranch, setNewBranch] = useState<Omit<Branch, "id">>({
    nomi: "",
    manzil: "",
    telefon: "",
    masul_shaxs: "",
    sana: new Date().toISOString().split("T")[0],
    isActive: true,
  });
  const [errors, setErrors] = useState({ nomi: "", manzil: "", telefon: "", masul_shaxs: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Backenddan filiallarni olish
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const data = await getBranches();
        setBranches(data);
      } catch (err: any) {
        setError(err.message || "Filiallarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const validateForm = () => {
    const newErrors = { nomi: "", manzil: "", telefon: "", masul_shaxs: "" };
    let isValid = true;

    if (!newBranch.nomi) {
      newErrors.nomi = "Filial nomi kiritilishi shart";
      isValid = false;
    }
    if (!newBranch.manzil) {
      newErrors.manzil = "Manzil kiritilishi shart";
      isValid = false;
    }
    if (!newBranch.telefon || !/^\+998[0-9]{9}$/.test(newBranch.telefon)) {
      newErrors.telefon = "Telefon raqami to'g'ri formatda bo'lishi kerak (+998901234567)";
      isValid = false;
    }
    if (!newBranch.masul_shaxs) {
      newErrors.masul_shaxs = "Mas'ul shaxs kiritilishi shart";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddBranch = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const createdBranch = await createBranch(newBranch);
      setBranches([...branches, createdBranch]);
      setShowModal(false);
      setNewBranch({
        nomi: "",
        manzil: "",
        telefon: "",
        masul_shaxs: "",
        sana: new Date().toISOString().split("T")[0],
        isActive: true,
      });
      setErrors({ nomi: "", manzil: "", telefon: "", masul_shaxs: "" });
    } catch (err: any) {
      setError(err.message || "Filial qo'shishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBranch = async (id: number) => {
    try {
      setLoading(true);
      const updatedBranch = await updateBranch(id, { ...newBranch, id });
      setBranches(branches.map((b) => (b.id === id ? updatedBranch : b)));
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || "Filialni yangilashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteBranch(id);
      setBranches(branches.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err.message || "Filialni o'chirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = (id: number) => {
    const branch = branches.find((b) => b.id === id);
    if (branch) {
      handleUpdateBranch(id);
    }
  };

  const filtered = branches.filter((b) =>
    b.nomi.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="h-full w-full flex">
      {/* Asosiy container - min-height bilan */}
      <div className="flex-1 p-4 bg-white rounded-xl shadow-lg border border-gray-200 space-y-6 max-w-7xl mx-auto min-h-[600px] flex flex-col">
        {error && <div className="text-red-500">{error}</div>}
        {loading && <div className="text-gray-500">Yuklanmoqda...</div>}
        
        {/* Header qismi */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <img src={location} alt="location" className="w-6 h-6" />
            Filiallar
          </h2>
          <Button
            onClick={() => setShowModal(true)}
            variant="outline"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            + Filial qo'shish
          </Button>
        </div>

        {/* Qidiruv qismi */}
        <input
          type="text"
          placeholder="🔎 Filial nomi bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />

        {/* Jadval kontayner - flex-1 bilan */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Filial nomi</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Manzil</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Telefon</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Mas'ul shaxs</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Holat</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((branch) => (
                  <tr key={branch.id} className="border-b hover:bg-gray-50 text-sm transition-colors duration-150">
                    <td className="px-4 py-3 font-medium">{branch.nomi}</td>
                    <td className="px-4 py-3">{branch.manzil}</td>
                    <td className="px-4 py-3">{branch.telefon}</td>
                    <td className="px-4 py-3">{branch.masul_shaxs}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={branch.isActive}
                          onCheckedChange={() => toggleActive(branch.id)}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          {branch.isActive ? "Faol" : "NoFaol"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setNewBranch({ ...branch, sana: branch.sana });
                          setShowModal(true);
                        }}
                        className="p-2 rounded-md transition-colors duration-150"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(branch.id)}
                        className="p-2 rounded-md transition-colors duration-150"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Bo'sh holat xabari - jadval containerining pastida */}
          {filtered.length === 0 && !loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 py-12">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Hech qanday filial topilmadi</h3>
                <p className="text-gray-500">Yangi filial qo'shish uchun yuqoridagi tugmani bosing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity duration-300">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl transform transition-all duration-300 scale-100 sm:max-w-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-150"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="mb-5 text-xl font-bold text-gray-800">
              {newBranch.id ? "Filialni tahrirlash" : "Yangi filial qo'shish"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Filial nomi</label>
                <input
                  type="text"
                  placeholder="Chilonzor filiali"
                  value={newBranch.nomi}
                  onChange={(e) => setNewBranch({ ...newBranch, nomi: e.target.value })}
                  className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.nomi ? "border-red-500" : ""}`}
                />
                {errors.nomi && <p className="text-red-500 text-xs mt-1">{errors.nomi}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manzil</label>
                <input
                  type="text"
                  placeholder="Chilonzor"
                  value={newBranch.manzil}
                  onChange={(e) => setNewBranch({ ...newBranch, manzil: e.target.value })}
                  className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.manzil ? "border-red-500" : ""}`}
                />
                {errors.manzil && <p className="text-red-500 text-xs mt-1">{errors.manzil}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefon raqami</label>
                <input
                  type="tel"
                  placeholder="+998901234567"
                  value={newBranch.telefon}
                  onChange={(e) => setNewBranch({ ...newBranch, telefon: e.target.value })}
                  className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.telefon ? "border-red-500" : ""}`}
                />
                {errors.telefon && <p className="text-red-500 text-xs mt-1">{errors.telefon}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mas'ul shaxs</label>
                <input
                  type="text"
                  placeholder="Masalan: Aliyev Valijon"
                  value={newBranch.masul_shaxs}
                  onChange={(e) => setNewBranch({ ...newBranch, masul_shaxs: e.target.value })}
                  className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.masul_shaxs ? "border-red-500" : ""}`}
                />
                {errors.masul_shaxs && <p className="text-red-500 text-xs mt-1">{errors.masul_shaxs}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newBranch.isActive}
                  onCheckedChange={(val) => setNewBranch({ ...newBranch, isActive: val })}
                  className="data-[state=checked]:bg-green-500"
                />
                <span className="text-sm text-gray-700">
                  {newBranch.isActive ? "Faol" : "NoFaol"}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={newBranch.id ? () => handleUpdateBranch(newBranch.id) : handleAddBranch}
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{newBranch.id ? "Yangilanmoqda..." : "Qo'shilmoqda..."}</span>
                  </div>
                ) : newBranch.id ? "Yangilash" : "Qo'shish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;