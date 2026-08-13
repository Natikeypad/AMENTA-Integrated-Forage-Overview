import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const statusOptions = ["active", "completed", "planned"] as const;

const emptyForm = {
  title: "", description: "", image: "",
  stat1Value: "", stat1Label: "", stat2Value: "", stat2Label: "",
  stat3Value: "", stat3Label: "", status: "active" as "active" | "completed" | "planned",
};

export default function PortfolioManager() {
  const { data, refetch } = trpc.portfolio.list.useQuery();
  const createMutation = trpc.portfolio.create.useMutation({ onSuccess: () => { refetch(); toast.success("Project added"); } });
  const updateMutation = trpc.portfolio.update.useMutation({ onSuccess: () => { refetch(); toast.success("Project updated"); } });
  const deleteMutation = trpc.portfolio.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });

  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => { setFormState(emptyForm); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (item: any) => {
    setFormState({
      title: item.title || "", description: item.description || "", image: item.image || "",
      stat1Value: item.stat1Value || "", stat1Label: item.stat1Label || "",
      stat2Value: item.stat2Value || "", stat2Label: item.stat2Label || "",
      stat3Value: item.stat3Value || "", stat3Label: item.stat3Label || "",
      status: item.status || "active",
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const set = (field: string, value: any) => setFormState((s) => ({ ...s, [field]: value }));

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formState });
      } else {
        await createMutation.mutateAsync(formState);
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
        <h2 className="text-2xl font-bold text-gray-900">Portfolio / Projects</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Stat 1</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Stat 2</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Stat 3</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "active" ? "bg-green-100 text-green-700" :
                      item.status === "completed" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.stat1Value && `${item.stat1Value} ${item.stat1Label || ""}`}</td>
                  <td className="px-4 py-3 text-gray-500">{item.stat2Value && `${item.stat2Value} ${item.stat2Label || ""}`}</td>
                  <td className="px-4 py-3 text-gray-500">{item.stat3Value && `${item.stat3Value} ${item.stat3Label || ""}`}</td>
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
            <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add"} Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={formState.title} onChange={(e) => set("title", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formState.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" value={formState.image} onChange={(e) => set("image", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formState.status} onChange={(e) => set("status", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">Project Statistics</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Stat 1 Value</label>
                  <input type="text" value={formState.stat1Value} onChange={(e) => set("stat1Value", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. 500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Stat 1 Label</label>
                  <input type="text" value={formState.stat1Label} onChange={(e) => set("stat1Label", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. Hectares" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Stat 2 Value</label>
                  <input type="text" value={formState.stat2Value} onChange={(e) => set("stat2Value", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Stat 2 Label</label>
                  <input type="text" value={formState.stat2Label} onChange={(e) => set("stat2Label", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Stat 3 Value</label>
                  <input type="text" value={formState.stat3Value} onChange={(e) => set("stat3Value", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Stat 3 Label</label>
                  <input type="text" value={formState.stat3Label} onChange={(e) => set("stat3Label", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
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
