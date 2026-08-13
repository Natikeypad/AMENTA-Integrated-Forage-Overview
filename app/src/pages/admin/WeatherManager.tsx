import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyForm = {
  date: "", temperature: "", humidity: "", rainfall: "", windSpeed: "",
  windDirection: "", condition: "", uvIndex: "", soilMoisture: "", forecast: false,
};

export default function WeatherManager() {
  const { data, refetch } = trpc.weather.list.useQuery({ limit: 30 });
  const createMutation = trpc.weather.create.useMutation({ onSuccess: () => { refetch(); toast.success("Record added"); } });
  const updateMutation = trpc.weather.update.useMutation({ onSuccess: () => { refetch(); toast.success("Record updated"); } });
  const deleteMutation = trpc.weather.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });

  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => { setFormState(emptyForm); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (item: any) => {
    setFormState({
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      temperature: item.temperature?.toString() || "", humidity: item.humidity?.toString() || "",
      rainfall: item.rainfall?.toString() || "", windSpeed: item.windSpeed?.toString() || "",
      windDirection: item.windDirection || "", condition: item.condition || "",
      uvIndex: item.uvIndex?.toString() || "", soilMoisture: item.soilMoisture?.toString() || "",
      forecast: item.forecast ?? false,
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const set = (field: string, value: any) => setFormState((s) => ({ ...s, [field]: value }));

  const handleSubmit = async () => {
    try {
      const payload: any = {
        date: formState.date,
        temperature: formState.temperature ? parseFloat(formState.temperature) : undefined,
        humidity: formState.humidity ? parseFloat(formState.humidity) : undefined,
        rainfall: formState.rainfall ? parseFloat(formState.rainfall) : undefined,
        windSpeed: formState.windSpeed ? parseFloat(formState.windSpeed) : undefined,
        windDirection: formState.windDirection || undefined,
        condition: formState.condition || undefined,
        uvIndex: formState.uvIndex ? parseFloat(formState.uvIndex) : undefined,
        soilMoisture: formState.soilMoisture ? parseFloat(formState.soilMoisture) : undefined,
        forecast: formState.forecast,
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
        <h2 className="text-2xl font-bold text-gray-900">Weather Data</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Temp (°C)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Humidity (%)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Rainfall (mm)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Wind (km/h)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Condition</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.date ? new Date(item.date).toLocaleDateString() : ""}</td>
                  <td className="px-4 py-3">{item.temperature}</td>
                  <td className="px-4 py-3">{item.humidity}</td>
                  <td className="px-4 py-3">{item.rainfall}</td>
                  <td className="px-4 py-3">{item.windSpeed}</td>
                  <td className="px-4 py-3 text-gray-500">{item.condition}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.forecast ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                      {item.forecast ? "Forecast" : "Actual"}
                    </span>
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
            <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add"} Weather Record</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" value={formState.date} onChange={(e) => set("date", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <input type="text" value={formState.condition} onChange={(e) => set("condition", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. Sunny, Rainy" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                  <input type="number" step="0.1" value={formState.temperature} onChange={(e) => set("temperature", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
                  <input type="number" step="0.1" value={formState.humidity} onChange={(e) => set("humidity", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rainfall (mm)</label>
                  <input type="number" step="0.1" value={formState.rainfall} onChange={(e) => set("rainfall", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wind Speed (km/h)</label>
                  <input type="number" step="0.1" value={formState.windSpeed} onChange={(e) => set("windSpeed", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wind Direction</label>
                  <input type="text" value={formState.windDirection} onChange={(e) => set("windDirection", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="N, NE, S..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UV Index</label>
                  <input type="number" step="0.1" value={formState.uvIndex} onChange={(e) => set("uvIndex", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soil Moisture (%)</label>
                  <input type="number" step="0.1" value={formState.soilMoisture} onChange={(e) => set("soilMoisture", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm pb-2">
                    <input type="checkbox" checked={formState.forecast} onChange={(e) => set("forecast", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    This is a forecast (not actual data)
                  </label>
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
