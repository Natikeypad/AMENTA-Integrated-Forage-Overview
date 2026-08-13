import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

const emptyForm = {
  title: "", slug: "", excerpt: "", content: "", image: "",
  category: "", tag: "", author: "", featured: false, published: true,
};

export default function NewsManager() {
  const { data, refetch } = trpc.news.list.useQuery({ limit: 50 });
  const createMutation = trpc.news.create.useMutation({ onSuccess: () => { refetch(); toast.success("Post created"); } });
  const updateMutation = trpc.news.update.useMutation({ onSuccess: () => { refetch(); toast.success("Post updated"); } });
  const deleteMutation = trpc.news.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });

  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => { setFormState(emptyForm); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (item: any) => {
    setFormState({
      title: item.title || "", slug: item.slug || "", excerpt: item.excerpt || "",
      content: item.content || "", image: item.image || "", category: item.category || "",
      tag: item.tag || "", author: item.author || "",
      featured: item.featured ?? false, published: item.published ?? true,
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const set = (field: string, value: any) =>
    setFormState((s) => {
      const next = { ...s, [field]: value };
      if (field === "title" && !editingId) next.slug = generateSlug(value);
      return next;
    });

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
        <h2 className="text-2xl font-bold text-gray-900">News & Blog Posts</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Author</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Featured</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Published</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500">{item.category}</td>
                  <td className="px-4 py-3 text-gray-500">{item.author}</td>
                  <td className="px-4 py-3">
                    {item.featured ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
                  </td>
                  <td className="px-4 py-3">
                    {item.published ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(item)} className="p-1 hover:bg-gray-100 rounded" title="Edit">
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </button>
                      <button onClick={() => { if (confirm("Delete this post?")) deleteMutation.mutate({ id: item.id }); }} className="p-1 hover:bg-gray-100 rounded" title="Delete">
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
            <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Create New"} Post</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" value={formState.title} onChange={(e) => set("title", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Post title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input type="text" value={formState.slug} onChange={(e) => set("slug", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-gray-50" placeholder="auto-generated-slug" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea value={formState.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Short summary..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea value={formState.content} onChange={(e) => set("content", e.target.value)} rows={6} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Write your post content..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" value={formState.image} onChange={(e) => set("image", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={formState.category} onChange={(e) => set("category", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. Farming" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                  <input type="text" value={formState.tag} onChange={(e) => set("tag", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. forage" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input type="text" value={formState.author} onChange={(e) => set("author", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Author name" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formState.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  Featured Post
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formState.published} onChange={(e) => set("published", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  Published
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
