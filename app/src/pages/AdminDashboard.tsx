import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import {
  LayoutDashboard, Mail, Newspaper, Image, Shield, Users, FolderOpen,
  TrendingUp, Sprout, Package, Truck, CloudSun, CalendarDays,
  ArrowLeft, Inbox, Send, Eye, Trash2, CheckCircle,
  BarChart3, Activity, ChevronLeft, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

// Admin manager components
import NewsManager from "./admin/NewsManager";
import GalleryManager from "./admin/GalleryManager";
import TeamManager from "./admin/TeamManager";
import PortfolioManager from "./admin/PortfolioManager";
import CropsManager from "./admin/CropsManager";
import InventoryManager from "./admin/InventoryManager";
import SupplyChainManager from "./admin/SupplyChainManager";
import WeatherManager from "./admin/WeatherManager";
import SeasonalPlansManager from "./admin/SeasonalPlansManager";
import AnalyticsPage from "./AnalyticsPage";

type AdminTab = "overview" | "analytics" | "contacts" | "newsletters" | "news" | "gallery" | "team" | "portfolio" | "crops" | "inventory" | "supplychain" | "weather" | "seasonal";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Admin</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <nav className="space-y-1 sticky top-24">
            {[
              { id: "overview" as AdminTab, label: "Overview", icon: LayoutDashboard },
              { id: "analytics" as AdminTab, label: "Analytics", icon: BarChart3 },
              { id: "contacts" as AdminTab, label: "Contact Messages", icon: Mail },
              { id: "newsletters" as AdminTab, label: "Newsletters", icon: Send },
              { id: "news" as AdminTab, label: "News & Blog", icon: Newspaper },
              { id: "gallery" as AdminTab, label: "Gallery", icon: Image },
              { id: "team" as AdminTab, label: "Team Members", icon: Users },
              { id: "portfolio" as AdminTab, label: "Portfolio", icon: FolderOpen },
              { id: "crops" as AdminTab, label: "Crop Management", icon: Sprout },
              { id: "inventory" as AdminTab, label: "Inventory", icon: Package },
              { id: "supplychain" as AdminTab, label: "Supply Chain", icon: Truck },
              { id: "weather" as AdminTab, label: "Weather Data", icon: CloudSun },
              { id: "seasonal" as AdminTab, label: "Seasonal Plans", icon: CalendarDays },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Tab Selector */}
        <div className="lg:hidden mb-4 w-full">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AdminTab)}
            className="w-full px-4 py-2 border rounded-lg text-sm"
          >
            <option value="overview">Overview</option>
            <option value="analytics">Analytics</option>
            <option value="contacts">Contact Messages</option>
            <option value="newsletters">Newsletters</option>
            <option value="news">News & Blog</option>
            <option value="gallery">Gallery</option>
            <option value="team">Team Members</option>
            <option value="portfolio">Portfolio</option>
            <option value="crops">Crop Management</option>
            <option value="inventory">Inventory</option>
            <option value="supplychain">Supply Chain</option>
            <option value="weather">Weather Data</option>
            <option value="seasonal">Seasonal Plans</option>
          </select>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "analytics" && <AnalyticsPage />}
          {activeTab === "contacts" && <ContactsTab />}
          {activeTab === "newsletters" && <NewslettersTab />}
          {activeTab === "news" && <NewsManager />}
          {activeTab === "gallery" && <GalleryManager />}
          {activeTab === "team" && <TeamManager />}
          {activeTab === "portfolio" && <PortfolioManager />}
          {activeTab === "crops" && <CropsManager />}
          {activeTab === "inventory" && <InventoryManager />}
          {activeTab === "supplychain" && <SupplyChainManager />}
          {activeTab === "weather" && <WeatherManager />}
          {activeTab === "seasonal" && <SeasonalPlansManager />}
        </main>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────
function OverviewTab() {
  const { data: contactStats } = trpc.contact.stats.useQuery();
  const { data: newsletterData } = trpc.newsletter.list.useQuery();
  const { data: cropStats } = trpc.crops.stats.useQuery();
  const { data: inventoryStats } = trpc.inventory.stats.useQuery();
  const { data: supplyStats } = trpc.supplyChain.stats.useQuery();
  const { data: weatherStats } = trpc.weather.stats.useQuery();

  const stats = [
    { label: "Total Contacts", value: contactStats?.total ?? 0, icon: Mail, color: "bg-blue-500" },
    { label: "New Messages", value: contactStats?.new ?? 0, icon: Inbox, color: "bg-amber-500" },
    { label: "Newsletter Subscribers", value: newsletterData?.total ?? 0, icon: Send, color: "bg-green-500" },
    { label: "Active Subscribers", value: newsletterData?.active ?? 0, icon: CheckCircle, color: "bg-emerald-500" },
    { label: "Total Crops", value: cropStats?.total ?? 0, icon: Sprout, color: "bg-lime-600" },
    { label: "Growing Now", value: cropStats?.growing ?? 0, icon: TrendingUp, color: "bg-teal-500" },
    { label: "Inventory Items", value: inventoryStats?.total ?? 0, icon: Package, color: "bg-indigo-500" },
    { label: "Low Stock Items", value: inventoryStats?.lowStock ?? 0, icon: Activity, color: "bg-red-500" },
    { label: "Supply Chain Total", value: supplyStats?.total ?? 0, icon: Truck, color: "bg-orange-500" },
    { label: "Supply Value (ETB)", value: `ETB ${(supplyStats?.totalValue ?? 0).toLocaleString()}`, icon: BarChart3, color: "bg-cyan-600" },
    { label: "Avg Temp (30d)", value: `${weatherStats?.avgTemp ?? "--"}°C`, icon: CloudSun, color: "bg-sky-500" },
    { label: "Total Rainfall (30d)", value: `${weatherStats?.totalRainfall ?? "--"}mm`, icon: CloudSun, color: "bg-blue-600" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Contacts Tab ─────────────────────────────────────────────
function ContactsTab() {
  const [page, setPage] = useState(1);
  const { data, refetch } = trpc.contact.list.useQuery({ page, limit: 10 } as any);
  const updateMutation = trpc.contact.updateStatus.useMutation({ onSuccess: () => { refetch(); toast.success("Status updated"); } });
  const deleteMutation = trpc.contact.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.email}</td>
                  <td className="px-4 py-3 text-gray-500">{item.subject}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "new" ? "bg-blue-100 text-blue-700" :
                      item.status === "read" ? "bg-gray-100 text-gray-700" :
                      item.status === "replied" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateMutation.mutate({ id: item.id, status: "read" })} className="p-1 hover:bg-gray-100 rounded" title="Mark as read">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button onClick={() => updateMutation.mutate({ id: item.id, status: "replied" })} className="p-1 hover:bg-gray-100 rounded" title="Mark as replied">
                        <CheckCircle className="w-4 h-4 text-green-500" />
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
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500">Page {page} of {data.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="p-2 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Newsletters Tab ──────────────────────────────────────────
function NewslettersTab() {
  const { data, refetch } = trpc.newsletter.list.useQuery();
  const deleteMutation = trpc.newsletter.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });
  const sendBulkMutation = trpc.newsletter.sendBulk.useMutation({
    onSuccess: (result) => { toast.success(result.message); },
    onError: (err) => { toast.error(err.message); },
  });

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkContent, setBulkContent] = useState("");

  const handleSendBulk = async () => {
    try {
      await sendBulkMutation.mutateAsync({ subject: bulkSubject, content: bulkContent });
      setShowBulkModal(false);
      setBulkSubject("");
      setBulkContent("");
    } catch {
      // error handled by onError
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Newsletter Subscriptions</h2>
        <button onClick={() => setShowBulkModal(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
          <Send className="w-4 h-4" /> Send Newsletter
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Subscribers</p>
          <p className="text-2xl font-bold text-gray-900">{data?.total ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Active Subscribers</p>
          <p className="text-2xl font-bold text-green-600">{data?.active ?? 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Subscribed</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id }); }} className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Send Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold mb-4">Send Newsletter to All Subscribers</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input type="text" value={bulkSubject} onChange={(e) => setBulkSubject(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Newsletter subject line" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML) *</label>
                <textarea value={bulkContent} onChange={(e) => setBulkContent(e.target.value)} rows={8} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Write your newsletter content..." />
              </div>
              <p className="text-xs text-gray-400">Will be sent to {data?.active ?? 0} active subscriber(s)</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowBulkModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSendBulk} disabled={sendBulkMutation.isPending || !bulkSubject || !bulkContent} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                {sendBulkMutation.isPending ? "Sending..." : "Send Newsletter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
