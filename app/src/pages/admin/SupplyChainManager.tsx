import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const productTypes = ["forage_seed", "hay_fodder", "live_animal", "meat", "other"] as const;
const statuses = ["cultivating", "harvested", "in_storage", "in_transport", "delivered", "sold"] as const;
const qualities = ["premium", "standard", "below_standard"] as const;

const emptyForm = {
  productName: "", productType: "other" as string, batchNumber: "", sourceField: "",
  quantity: "", unit: "", harvestDate: "", storageLocation: "", storageDate: "",
  transportDate: "", deliveryDate: "", destination: "", status: "cultivating" as string,
  quality: "standard" as string, buyerName: "", buyerContact: "",
  pricePerUnit: "", totalValue: "", notes: "",
};

export default function SupplyChainManager() {
  const { data, refetch } = trpc.supplyChain.list.useQuery({ limit: 50 });
  const createMutation = trpc.supplyChain.create.useMutation({ onSuccess: () => { refetch(); toast.success("Entry added"); } });
  const updateMutation = trpc.supplyChain.update.useMutation({ onSuccess: () => { refetch(); toast.success("Entry updated"); } });
  const deleteMutation = trpc.supplyChain.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });

  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => { setFormState(emptyForm); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (item: any) => {
    setFormState({
      productName: item.productName || "", productType: item.productType || "other",
      batchNumber: item.batchNumber || "", sourceField: item.sourceField || "",
      quantity: item.quantity?.toString() || "", unit: item.unit || "",
      harvestDate: item.harvestDate ? new Date(item.harvestDate).toISOString().split("T")[0] : "",
      storageLocation: item.storageLocation || "",
      storageDate: item.storageDate ? new Date(item.storageDate).toISOString().split("T")[0] : "",
      transportDate: item.transportDate ? new Date(item.transportDate).toISOString().split("T")[0] : "",
      deliveryDate: item.deliveryDate ? new Date(item.deliveryDate).toISOString().split("T")[0] : "",
      destination: item.destination || "", status: item.status || "cultivating",
      quality: item.quality || "standard", buyerName: item.buyerName || "",
      buyerContact: item.buyerContact || "", pricePerUnit: item.pricePerUnit?.toString() || "",
      totalValue: item.totalValue?.toString() || "", notes: item.notes || "",
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const set = (field: string, value: any) => setFormState((s) => ({ ...s, [field]: value }));

  const handleSubmit = async () => {
    try {
      const payload: any = {
        productName: formState.productName,
        productType: formState.productType as any,
        batchNumber: formState.batchNumber || undefined, sourceField: formState.sourceField || undefined,
        quantity: formState.quantity ? parseFloat(formState.quantity) : undefined,
        unit: formState.unit || undefined,
        harvestDate: formState.harvestDate || undefined, storageLocation: formState.storageLocation || undefined,
        storageDate: formState.storageDate || undefined, transportDate: formState.transportDate || undefined,
        deliveryDate: formState.deliveryDate || undefined, destination: formState.destination || undefined,
        status: formState.status as any, quality: formState.quality as any,
        buyerName: formState.buyerName || undefined, buyerContact: formState.buyerContact || undefined,
        pricePerUnit: formState.pricePerUnit ? parseFloat(formState.pricePerUnit) : undefined,
        totalValue: formState.totalValue ? parseFloat(formState.totalValue) : undefined,
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
        <h2 className="text-2xl font-bold text-gray-900">Supply Chain</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Product</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Batch</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Quantity</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Value</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.productName}</td>
                  <td className="px-4 py-3 text-gray-500">{item.productType}</td>
                  <td className="px-4 py-3 text-gray-500">{item.batchNumber}</td>
                  <td className="px-4 py-3 text-gray-500">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "delivered" || item.status === "sold" ? "bg-green-100 text-green-700" :
                      item.status === "in_transport" ? "bg-blue-100 text-blue-700" :
                      item.status === "in_storage" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>{item.status?.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.totalValue ? `ETB ${item.totalValue.toLocaleString()}` : "-"}</td>
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
            <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add"} Supply Chain Entry</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input type="text" value={formState.productName} onChange={(e) => set("productName", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <select value={formState.productType} onChange={(e) => set("productType", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    {productTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                  <input type="text" value={formState.batchNumber} onChange={(e) => set("batchNumber", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" step="0.1" value={formState.quantity} onChange={(e) => set("quantity", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input type="text" value={formState.unit} onChange={(e) => set("unit", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="kg, tons..." />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formState.status} onChange={(e) => set("status", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                  <select value={formState.quality} onChange={(e) => set("quality", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    {qualities.map((q) => <option key={q} value={q}>{q.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Field</label>
                  <input type="text" value={formState.sourceField} onChange={(e) => set("sourceField", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                  <input type="date" value={formState.harvestDate} onChange={(e) => set("harvestDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                  <input type="text" value={formState.storageLocation} onChange={(e) => set("storageLocation", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Date</label>
                  <input type="date" value={formState.storageDate} onChange={(e) => set("storageDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transport Date</label>
                  <input type="date" value={formState.transportDate} onChange={(e) => set("transportDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                  <input type="date" value={formState.deliveryDate} onChange={(e) => set("deliveryDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input type="text" value={formState.destination} onChange={(e) => set("destination", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Name</label>
                  <input type="text" value={formState.buyerName} onChange={(e) => set("buyerName", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Contact</label>
                  <input type="text" value={formState.buyerContact} onChange={(e) => set("buyerContact", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price/Unit (ETB)</label>
                  <input type="number" step="0.01" value={formState.pricePerUnit} onChange={(e) => set("pricePerUnit", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Value (ETB)</label>
                  <input type="number" step="0.01" value={formState.totalValue} onChange={(e) => set("totalValue", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
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
