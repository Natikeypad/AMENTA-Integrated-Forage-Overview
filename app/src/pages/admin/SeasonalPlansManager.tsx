import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const statusOptions = ["draft", "approved", "in_progress", "completed", "cancelled"] as const;

const emptyForm = {
  season: "", year: new Date().getFullYear().toString(), cropName: "",
  plannedArea: "", expectedYieldPerHectare: "", plantingStartDate: "",
  plantingEndDate: "", harvestStartDate: "", harvestEndDate: "",
  waterRequirement: "", fertilizerPlan: "", notes: "", status: "draft" as string,
};

export default function SeasonalPlansManager() {
  const { data, refetch } = trpc.seasonalPlans.list.useQuery({ limit: 50 });
  const createMutation = trpc.seasonalPlans.create.useMutation({ onSuccess: () => { refetch(); toast.success("Plan created"); } });
  const updateMutation = trpc.seasonalPlans.update.useMutation({ onSuccess: () => { refetch(); toast.success("Plan updated"); } });
  const deleteMutation = trpc.seasonalPlans.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });

  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => { setFormState(emptyForm); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (item: any) => {
    setFormState({
      season: item.season || "", year: item.year?.toString() || "", cropName: item.cropName || "",
      plannedArea: item.plannedArea?.toString() || "",
      expectedYieldPerHectare: item.expectedYieldPerHectare?.toString() || "",
      plantingStartDate: item.plantingStartDate ? new Date(item.plantingStartDate).toISOString().split("T")[0] : "",
      plantingEndDate: item.plantingEndDate ? new Date(item.plantingEndDate).toISOString().split("T")[0] : "",
      harvestStartDate: item.harvestStartDate ? new Date(item.harvestStartDate).toISOString().split("T")[0] : "",
      harvestEndDate: item.harvestEndDate ? new Date(item.harvestEndDate).toISOString().split("T")[0] : "",
      waterRequirement: item.waterRequirement?.toString() || "",
      fertilizerPlan: item.fertilizerPlan || "", notes: item.notes || "",
      status: item.status || "draft",
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const set = (field: string, value: any) => setFormState((s) => ({ ...s, [field]: value }));

  const handleSubmit = async () => {
    try {
      const payload: any = {
        season: formState.season, year: parseInt(formState.year), cropName: formState.cropName,
        plannedArea: formState.plannedArea ? parseFloat(formState.plannedArea) : undefined,
        expectedYieldPerHectare: formState.expectedYieldPerHectare ? parseFloat(formState.expectedYieldPerHectare) : undefined,
        plantingStartDate: formState.plantingStartDate || undefined,
        plantingEndDate: formState.plantingEndDate || undefined,
        harvestStartDate: formState.harvestStartDate || undefined,
        harvestEndDate: formState.harvestEndDate || undefined,
        waterRequirement: formState.waterRequirement ? parseFloat(formState.waterRequirement) : undefined,
        fertilizerPlan: formState.fertilizerPlan || undefined,
        notes: formState.notes || undefined,
        status: formState.status as any,
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
        <h2 className="text-2xl font-bold text-gray-900">Seasonal Plans</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> New Plan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Season</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Year</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Crop</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Planned Area</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Expected Yield/ha</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.season}</td>
                  <td className="px-4 py-3">{item.year}</td>
                  <td className="px-4 py-3">{item.cropName}</td>
                  <td className="px-4 py-3">{item.plannedArea} ha</td>
                  <td className="px-4 py-3">{item.expectedYieldPerHectare}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "in_progress" ? "bg-green-100 text-green-700" :
                      item.status === "approved" ? "bg-blue-100 text-blue-700" :
                      item.status === "completed" ? "bg-gray-100 text-gray-500" :
                      item.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>{item.status?.replace(/_/g, " ")}</span>
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
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Create"} Seasonal Plan</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Season *</label>
                  <input type="text" value={formState.season} onChange={(e) => set("season", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. Meher, Belg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input type="number" value={formState.year} onChange={(e) => set("year", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
                  <input type="text" value={formState.cropName} onChange={(e) => set("cropName", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planned Area (ha)</label>
                  <input type="number" step="0.1" value={formState.plannedArea} onChange={(e) => set("plannedArea", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Yield/ha</label>
                  <input type="number" step="0.1" value={formState.expectedYieldPerHectare} onChange={(e) => set("expectedYieldPerHectare", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Water Req. (m³)</label>
                  <input type="number" step="0.1" value={formState.waterRequirement} onChange={(e) => set("waterRequirement", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planting Start</label>
                  <input type="date" value={formState.plantingStartDate} onChange={(e) => set("plantingStartDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planting End</label>
                  <input type="date" value={formState.plantingEndDate} onChange={(e) => set("plantingEndDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Start</label>
                  <input type="date" value={formState.harvestStartDate} onChange={(e) => set("harvestStartDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harvest End</label>
                  <input type="date" value={formState.harvestEndDate} onChange={(e) => set("harvestEndDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={formState.status} onChange={(e) => set("status", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                  {statusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer Plan</label>
                <textarea value={formState.fertilizerPlan} onChange={(e) => set("fertilizerPlan", e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Describe fertilizer application plan..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={formState.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
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
