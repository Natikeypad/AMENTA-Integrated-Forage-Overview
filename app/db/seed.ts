import { getDb } from "../api/queries/connection";
import {
  users,
  contacts,
  newsletters,
  news,
  gallery,
  team,
  portfolio,
  crops,
  inventory,
  supplyChain,
  weatherData,
  seasonalPlans,
} from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed News
  const newsItems = [
    {
      title: "Amenta Launches New Forage Seed Varieties for 2024",
      slug: "amenta-launches-new-forage-seed-varieties-2024",
      excerpt: "Our research team has developed climate-resilient forage seed varieties specifically adapted to the South Omo region's unique agro-ecological conditions.",
      content: "After months of rigorous testing and field trials, AMENTA is proud to announce the launch of our new line of climate-resilient forage seed varieties. These seeds have been specifically bred and selected to thrive in the South Omo region's unique agro-ecological conditions, offering local farmers higher yields and better drought tolerance.",
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
      content: "The partnership with the Southern Ethiopia Irrigation and Lowland Development Project (DRIVE) has enabled AMENTA to significantly expand its irrigation infrastructure. The new solar-powered pumping systems have increased our water delivery capacity by 40%, allowing us to cultivate an additional 25 hectares of land.",
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
      content: "Our latest community training program brought together over 200 local pastoralists from Nyangatom Woreda and surrounding areas. The comprehensive three-day workshop covered modern livestock fattening techniques, nutritional feed formulation, animal health management, and market access strategies.",
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
      content: "The hay production division at AMENTA has achieved a remarkable milestone with a record-breaking harvest of 50 tons of premium Rhodes Grass hay. This achievement represents a 35% increase over last season's production and demonstrates the effectiveness of our improved cultivation practices.",
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
      content: "The transition to solar-powered irrigation systems has resulted in a 30% reduction in our operating costs while significantly reducing our carbon footprint. This sustainable approach to farming demonstrates our commitment to environmental stewardship and long-term operational efficiency.",
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
      content: "We are excited to announce new strategic partnerships with major livestock buyers in Addis Ababa and other regional markets. These partnerships will ensure consistent market access for our premium fattened bulls and provide stable income streams for our operations.",
      image: "/images/gallery/hero-farmland2.jpg",
      category: "Business",
      tag: "Trading",
      author: "Business Development",
      featured: false,
      published: true,
    },
  ];

  for (const item of newsItems) {
    await db.insert(news).values(item);
  }
  console.log("News seeded.");

  // Seed Gallery
  const galleryItems = [
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
  ];

  for (const item of galleryItems) {
    await db.insert(gallery).values(item);
  }
  console.log("Gallery seeded.");

  // Seed Team
  const teamMembers = [
    {
      name: "Tamirat Moja",
      role: "Founder & CEO",
      bio: "Visionary entrepreneur with extensive experience in agribusiness and community development. Tamirat founded AMENTA with a mission to transform Ethiopia's livestock value chain through integrated agricultural practices.",
      image: "/images/team/tamrat.jpg",
      email: "tamirat.moja@amenta.et",
      department: "Executive",
      order: 1,
    },
    {
      name: "Abebe Kebede",
      role: "Head of Operations",
      bio: "Agricultural operations specialist with 15+ years of experience managing large-scale farming operations across East Africa.",
      image: "/images/team/abebe.jpg",
      email: "abebe@amenta.et",
      department: "Operations",
      order: 2,
    },
    {
      name: "Fatuma Hassan",
      role: "Community Relations Manager",
      bio: "Dedicated community development professional bridging the gap between AMENTA and local pastoralist communities through education and empowerment programs.",
      image: "/images/team/fatuma.jpg",
      email: "fatuma@amenta.et",
      department: "Community",
      order: 3,
    },
  ];

  for (const member of teamMembers) {
    await db.insert(team).values(member);
  }
  console.log("Team seeded.");

  // Seed Portfolio
  const portfolioItems = [
    {
      title: "Habab Forage Development Program",
      description: "Comprehensive forage seed production and distribution program serving pastoral communities across South Omo Zone with high-yielding, climate-resilient varieties.",
      image: "/images/gallery/habab5.png",
      stat1Value: "260+",
      stat1Label: "Hectares",
      stat2Value: "178K",
      stat2Label: "Kg Forage/Year",
      stat3Value: "1,200+",
      stat3Label: "Families Served",
      status: "active" as const,
    },
    {
      title: "Solar Irrigation Expansion",
      description: "Installation of solar-powered irrigation systems to increase water access and reduce dependency on seasonal rainfall patterns.",
      image: "/images/gallery/Solar_Pump1.jpg",
      stat1Value: "40%",
      stat1Label: "More Water",
      stat2Value: "30%",
      stat2Label: "Cost Reduction",
      stat3Value: "25ha",
      stat3Label: "New Cultivation",
      status: "active" as const,
    },
    {
      title: "Community Training Center",
      description: "Establishment of a training facility for local pastoralists to learn modern livestock management and sustainable forage cultivation techniques.",
      image: "/images/gallery/farming.jpg",
      stat1Value: "200+",
      stat1Label: "Trained",
      stat2Value: "15",
      stat2Label: "Workshops/Year",
      stat3Value: "95%",
      stat3Label: "Satisfaction",
      status: "active" as const,
    },
  ];

  for (const item of portfolioItems) {
    await db.insert(portfolio).values(item);
  }
  console.log("Portfolio seeded.");

  // Seed Crops
  const cropItems = [
    {
      name: "Panicum",
      variety: "Panicum maximum",
      type: "forage_seed" as const,
      fieldLocation: "Field A - North Block",
      areaHectares: 35,
      plantingDate: new Date("2024-03-15"),
      expectedYield: 4200,
      actualYield: 3850,
      yieldUnit: "kg",
      status: "harvested" as const,
      notes: "Good germination rate, slightly lower yield due to late rains",
    },
    {
      name: "Rhodes Grass",
      variety: "Chloris gayana",
      type: "hay_fodder" as const,
      fieldLocation: "Field B - Riverside",
      areaHectares: 28,
      plantingDate: new Date("2024-04-01"),
      expectedYield: 5600,
      actualYield: 5200,
      yieldUnit: "kg",
      status: "harvested" as const,
      notes: "Excellent hay quality, premium grade",
    },
    {
      name: "Sudan Grass",
      variety: "Sorghum sudanense",
      type: "hay_fodder" as const,
      fieldLocation: "Field C - Central",
      areaHectares: 20,
      plantingDate: new Date("2024-07-01"),
      expectedYield: 3000,
      actualYield: null,
      yieldUnit: "kg",
      status: "growing" as const,
      notes: "Second season planting, looking healthy",
    },
    {
      name: "Cowpea",
      variety: "Vigna unguiculata",
      type: "forage_seed" as const,
      fieldLocation: "Field D - East Block",
      areaHectares: 12,
      plantingDate: new Date("2024-06-15"),
      expectedYield: 1800,
      actualYield: null,
      yieldUnit: "kg",
      status: "growing" as const,
      notes: "Nitrogen fixation benefit for soil health",
    },
    {
      name: "Desmodium",
      variety: "Desmodium intortum",
      type: "forage_seed" as const,
      fieldLocation: "Field E - West Block",
      areaHectares: 8,
      plantingDate: new Date("2024-05-01"),
      expectedYield: 960,
      actualYield: null,
      yieldUnit: "kg",
      status: "growing" as const,
      notes: "Companion planting with Napier grass",
    },
  ];

  for (const item of cropItems) {
    await db.insert(crops).values(item);
  }
  console.log("Crops seeded.");

  // Seed Inventory
  const inventoryItems = [
    { name: "Panicum Seeds", category: "seed" as const, sku: "SEED-PAN-001", quantity: 1500, unit: "kg", minStockLevel: 500, reorderPoint: 750, costPerUnit: 85, supplier: "AMENTA Seed Bank", location: "Warehouse A" },
    { name: "Rhodes Grass Seeds", category: "seed" as const, sku: "SEED-RHO-001", quantity: 1200, unit: "kg", minStockLevel: 400, reorderPoint: 600, costPerUnit: 95, supplier: "AMENTA Seed Bank", location: "Warehouse A" },
    { name: "Sudan Grass Seeds", category: "seed" as const, sku: "SEED-SUD-001", quantity: 800, unit: "kg", minStockLevel: 300, reorderPoint: 500, costPerUnit: 70, supplier: "AMENTA Seed Bank", location: "Warehouse A" },
    { name: "Cowpea Seeds", category: "seed" as const, sku: "SEED-COW-001", quantity: 450, unit: "kg", minStockLevel: 200, reorderPoint: 350, costPerUnit: 120, supplier: "AMENTA Seed Bank", location: "Warehouse A" },
    { name: "NPK Fertilizer", category: "fertilizer" as const, sku: "FERT-NPK-001", quantity: 2500, unit: "kg", minStockLevel: 1000, reorderPoint: 1500, costPerUnit: 45, supplier: "Ethiopian Fertilizer Co.", location: "Warehouse B" },
    { name: "Urea Fertilizer", category: "fertilizer" as const, sku: "FERT-URE-001", quantity: 1800, unit: "kg", minStockLevel: 800, reorderPoint: 1200, costPerUnit: 38, supplier: "Ethiopian Fertilizer Co.", location: "Warehouse B" },
    { name: "Diazinon Insecticide", category: "pesticide" as const, sku: "PEST-DIA-001", quantity: 120, unit: "L", minStockLevel: 50, reorderPoint: 80, costPerUnit: 350, supplier: "CropLife Ethiopia", location: "Chemical Store" },
    { name: "Glyphosate Herbicide", category: "pesticide" as const, sku: "PEST-GLY-001", quantity: 85, unit: "L", minStockLevel: 40, reorderPoint: 60, costPerUnit: 280, supplier: "CropLife Ethiopia", location: "Chemical Store" },
    { name: "Dairy Feed Concentrate", category: "feed" as const, sku: "FEED-DC-001", quantity: 3200, unit: "kg", minStockLevel: 1500, reorderPoint: 2000, costPerUnit: 28, supplier: "Feed Solutions Ethiopia", location: "Feed Store" },
    { name: "Mineral Supplement", category: "feed" as const, sku: "FEED-MIN-001", quantity: 450, unit: "kg", minStockLevel: 200, reorderPoint: 300, costPerUnit: 150, supplier: "Feed Solutions Ethiopia", location: "Feed Store" },
    { name: "Irrigation Pipe (PVC)", category: "equipment" as const, sku: "EQP-PVC-001", quantity: 200, unit: "meters", minStockLevel: 100, reorderPoint: 150, costPerUnit: 120, supplier: "Plasco Ethiopia", location: "Equipment Yard" },
    { name: "Diesel Fuel", category: "fuel" as const, sku: "FUE-DIE-001", quantity: 500, unit: "L", minStockLevel: 200, reorderPoint: 300, costPerUnit: 85, supplier: "Total Ethiopia", location: "Fuel Station" },
  ];

  for (const item of inventoryItems) {
    await db.insert(inventory).values(item);
  }
  console.log("Inventory seeded.");

  // Seed Supply Chain
  const supplyItems = [
    {
      productName: "Premium Panicum Seeds",
      productType: "forage_seed" as const,
      batchNumber: "PS-2024-001",
      sourceField: "Field A",
      quantity: 3500,
      unit: "kg",
      harvestDate: new Date("2024-08-15"),
      storageLocation: "Warehouse A",
      status: "in_storage" as const,
      quality: "premium" as const,
      pricePerUnit: 120,
      totalValue: 420000,
    },
    {
      productName: "Rhodes Grass Hay Bales",
      productType: "hay_fodder" as const,
      batchNumber: "RH-2024-001",
      sourceField: "Field B",
      quantity: 5000,
      unit: "kg",
      harvestDate: new Date("2024-09-01"),
      storageLocation: "Hay Barn",
      status: "in_storage" as const,
      quality: "premium" as const,
      pricePerUnit: 25,
      totalValue: 125000,
    },
    {
      productName: "Fattened Bulls - Batch 1",
      productType: "live_animal" as const,
      batchNumber: "LB-2024-001",
      sourceField: "Feedlot A",
      quantity: 45,
      unit: "heads",
      harvestDate: new Date("2024-09-20"),
      storageLocation: "Feedlot A",
      transportDate: new Date("2024-09-25"),
      deliveryDate: new Date("2024-09-26"),
      destination: "Addis Ababa Market",
      status: "delivered" as const,
      quality: "premium" as const,
      buyerName: "Habtamu Livestock Trading",
      buyerContact: "+251 911 234 567",
      pricePerUnit: 85000,
      totalValue: 3825000,
    },
    {
      productName: "Cowpea Seeds",
      productType: "forage_seed" as const,
      batchNumber: "CP-2024-001",
      sourceField: "Field D",
      quantity: 800,
      unit: "kg",
      harvestDate: new Date("2024-10-15"),
      storageLocation: "Warehouse A",
      status: "harvested" as const,
      quality: "standard" as const,
      pricePerUnit: 150,
      totalValue: 120000,
    },
  ];

  for (const item of supplyItems) {
    await db.insert(supplyChain).values(item);
  }
  console.log("Supply chain seeded.");

  // Seed Weather Data
  const weatherConditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain", "Thunderstorm", "Clear"];
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
      condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      uvIndex: Math.random() * 10,
      soilMoisture: 20 + Math.random() * 60,
      forecast: false,
    });
  }

  // Forecast data
  for (let i = 1; i <= 7; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    
    await db.insert(weatherData).values({
      date: date,
      temperature: 24 + Math.random() * 10,
      humidity: 35 + Math.random() * 45,
      rainfall: Math.random() > 0.6 ? Math.random() * 20 : 0,
      windSpeed: 5 + Math.random() * 18,
      windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
      condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      uvIndex: Math.random() * 10,
      soilMoisture: 25 + Math.random() * 55,
      forecast: true,
    });
  }
  console.log("Weather data seeded.");

  // Seed Seasonal Plans
  const seasonalPlanItems = [
    {
      season: "Meher (Main)",
      year: 2024,
      cropName: "Panicum",
      plannedArea: 35,
      expectedYieldPerHectare: 120,
      plantingStartDate: new Date("2024-03-01"),
      plantingEndDate: new Date("2024-03-31"),
      harvestStartDate: new Date("2024-08-01"),
      harvestEndDate: new Date("2024-09-15"),
      waterRequirement: 450,
      fertilizerPlan: "NPK at planting, Urea top-dress at 4 weeks",
      status: "completed" as const,
    },
    {
      season: "Meher (Main)",
      year: 2024,
      cropName: "Rhodes Grass",
      plannedArea: 28,
      expectedYieldPerHectare: 200,
      plantingStartDate: new Date("2024-04-01"),
      plantingEndDate: new Date("2024-04-15"),
      harvestStartDate: new Date("2024-08-15"),
      harvestEndDate: new Date("2024-10-01"),
      waterRequirement: 500,
      fertilizerPlan: "Organic compost + NPK split application",
      status: "completed" as const,
    },
    {
      season: "Belg (Short Rain)",
      year: 2025,
      cropName: "Sudan Grass",
      plannedArea: 25,
      expectedYieldPerHectare: 150,
      plantingStartDate: new Date("2025-03-01"),
      plantingEndDate: new Date("2025-03-20"),
      harvestStartDate: new Date("2025-06-01"),
      harvestEndDate: new Date("2025-07-15"),
      waterRequirement: 350,
      fertilizerPlan: "Basal NPK + foliar feed at flowering",
      status: "approved" as const,
    },
    {
      season: "Meher (Main)",
      year: 2025,
      cropName: "Panicum",
      plannedArea: 40,
      expectedYieldPerHectare: 130,
      plantingStartDate: new Date("2025-03-01"),
      plantingEndDate: new Date("2025-03-31"),
      harvestStartDate: new Date("2025-08-01"),
      harvestEndDate: new Date("2025-09-15"),
      waterRequirement: 480,
      fertilizerPlan: "Enhanced NPK + micronutrient blend",
      status: "draft" as const,
    },
  ];

  for (const item of seasonalPlanItems) {
    await db.insert(seasonalPlans).values(item);
  }
  console.log("Seasonal plans seeded.");

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
