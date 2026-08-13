import { getDb } from "../api/queries/connection";
import { news, gallery, team, portfolio, crops, inventory, supplyChain, weatherData, seasonalPlans } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding essential data...");

  // Seed News
  await db.insert(news).values([
    {
      title: "Amenta Launches New Forage Seed Varieties for 2024",
      slug: "amenta-launches-new-forage-seed-varieties-2024",
      excerpt: "Our research team has developed climate-resilient forage seed varieties specifically adapted to the South Omo region.",
      content: "After months of rigorous testing and field trials, AMENTA is proud to announce the launch of our new line of climate-resilient forage seed varieties.",
      image: "/images/news/forage-harvest.jpg",
      category: "Product Launch",
      tag: "Featured",
      author: "Amenta Communications",
      featured: true,
      published: true,
    },
    {
      title: "DRIVE Project Partnership Expands Irrigation Capacity",
      slug: "drive-project-partnership-expands-irrigation",
      excerpt: "Through our strategic partnership with the DRIVE Project, we have expanded our solar-powered irrigation infrastructure by 40%.",
      content: "The partnership with the DRIVE Project has enabled AMENTA to significantly expand its irrigation infrastructure.",
      image: "/images/gallery/solar-news.jpg",
      category: "Partnership",
      tag: "Infrastructure",
      author: "Project Management Team",
      featured: true,
      published: true,
    },
    {
      title: "Community Training: Modern Livestock Management",
      slug: "community-training-modern-livestock-management",
      excerpt: "Over 200 local pastoralists participated in our latest training program on modern livestock fattening techniques.",
      content: "Our latest community training program brought together over 200 local pastoralists from Nyangatom Woreda.",
      image: "/images/gallery/farming.jpg",
      category: "Community",
      tag: "Training",
      author: "Extension Services",
      featured: false,
      published: true,
    },
    {
      title: "Record Harvest: 50 Tons of Rhodes Grass Hay",
      slug: "record-harvest-50-tons-rhodes-grass-hay",
      excerpt: "Our hay production division achieved a record-breaking harvest of 50 tons of premium Rhodes Grass hay.",
      content: "The hay production division at AMENTA has achieved a remarkable milestone with a record-breaking harvest.",
      image: "/images/gallery/habab9.png",
      category: "Production",
      tag: "Milestone",
      author: "Operations Team",
      featured: false,
      published: true,
    },
    {
      title: "Solar Irrigation Systems Reduce Operating Costs by 30%",
      slug: "solar-irrigation-systems-reduce-costs",
      excerpt: "Our investment in solar-powered irrigation has yielded significant cost savings while promoting sustainable agriculture.",
      content: "The transition to solar-powered irrigation systems has resulted in a 30% reduction in our operating costs.",
      image: "/images/gallery/Solar_Pump1.jpg",
      category: "Sustainability",
      tag: "Innovation",
      author: "Engineering Team",
      featured: true,
      published: true,
    },
    {
      title: "New Live Animal Trading Partnership Announced",
      slug: "new-live-animal-trading-partnership",
      excerpt: "AMENTA has established new trading partnerships with major buyers in Addis Ababa and regional markets.",
      content: "We are excited to announce new strategic partnerships with major livestock buyers.",
      image: "/images/gallery/hero-farmland2.jpg",
      category: "Business",
      tag: "Trading",
      author: "Business Development",
      featured: false,
      published: true,
    },
  ]);
  console.log("News seeded.");

  // Seed Gallery
  await db.insert(gallery).values([
    { title: "Amenta Farmland Overview", image: "/images/gallery/amenta1.png", category: "farm", order: 1 },
    { title: "Habab Forage Program", image: "/images/gallery/habab1.png", category: "forage", order: 2 },
    { title: "Habab Field View", image: "/images/gallery/habab2.png", category: "forage", order: 3 },
    { title: "Habab Processing", image: "/images/gallery/habab3.png", category: "processing", order: 4 },
    { title: "Habab Storage", image: "/images/gallery/habab4.png", category: "storage", order: 5 },
    { title: "Habab Quality Control", image: "/images/gallery/habab5.png", category: "quality", order: 6 },
    { title: "Habab Packaging", image: "/images/gallery/habab6.png", category: "packaging", order: 7 },
    { title: "Habab Distribution", image: "/images/gallery/habab7.png", category: "distribution", order: 8 },
    { title: "Habab Export", image: "/images/gallery/habab8.png", category: "export", order: 9 },
    { title: "Habab Harvest Season", image: "/images/gallery/habab9.png", category: "harvest", order: 10 },
    { title: "Tomato Cultivation", image: "/images/gallery/tomato1.png", category: "crops", order: 11 },
    { title: "Tomato Field Work", image: "/images/gallery/tomato2.png", category: "crops", order: 12 },
    { title: "Tomato Irrigation", image: "/images/gallery/tomato3.png", category: "irrigation", order: 13 },
    { title: "Tomato Harvesting", image: "/images/gallery/tomato4.png", category: "harvest", order: 14 },
    { title: "Tomato Processing", image: "/images/gallery/tomato5.png", category: "processing", order: 15 },
    { title: "Tomato Packing", image: "/images/gallery/tomato6.png", category: "packaging", order: 16 },
    { title: "Solar Pump Installation", image: "/images/gallery/Solar_Pump1.jpg", category: "infrastructure", order: 17 },
    { title: "Solar Panel Array", image: "/images/gallery/Solar_Pump2.jpg", category: "infrastructure", order: 18 },
    { title: "Solar News Feature", image: "/images/gallery/solar-news.jpg", category: "media", order: 19 },
    { title: "Irrigation System", image: "/images/gallery/irrigation.jpg", category: "infrastructure", order: 20 },
    { title: "Farming Operations", image: "/images/gallery/farming.jpg", category: "farm", order: 21 },
    { title: "Premium Farmland", image: "/images/gallery/hero-farmland2.jpg", category: "farm", order: 22 },
  ]);
  console.log("Gallery seeded.");

  // Seed Team
  await db.insert(team).values([
    {
      name: "Tamirat Moja",
      role: "Founder & CEO",
      bio: "Visionary entrepreneur with extensive experience in agribusiness and community development.",
      image: "/images/team/tamrat.jpg",
      email: "tamirat.moja@amenta.et",
      department: "Executive",
      order: 1,
    },
    {
      name: "Abebe Kebede",
      role: "Head of Operations",
      bio: "Agricultural operations specialist with 15+ years of experience managing large-scale farming operations.",
      image: "/images/team/abebe.jpg",
      email: "abebe@amenta.et",
      department: "Operations",
      order: 2,
    },
    {
      name: "Fatuma Hassan",
      role: "Community Relations Manager",
      bio: "Dedicated community development professional bridging the gap between AMENTA and local pastoralist communities.",
      image: "/images/team/fatuma.jpg",
      email: "fatuma@amenta.et",
      department: "Community",
      order: 3,
    },
  ]);
  console.log("Team seeded.");

  // Seed Portfolio
  await db.insert(portfolio).values([
    {
      title: "Habab Forage Development Program",
      description: "Comprehensive forage seed production and distribution program serving pastoral communities.",
      image: "/images/gallery/habab5.png",
      stat1Value: "260+",
      stat1Label: "Hectares",
      stat2Value: "178K",
      stat2Label: "Kg Forage/Year",
      stat3Value: "1,200+",
      stat3Label: "Families Served",
      status: "active",
    },
    {
      title: "Solar Irrigation Expansion",
      description: "Installation of solar-powered irrigation systems to increase water access.",
      image: "/images/gallery/Solar_Pump1.jpg",
      stat1Value: "40%",
      stat1Label: "More Water",
      stat2Value: "30%",
      stat2Label: "Cost Reduction",
      stat3Value: "25ha",
      stat3Label: "New Cultivation",
      status: "active",
    },
    {
      title: "Community Training Center",
      description: "Training facility for local pastoralists to learn modern livestock management.",
      image: "/images/gallery/farming.jpg",
      stat1Value: "200+",
      stat1Label: "Trained",
      stat2Value: "15",
      stat2Label: "Workshops/Year",
      stat3Value: "95%",
      stat3Label: "Satisfaction",
      status: "active",
    },
  ]);
  console.log("Portfolio seeded.");

  // Seed Crops
  await db.insert(crops).values([
    { name: "Panicum", variety: "Panicum maximum", type: "forage_seed", fieldLocation: "Field A - North Block", areaHectares: 35, plantingDate: new Date("2024-03-15"), expectedYield: 4200, actualYield: 3850, yieldUnit: "kg", status: "harvested", notes: "Good germination rate" },
    { name: "Rhodes Grass", variety: "Chloris gayana", type: "hay_fodder", fieldLocation: "Field B - Riverside", areaHectares: 28, plantingDate: new Date("2024-04-01"), expectedYield: 5600, actualYield: 5200, yieldUnit: "kg", status: "harvested", notes: "Premium hay quality" },
    { name: "Sudan Grass", variety: "Sorghum sudanense", type: "hay_fodder", fieldLocation: "Field C - Central", areaHectares: 20, plantingDate: new Date("2024-07-01"), expectedYield: 3000, actualYield: null, yieldUnit: "kg", status: "growing", notes: "Second season planting" },
    { name: "Cowpea", variety: "Vigna unguiculata", type: "forage_seed", fieldLocation: "Field D - East Block", areaHectares: 12, plantingDate: new Date("2024-06-15"), expectedYield: 1800, actualYield: null, yieldUnit: "kg", status: "growing", notes: "Nitrogen fixation" },
    { name: "Desmodium", variety: "Desmodium intortum", type: "forage_seed", fieldLocation: "Field E - West Block", areaHectares: 8, plantingDate: new Date("2024-05-01"), expectedYield: 960, actualYield: null, yieldUnit: "kg", status: "growing", notes: "Companion planting" },
  ]);
  console.log("Crops seeded.");

  // Seed Inventory
  await db.insert(inventory).values([
    { name: "Panicum Seeds", category: "seed", sku: "SEED-PAN-001", quantity: 1500, unit: "kg", minStockLevel: 500, reorderPoint: 750, costPerUnit: 85, supplier: "AMENTA Seed Bank", location: "Warehouse A" },
    { name: "Rhodes Grass Seeds", category: "seed", sku: "SEED-RHO-001", quantity: 1200, unit: "kg", minStockLevel: 400, reorderPoint: 600, costPerUnit: 95, supplier: "AMENTA Seed Bank", location: "Warehouse A" },
    { name: "NPK Fertilizer", category: "fertilizer", sku: "FERT-NPK-001", quantity: 2500, unit: "kg", minStockLevel: 1000, reorderPoint: 1500, costPerUnit: 45, supplier: "Ethiopian Fertilizer Co.", location: "Warehouse B" },
    { name: "Diesel Fuel", category: "fuel", sku: "FUE-DIE-001", quantity: 500, unit: "L", minStockLevel: 200, reorderPoint: 300, costPerUnit: 85, supplier: "Total Ethiopia", location: "Fuel Station" },
  ]);
  console.log("Inventory seeded.");

  // Seed Supply Chain
  await db.insert(supplyChain).values([
    { productName: "Premium Panicum Seeds", productType: "forage_seed", batchNumber: "PS-2024-001", sourceField: "Field A", quantity: 3500, unit: "kg", harvestDate: new Date("2024-08-15"), storageLocation: "Warehouse A", status: "in_storage", quality: "premium", pricePerUnit: 120, totalValue: 420000 },
    { productName: "Fattened Bulls - Batch 1", productType: "live_animal", batchNumber: "LB-2024-001", sourceField: "Feedlot A", quantity: 45, unit: "heads", harvestDate: new Date("2024-09-20"), storageLocation: "Feedlot A", transportDate: new Date("2024-09-25"), deliveryDate: new Date("2024-09-26"), destination: "Addis Ababa Market", status: "delivered", quality: "premium", buyerName: "Habtamu Livestock Trading", buyerContact: "+251 911 234 567", pricePerUnit: 85000, totalValue: 3825000 },
    { productName: "Rhodes Grass Hay Bales", productType: "hay_fodder", batchNumber: "RH-2024-001", sourceField: "Field B", quantity: 5000, unit: "kg", harvestDate: new Date("2024-09-01"), storageLocation: "Hay Barn", status: "in_storage", quality: "premium", pricePerUnit: 25, totalValue: 125000 },
  ]);
  console.log("Supply chain seeded.");

  // Seed Weather Data
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"];
  const baseDate = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    await db.insert(weatherData).values({
      date: date,
      temperature: 22 + Math.random() * 12,
      humidity: 40 + Math.random() * 40,
      rainfall: Math.random() > 0.7 ? Math.random() * 25 : 0,
      windSpeed: 5 + Math.random() * 20,
      windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      uvIndex: Math.random() * 10,
      soilMoisture: 20 + Math.random() * 60,
      forecast: false,
    });
  }
  console.log("Weather data seeded.");

  // Seed Seasonal Plans
  await db.insert(seasonalPlans).values([
    { season: "Meher (Main)", year: 2024, cropName: "Panicum", plannedArea: 35, expectedYieldPerHectare: 120, plantingStartDate: new Date("2024-03-01"), plantingEndDate: new Date("2024-03-31"), harvestStartDate: new Date("2024-08-01"), harvestEndDate: new Date("2024-09-15"), waterRequirement: 450, fertilizerPlan: "NPK at planting, Urea top-dress at 4 weeks", status: "completed" },
    { season: "Belg (Short Rain)", year: 2025, cropName: "Sudan Grass", plannedArea: 25, expectedYieldPerHectare: 150, plantingStartDate: new Date("2025-03-01"), plantingEndDate: new Date("2025-03-20"), harvestStartDate: new Date("2025-06-01"), harvestEndDate: new Date("2025-07-15"), waterRequirement: 350, fertilizerPlan: "Basal NPK + foliar feed at flowering", status: "approved" },
    { season: "Meher (Main)", year: 2025, cropName: "Panicum", plannedArea: 40, expectedYieldPerHectare: 130, plantingStartDate: new Date("2025-03-01"), plantingEndDate: new Date("2025-03-31"), harvestStartDate: new Date("2025-08-01"), harvestEndDate: new Date("2025-09-15"), waterRequirement: 480, fertilizerPlan: "Enhanced NPK + micronutrient blend", status: "draft" },
  ]);
  console.log("Seasonal plans seeded.");

  console.log("All essential data seeded successfully!");
}

seed().catch(console.error);
