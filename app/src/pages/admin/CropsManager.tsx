import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const cropTypes = ["forage_seed", "hay_fodder", "grain", "vegetable", "other"] as const;
const cropStatuses = ["planned", "planted", "growing", "harvesting", "harvested", "failed"] as const;

const emptyForm = {
  name: "", variety: "", type: "forage_seed" as string, fieldLocation: "",
  areaHectares: "", plantingDate: "", harvestDate: "", expectedYield: "",
  actualYield: "", yieldUnit: "kg", status: "planned" as string, notes: "",
};

export default function CropsManager() {
  const [page, setPage] = useState(1);
  const { data, refetch } = trpc.crops.list.useQuery({ page, limit: 10 });
  const createMutation = trpc.crops.create.useMutation({ onSuccess: () => { refetch(); toast.success("Crop added"); } });
  const updateMutation = trpc.crops.update.useMutation({ onSuccess: () => { refetch(); toast.success("Crop updated"); } });
  const deleteMutation = trpc.crops.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });

  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => { setFormState(emptyForm); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (item: any) => {
    setFormState({
      name: item.name || "", variety: item.variety || "", type: item.type || "forage_seed",
      fieldLocation: item.fieldLocation || "", areaHectares: item.areaHectares?.toString() || "",
      plantingDate: item.plantingDate ? new Date(item.plantingDate).toISOString().split("T")[0] : "",
      harvestDate: item.harvestDate ? new Date(item.harvestDate).toISOString().split("T")[0] : "",
      expectedYield: item.expectedYield?.toString() || "", actualYield: item.actualYield?.toString() || "",
      yieldUnit: item.yieldUnit || "kg", status: item.status || "planned", notes: item.notes || "",
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const set = (field: string, value: any) => setFormState((s) => ({ ...s, [field]: value }));

  const handleSubmit = async () => {
    try {
      const payload: any = {
        name: formState.name,
        variety: formState.variety || undefined,
        type: formState.type as any,
        fieldLocation: formState.fieldLocation || undefined,
        areaHectares: formState.areaHectares ? parseFloat(formState.areaHectares) : undefined,
        plantingDate: formState.plantingDate || undefined,
        harvestDate: formState.harvestDate || undefined,
        expectedYield: formState.expectedYield ? parseFloat(formState.expectedYield) : undefined,
        actualYield: formState.actualYield ? parseFloat(formState.actualYield) : undefined,
        yieldUnit: formState.yieldUnit || undefined,
        status: formState.status as any,
        notes: formState.notes || undefined,
      };
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Crop Management</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Crop
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Variety</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Area (ha)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.variety}</td>
                  <td className="px-4 py-3 text-gray-500">{item.type}</td>
                  <td className="px-4 py-3 text-gray-500">{item.areaHectares}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "growing" ? "bg-green-100 text-green-700" :
                      item.status === "harvested" ? "bg-blue-100 text-blue-700" :
                      item.status === "planted" ? "bg-amber-100 text-amber-700" :
                      item.status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(item)} className="p-1 hover:bg-gray-100 rounded" title="Edit">
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </button>
                      <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id }); }} className="p-1 hover:bg-gray-100 rounded" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm text-gray-500">Page {page} of {data.totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="p-2 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add"} Crop</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={formState.name} onChange={(e) => set("name", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Crop name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
                  <input type="text" value={formState.variety} onChange={(e) => set("variety", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. Rhodes Grass" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={formState.type} onChange={(e) => set("type", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    {cropTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field Location</label>
                  <input type="text" value={formState.fieldLocation} onChange={(e) => set("fieldLocation", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. Field A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (hectares)</label>
                  <input type="number" step="0.1" value={formState.areaHectares} onChange={(e) => set("areaHectares", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="0.0" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planting Date</label>
                  <input type="date" value={formState.plantingDate} onChange={(e) => set("plantingDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                  <input type="date" value={formState.harvestDate} onChange={(e) => set("harvestDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Yield</label>
                  <input type="number" step="0.1" value={formState.expectedYield} onChange={(e) => set("expectedYield", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual Yield</label>
                  <input type="number" step="0.1" value={formState.actualYield} onChange={(e) => set("actualYield", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yield Unit</label>
                  <input type="text" value={formState.yieldUnit} onChange={(e) => set("yieldUnit", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="kg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={formState.status} onChange={(e) => set("status", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                  {cropStatuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={formState.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Optional notes..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{isSubmitting ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
