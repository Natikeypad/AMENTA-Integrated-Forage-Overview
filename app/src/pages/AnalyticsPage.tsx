import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  CloudSun, Sprout, Package, Truck, TrendingUp, Droplets, Thermometer, Wind, Sun, 
  AlertTriangle, ArrowUpRight, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon 
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from "recharts";

// Premium color palettes for charts
const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
const CROP_STATUS_COLORS: Record<string, string> = {
  planned: "#9ca3af", // gray
  planted: "#60a5fa", // light blue
  growing: "#10b981", // green
  harvesting: "#fbbf24", // amber
  harvested: "#3b82f6", // dark blue
  failed: "#ef4444", // red
};

export default function AnalyticsPage() {
  const [activeView, setActiveView] = useState<"operations" | "weather">("weather");

  // Query tRPC stats
  const cropsStats = trpc.crops.stats.useQuery();
  const inventoryStats = trpc.inventory.stats.useQuery();
  const supplyChainStats = trpc.supplyChain.stats.useQuery();
  const weatherStats = trpc.weather.stats.useQuery();
  
  // Recent lists
  const weatherHistory = trpc.weather.list.useQuery({ limit: 7 });
  const latestWeather = trpc.weather.latest.useQuery();
  const inventoryList = trpc.inventory.list.useQuery({ limit: 5, lowStock: true });

  const isStatsLoading = 
    cropsStats.isLoading || 
    inventoryStats.isLoading || 
    supplyChainStats.isLoading || 
    weatherStats.isLoading ||
    weatherHistory.isLoading ||
    latestWeather.isLoading;

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Pre-process weather chart data
  const weatherChartData = weatherHistory.data ? [...weatherHistory.data]
    .reverse()
    .map(w => ({
      date: new Date(w.date).toLocaleDateString("en-US", { weekday: "short" }),
      temp: Number(w.temperature || 0),
      rain: Number(w.rainfall || 0),
      humidity: Number(w.humidity || 0),
      soilMoisture: Number(w.soilMoisture || 0),
    })) : [];

  // Pre-process crops pie chart data
  const cropsPieData = cropsStats.data ? [
    { name: "Growing", value: cropsStats.data.growing, color: CROP_STATUS_COLORS.growing },
    { name: "Harvested", value: cropsStats.data.harvested, color: CROP_STATUS_COLORS.harvested },
    { name: "Planned/Other", value: Math.max(0, cropsStats.data.total - cropsStats.data.growing - cropsStats.data.harvested), color: CROP_STATUS_COLORS.planned }
  ].filter(d => d.value > 0) : [];

  // Pre-process inventory chart data
  const inventoryChartData = inventoryStats.data?.byCategory?.map(cat => ({
    category: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    value: Number(cat.totalValue || 0),
    count: cat.count,
  })) || [];

  // Pre-process supply chain product type values
  const supplyChainTypeData = supplyChainStats.data?.byType?.map((t, idx) => ({
    name: t.productType.replace("_", " ").toUpperCase(),
    value: Number(t.totalValue || 0),
    color: COLORS[idx % COLORS.length]
  })) || [];

  return (
    <div className="space-y-8">
      {/* Dashboard Heading & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Farm Analytics & Metrics</h1>
          <p className="text-gray-500 mt-1">Real-time data visualization of AMENTA agricultural production and weather patterns.</p>
        </div>
        
        {/* Toggle navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit self-start md:self-auto">
          <button
            onClick={() => setActiveView("weather")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeView === "weather" 
                ? "bg-white text-green-700 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <CloudSun className="w-4 h-4" /> Weather Analytics
          </button>
          <button
            onClick={() => setActiveView("operations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeView === "operations" 
                ? "bg-white text-green-700 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Operations Overview
          </button>
        </div>
      </div>

      {activeView === "operations" ? (
        /* ================= OPERATIONS VIEW ================= */
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Main Operational Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden border-none shadow-md bg-gradient-to-br from-green-50 to-emerald-100/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-emerald-800 uppercase tracking-wider">Total Area Cultivated</p>
                    <h3 className="text-3xl font-bold text-emerald-950">{cropsStats.data?.totalArea.toFixed(1)} <span className="text-lg font-normal">Ha</span></h3>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-700">
                    <Sprout className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{cropsStats.data?.growing} fields currently growing</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-100/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-indigo-800 uppercase tracking-wider">Total Harvested Yield</p>
                    <h3 className="text-3xl font-bold text-indigo-950">{cropsStats.data?.totalYield.toLocaleString()} <span className="text-lg font-normal">Kg</span></h3>
                  </div>
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-700">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-indigo-800">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{cropsStats.data?.harvested} crops fully harvested</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-orange-100/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-amber-800 uppercase tracking-wider">Inventory Assets Value</p>
                    <h3 className="text-3xl font-bold text-amber-950">${inventoryStats.data?.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-700">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{inventoryStats.data?.lowStock} low stock items flagged</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-fuchsia-100/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800 uppercase tracking-wider">Supply Chain Value</p>
                    <h3 className="text-3xl font-bold text-purple-950">${supplyChainStats.data?.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-700">
                    <Truck className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-purple-800">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{supplyChainStats.data?.total} batches in distribution</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Operational Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Crop Types & Status Pie Chart */}
            <Card className="shadow-sm border border-gray-200 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
                  <PieChartIcon className="w-5 h-5 text-green-600" /> Crops Status Share
                </CardTitle>
                <CardDescription>Visual breakdown of agricultural crop production status.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-4">
                {cropsPieData.length > 0 ? (
                  <>
                    <div className="w-full h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={cropsPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {cropsPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} Crops`, "Status Share"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Pie Legends */}
                    <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                      {cropsPieData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-xs font-semibold text-gray-700">{d.name}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 py-16 text-center text-sm font-medium">No crops records seeded.</div>
                )}
              </CardContent>
            </Card>

            {/* Inventory Assets Category Value Bar Chart */}
            <Card className="shadow-sm border border-gray-200 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
                  <BarChart3 className="w-5 h-5 text-green-600" /> Inventory Value by Category
                </CardTitle>
                <CardDescription>Financial distribution of stock assets values per main category.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {inventoryChartData.length > 0 ? (
                  <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={inventoryChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="category" stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}`} />
                        <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "Asset Value"]} />
                        <Bar dataKey="value" fill="#34d399" radius={[6, 6, 0, 0]} barSize={40}>
                          {inventoryChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-gray-400 py-24 text-center text-sm font-medium">No inventory records seeded.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Lower Ops Row: Supply Chain & Low Stock Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Supply Chain Type Donut Chart */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
                  <Truck className="w-5 h-5 text-green-600" /> Product Supply Chain Worth
                </CardTitle>
                <CardDescription>Total valuation distribution of logistics batches by product type.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center justify-around p-6">
                {supplyChainTypeData.length > 0 ? (
                  <>
                    <div className="w-[180px] h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={supplyChainTypeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {supplyChainTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "Batch Value"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Value legend list */}
                    <div className="space-y-3 mt-4 md:mt-0 w-full md:w-auto">
                      {supplyChainTypeData.map((t, i) => (
                        <div key={i} className="flex justify-between md:justify-start items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: t.color }} />
                            <span className="text-xs font-semibold text-gray-600">{t.name}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-800">${t.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 py-16 text-center text-sm font-medium w-full">No supply chain data recorded.</div>
                )}
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
                  <AlertTriangle className="w-5 h-5 text-red-500" /> Low Stock Inventory Alerts
                </CardTitle>
                <CardDescription>Critical items requiring immediate reorder to prevent operational downtime.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {inventoryList.data?.items && inventoryList.data.items.length > 0 ? (
                  <div className="divide-y max-h-[220px] overflow-y-auto">
                    {inventoryList.data.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 hover:bg-red-50/30 transition-colors">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Supplier: {item.supplier || "Not specified"}</p>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div className="text-xs">
                            <span className="text-red-600 font-bold text-sm">{item.quantity}</span>
                            <span className="text-gray-500 ml-1">{item.unit}</span>
                          </div>
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-100 text-red-700">
                            Min: {item.minStockLevel || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 py-16 text-center text-sm font-medium flex flex-col items-center justify-center gap-2">
                    <span className="text-green-500 bg-green-50 p-3 rounded-full">✓</span>
                    All inventory levels are currently secure!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      ) : (
        /* ================= WEATHER VIEW ================= */
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Latest Weather Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Main Climate Conditions Panel */}
            <Card className="md:col-span-1 overflow-hidden border-none shadow-md bg-gradient-to-br from-green-700 to-emerald-900 text-white">
              <CardContent className="p-6 flex flex-col justify-between h-full min-h-[280px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold tracking-wider text-green-100">LATEST CLIMATE</h3>
                    <p className="text-xs text-green-200 mt-0.5">
                      {latestWeather.data ? new Date(latestWeather.data.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : "No records"}
                    </p>
                  </div>
                  <CloudSun className="w-10 h-10 text-amber-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
                </div>
                
                {latestWeather.data ? (
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black">{latestWeather.data.temperature}°</span>
                      <span className="text-2xl font-semibold text-green-200">C</span>
                    </div>
                    <p className="text-lg font-bold text-green-50 capitalize">{latestWeather.data.condition || "Clear"}</p>
                  </div>
                ) : (
                  <p className="text-green-200 text-sm">No weather records logged.</p>
                )}

                <div className="grid grid-cols-2 gap-4 border-t border-green-600/40 pt-4 text-xs mt-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-300" />
                    <span>Soil: {latestWeather.data?.soilMoisture || 0}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-400" />
                    <span>UV Index: {latestWeather.data?.uvIndex || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Conditions List */}
            <Card className="md:col-span-2 shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Current Local Parameters</CardTitle>
                <CardDescription>Live readings from Nyangatom South Omo telemetry stations.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Avg Temperature</p>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-red-500" />
                    <span className="text-xl font-bold text-gray-900">{latestWeather.data?.temperature || 0}°C</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Humidity</p>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <span className="text-xl font-bold text-gray-900">{latestWeather.data?.humidity || 0}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Rainfall</p>
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-5 h-5 text-teal-500" />
                    <span className="text-xl font-bold text-gray-900">{latestWeather.data?.rainfall || 0} mm</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Wind Velocity</p>
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-gray-500" />
                    <span className="text-xl font-bold text-gray-900">{latestWeather.data?.windSpeed || 0} km/h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historical Weather Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Temperature Trend Line Chart */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
                  <LineChartIcon className="w-5 h-5 text-green-600" /> Temperature & Soil Moisture Trend
                </CardTitle>
                <CardDescription>7-day micro-climate fluctuation analysis.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {weatherChartData.length > 0 ? (
                  <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weatherChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorSoil" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Area type="monotone" name="Temperature (°C)" dataKey="temp" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
                        <Area type="monotone" name="Soil Moisture (%)" dataKey="soilMoisture" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSoil)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-gray-400 py-24 text-center text-sm font-medium">No weather history recorded.</div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Precipitation Bar Chart */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
                  <BarChart3 className="w-5 h-5 text-green-600" /> Daily Precipitation Levels
                </CardTitle>
                <CardDescription>Daily rainfall totals measured in millimeters.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {weatherChartData.length > 0 ? (
                  <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weatherChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} unit=" mm" />
                        <Tooltip formatter={(v) => [`${v} mm`, "Rainfall"]} />
                        <Bar dataKey="rain" name="Rainfall" fill="#60a5fa" radius={[6, 6, 0, 0]} barSize={35} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-gray-400 py-24 text-center text-sm font-medium">No precipitation history recorded.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 30-Day Aggregated Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-sm border border-gray-100 bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-orange-50 rounded-2xl text-orange-600">
                  <Thermometer className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">30-Day Average Temp</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{weatherStats.data?.avgTemp || 0} °C</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-100 bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">30-Day Average Humidity</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{weatherStats.data?.avgHumidity || 0} %</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-100 bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-cyan-50 rounded-2xl text-cyan-600">
                  <CloudSun className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">30-Day Total Rainfall</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{weatherStats.data?.totalRainfall || 0} mm</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
