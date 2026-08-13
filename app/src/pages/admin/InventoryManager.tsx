import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const categories = ["seed", "fertilizer", "pesticide", "feed", "equipment", "fuel", "other"] as const;

const emptyForm = {
  name: "", category: "other" as string, sku: "", quantity: "", unit: "units",
  minStockLevel: "", reorderPoint: "", costPerUnit: "", supplier: "", location: "", notes: "",
};

export default function InventoryManager() {
  const [page] = useState(1);
  const { data, refetch } = trpc.inventory.list.useQuery({ page, limit: 20 });
  const createMutation = trpc.inventory.create.useMutation({ onSuccess: () => { refetch(); toast.success("Item added"); } });
  const updateMutation = trpc.inventory.update.useMutation({ onSuccess: () => { refetch(); toast.success("Item updated"); } });
  const deleteMutation = trpc.inventory.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });

  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => { setFormState(emptyForm); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (item: any) => {
    setFormState({
      name: item.name || "", category: item.category || "other", sku: item.sku || "",
      quantity: item.quantity?.toString() || "0", unit: item.unit || "units",
      minStockLevel: item.minStockLevel?.toString() || "", reorderPoint: item.reorderPoint?.toString() || "",
      costPerUnit: item.costPerUnit?.toString() || "", supplier: item.supplier || "",
      location: item.location || "", notes: item.notes || "",
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const set = (field: string, value: any) => setFormState((s) => ({ ...s, [field]: value }));

  const handleSubmit = async () => {
    try {
      const payload: any = {
        name: formState.name,
        category: formState.category as any,
        sku: formState.sku || undefined,
        quantity: formState.quantity ? parseFloat(formState.quantity) : 0,
        unit: formState.unit,
        minStockLevel: formState.minStockLevel ? parseFloat(formState.minStockLevel) : undefined,
        reorderPoint: formState.reorderPoint ? parseFloat(formState.reorderPoint) : undefined,
        costPerUnit: formState.costPerUnit ? parseFloat(formState.costPerUnit) : undefined,
        supplier: formState.supplier || undefined,
        location: formState.location || undefined,
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
        <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Quantity</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Min Stock</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Cost/Unit</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Supplier</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.items.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${item.quantity <= (item.minStockLevel ?? 0) ? "bg-red-50" : ""}`}>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.category}</td>
                  <td className="px-4 py-3 text-gray-500">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-3 text-gray-500">{item.minStockLevel}</td>
                  <td className="px-4 py-3 text-gray-500">{item.costPerUnit ? `ETB ${item.costPerUnit}` : "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{item.supplier || "-"}</td>
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
            <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add"} Inventory Item</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={formState.name} onChange={(e) => set("name", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Item name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formState.category} onChange={(e) => set("category", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" value={formState.sku} onChange={(e) => set("sku", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="SKU-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" step="0.1" value={formState.quantity} onChange={(e) => set("quantity", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input type="text" value={formState.unit} onChange={(e) => set("unit", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="kg, liters, bags..." />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Level</label>
                  <input type="number" step="0.1" value={formState.minStockLevel} onChange={(e) => set("minStockLevel", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Point</label>
                  <input type="number" step="0.1" value={formState.reorderPoint} onChange={(e) => set("reorderPoint", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Unit (ETB)</label>
                  <input type="number" step="0.01" value={formState.costPerUnit} onChange={(e) => set("costPerUnit", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input type="text" value={formState.supplier} onChange={(e) => set("supplier", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Supplier name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                  <input type="text" value={formState.location} onChange={(e) => set("location", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Warehouse A" />
                </div>
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
