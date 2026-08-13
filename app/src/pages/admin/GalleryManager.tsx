import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyForm = { title: "", description: "", image: "", category: "", order: 0 };

export default function GalleryManager() {
  const { data, refetch } = trpc.gallery.list.useQuery();
  const createMutation = trpc.gallery.create.useMutation({ onSuccess: () => { refetch(); toast.success("Image added"); } });
  const updateMutation = trpc.gallery.update.useMutation({ onSuccess: () => { refetch(); toast.success("Image updated"); } });
  const deleteMutation = trpc.gallery.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });

  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => { setFormState(emptyForm); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (item: any) => {
    setFormState({ title: item.title || "", description: item.description || "", image: item.image || "", category: item.category || "", order: item.order ?? 0 });
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
        <h2 className="text-2xl font-bold text-gray-900">Gallery Images</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group">
            <div className="h-32 overflow-hidden">
              <img src={item.image} alt={item.title || ""} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{item.title || "Untitled"}</p>
              <p className="text-xs text-gray-400">{item.category}</p>
              <div className="flex items-center gap-1 mt-2">
                <button onClick={() => openEdit(item)} className="p-1 hover:bg-blue-50 rounded">
                  <Pencil className="w-3 h-3 text-blue-500" />
                </button>
                <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id }); }} className="p-1 hover:bg-red-50 rounded">
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add"} Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={formState.title} onChange={(e) => set("title", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Image title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input type="text" value={formState.image} onChange={(e) => set("image", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formState.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Optional description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={formState.category} onChange={(e) => set("category", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. Farm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input type="number" value={formState.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
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
