import { useEffect } from "react";
import { Link } from "react-router";
import {
  Target, Eye, Sprout, Heart, Lightbulb, Globe, ArrowRight,
  MapPin, Phone, Users, Award, TrendingUp, Leaf,
  Droplets, Sun, Recycle, Shield, Building2, Briefcase, Factory,
  CheckCircle2, ChevronRight, Quote
} from "lucide-react";

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[480px] flex items-center justify-center bg-green-900">
        <img
          src="/images/gallery/amenta1.png"
          alt="About Amenta"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/60 to-green-950/30" />
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <span className="inline-block px-5 py-2 bg-amber-500/90 rounded-full text-xs font-bold mb-5 tracking-widest uppercase text-green-950">
            About Our Company
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-shadow-lg mb-5 leading-tight">
            AMENTA Integrated Improved Forage
            <span className="block text-amber-400 mt-2">Development & Live Animal Trading PLC</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto italic font-light">
            "Cultivating Resilience, Nourishing Communities: The Future of Integrated Agribusiness in East Africa."
          </p>
        </div>
      </section>

      {/* ─── Company Overview ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">Company Overview</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
                A Premier, Progressive Agribusiness Enterprise
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Welcome to <strong className="text-gray-900">AMENTA Integrated Improved Forage Development & Live Animal Trading PLC</strong> (originally
                  founded as AMENTA Agricultural Development PLC). Legally structured under the commercial laws of Ethiopia,
                  we are a premier, progressive agribusiness enterprise spearheading sustainable agricultural modernization
                  in the South Ethiopia Regional State.
                </p>
                <p>
                  Our primary operations are located across a pristine <strong className="text-green-700">256-hectare</strong> land
                  concession in the fertile plains of the Lower Omo Basin, situated in the Loreng-Kachawo Kebele,
                  Nyangatom Woreda, South Omo Zone. Positioned directly adjacent to the Omo River, we harness
                  world-class agro-ecological conditions to run a highly specialized, closed-loop farming model.
                </p>
                <p>
                  Our core business combines modernized improved forage and seed cultivation, scientific silage
                  production, and premium live animal fattening and trading. By growing our own nutrient-dense
                  feed on-site, we protect our operations from market volatility, drastically reduce production
                  costs, and secure an uncompromised competitive edge in supplying top-tier livestock and feed
                  to regional and national markets.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {[
                  { icon: Leaf, label: "256 Ha", desc: "Land Concession" },
                  { icon: Users, label: "45", desc: "Employees" },
                  { icon: Award, label: "66.27M", desc: "Birr Capital" },
                  { icon: TrendingUp, label: "110 Ha", desc: "Under Cultivation" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                    <stat.icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-green-800">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <img
                src="/images/gallery/amenta1.png"
                alt="Amenta Farmland"
                className="rounded-2xl shadow-xl w-full h-[300px] object-cover"
              />
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/images/gallery/habab5.png"
                  alt="Forage Production"
                  className="rounded-xl shadow-md w-full h-40 object-cover"
                />
                <img
                  src="/images/gallery/Solar_Pump1.jpg"
                  alt="Solar Irrigation"
                  className="rounded-xl shadow-md w-full h-40 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mission & Vision ─────────────────────────────────── */}
      <section className="py-20 bg-green-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">Our Purpose</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Mission & Vision</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-10 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-green-100 leading-relaxed">
                  To revolutionize the regional pastoral economy and livestock value chain by producing
                  climate-resilient forage feed and premium-fattened live animals. We are dedicated to
                  empowering local pastoralist communities, bridging the national feed deficit, and
                  delivering exceptional agricultural outputs through scientific precision, shared prosperity,
                  and environmental sustainability.
                </p>
              </div>
            </div>
            {/* Vision */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-green-950 p-10 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-950/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-950/10 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-green-900/80 leading-relaxed">
                  To be recognized as the premier, highly-trusted benchmark for integrated agro-pastoral
                  excellence and sustainable commercial livestock development across the Horn of Africa,
                  seamlessly bridging the gap between community heritage and industrial modernization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Journey & Story (with photos) ─────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">Our Journey</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Our Story</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              A journey of bold vision, continuous adaptation, and transformative growth.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-green-200 -translate-x-1/2 hidden md:block" />

            {/* Chapter 1: The Beginning */}
            <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 mb-16 items-center">
              <div className="md:text-right order-2 md:order-1">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                  Chapter 1 — The Foundation
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Birth of a Bold Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  The story of AMENTA is a journey of bold vision, continuous adaptation, and transformative
                  growth. Founded under the leadership of <strong className="text-gray-900">Tamirat Moja</strong>,
                  the company's roots began with a passionate commitment to unlocking the vast agricultural
                  potential of Ethiopia's lowlands.
                </p>
              </div>
              <div className="order-1 md:order-2 relative">
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(50%+2rem)] md:-translate-x-[calc(100%+2rem)] w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow hidden md:block" />
                <img
                  src="/images/gallery/amenta1.png"
                  alt="AMENTA's founding - vast farmland along the Omo River"
                  className="rounded-2xl shadow-lg w-full h-[280px] object-cover"
                />
              </div>
            </div>

            {/* Chapter 2: Crop Farming Era */}
            <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 mb-16 items-center">
              <div className="order-1">
                <img
                  src="/images/journey/crop-farming.jpg"
                  alt="AMENTA's early crop farming operations"
                  className="rounded-2xl shadow-lg w-full h-[280px] object-cover"
                />
              </div>
              <div className="order-2">
                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                  Chapter 2 — Crop Cultivation Era
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mastering the Land</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  In our early years, AMENTA operated as a large-scale commercial crop cultivation enterprise
                  along the Omo River. Utilizing our fertile soils, we successfully produced and distributed
                  high-quality cash crops to domestic markets.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Watermelon (ሃባብ)", "Onions (ሽንኩርት)", "Tomatoes (ቲማቲም)", "Cassava (ካሳቫ)", "Ginger (ዝንጅብል)", "Maize (በቆሎ)"].map(crop => (
                    <span key={crop} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                      <Sprout className="w-3 h-3" /> {crop}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mt-4 text-sm">
                  This initial phase gave us an extensive understanding of remote logistics, river-fed
                  irrigation, and the unique climate of South Omo.
                </p>
              </div>
            </div>

            {/* Chapter 3: The Strategic Pivot */}
            <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 mb-16 items-center">
              <div className="md:text-right order-2 md:order-1">
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                  Chapter 3 — Strategic Pivot
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Evolving Into Agro-Pastoral Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  We recognized that the livestock sector in Ethiopia — despite boasting Africa's largest
                  herd — faced severe bottlenecks due to seasonal feed shortages and traditional, unscientific
                  herding practices. To build a truly resilient, high-impact enterprise, our leadership
                  undertook a major strategic pivot. We evolved from basic crop farming into a highly
                  structured, circular agro-pastoral enterprise.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src="/images/journey/silage.jpg"
                  alt="Modern silage processing at AMENTA"
                  className="rounded-2xl shadow-lg w-full h-[280px] object-cover"
                />
              </div>
            </div>

            {/* Chapter 4: Today */}
            <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="order-1">
                <img
                  src="/images/journey/feedlot.jpg"
                  alt="AMENTA's modern feedlot operations"
                  className="rounded-2xl shadow-lg w-full h-[280px] object-cover"
                />
              </div>
              <div className="order-2">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                  Today — World Bank Partnership
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">A State-of-the-Art Operation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Today, backed by a total investment capital of <strong className="text-green-700">66.27 Million Birr</strong>,
                  and in close partnership with the Development Bank of Ethiopia (DBE) under the World Bank-funded
                  <strong className="text-blue-700"> DRIVE Project</strong>, we are implementing a state-of-the-art
                  animal feed processing plant and professional feedlot system. We have transformed the hard-won
                  lessons of our past crop-farming days into a sophisticated, scientifically managed operation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── What We Believe & Core Values ─────────────────────── */}
      <section className="py-20 bg-green-950 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="text-amber-400 font-semibold text-sm tracking-wider uppercase">What We Believe</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2">Our Core Values</h2>
          </div>

          {/* Belief statement */}
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="relative">
              <Quote className="w-10 h-10 text-amber-500/30 mx-auto mb-4" />
              <p className="text-green-200/80 leading-relaxed text-lg italic">
                We believe that modern agribusiness must be a force for good. True agricultural progress
                should not only yield high financial returns but must also preserve the environment and uplift
                the pastoralist communities who have guarded these lands for generations. We believe that
                integrating scientific innovation with local trust is the ultimate key to sustainable
                economic development.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Recycle,
                title: "Operational Synergy",
                desc: "We champion a closed-loop, zero-waste circular agricultural model where our crop and forage cultivation directly feeds our livestock feedlots.",
              },
              {
                icon: Award,
                title: "Scientific Precision",
                desc: "From testing soil health to formulating balanced, high-protein silage rations, we rely on scientific data to optimize daily yield and animal weight gain.",
              },
              {
                icon: Heart,
                title: "Pastoral Integration",
                desc: "We do not work in isolation. We actively partner with local herder communities, creating a reliable value chain that brings mutual economic security.",
              },
              {
                icon: Lightbulb,
                title: "Climate Resilience",
                desc: "By promoting drought-resistant forage seeds and advanced irrigation techniques, we actively combat the severe seasonal shocks of climate change.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-green-900/50 border border-green-800 p-6 rounded-2xl hover:bg-green-900/70 transition-all group"
              >
                <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                  <value.icon className="w-7 h-7 text-amber-400" />
                </div>
                <h4 className="font-bold text-lg mb-3">{value.title}</h4>
                <p className="text-green-200/70 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Operations: What We Do ────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">Our Operations</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">What We Do</h2>
          </div>
          <p className="text-gray-500 max-w-3xl mx-auto text-center mb-12">
            At AMENTA, our 256-hectare estate is a hub of modern, high-efficiency agricultural production.
            In our current development phase, we are actively cultivating 110 hectares with advanced river-fed
            irrigation, structured into three highly integrated operational divisions.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Forage Seed */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
              <div className="h-48 overflow-hidden">
                <img
                  src="/images/gallery/habab5.png"
                  alt="Forage Seed Production"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Sprout className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Improved Forage Seed Production</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  We cultivate and propagate high-yielding, drought-tolerant improved forage crop varieties,
                  specifically selected for the lowland ecosystem. This specialized division provides the
                  biological foundation needed to restore degraded rangelands, offering local farmers and
                  pastoralist cooperatives superior seeds that guarantee robust pasture growth even in dry seasons.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Drought-tolerant varieties
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Lowland ecosystem optimized
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Degraded rangeland restoration
                  </li>
                </ul>
              </div>
            </div>

            {/* Silage Processing */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
              <div className="h-48 overflow-hidden">
                <img
                  src="/images/gallery/irrigation.jpg"
                  alt="Livestock Feed Processing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Factory className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Livestock Feed (Silage) Processing</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Harnessing irrigation from the adjacent Omo River, we cultivate high-protein crops, including
                  maize (corn) and elephant grass. Using specialized machinery, these crops are processed on-site
                  and fermented with high-quality ingredients (including molasses and urea) into premium silage —
                  ensuring an uninterrupted, year-round feed supply.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> On-site processing & fermentation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Year-round feed supply
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Nutrient-dense, long-storage silage
                  </li>
                </ul>
              </div>
            </div>

            {/* Live Animal */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
              <div className="h-48 overflow-hidden">
                <img
                  src="/images/gallery/hero-farmland2.jpg"
                  alt="Live Animal Fattening"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <Sun className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Elite Live Animal Fattening & Trading</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Our state-of-the-art feedlots source choice bulls from the local pastoralist communities.
                  These animals undergo a highly controlled, scientific 90-to-120-day nutritional and veterinary
                  program. Fed with our own premium, protein-balanced silage, the animals rapidly and healthily
                  achieve optimal weight and superior meat quality.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> 90–120 day scientific program
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Premium protein-balanced silage feed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Superior meat quality output
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Impact & Collaboration ────────────────────────────── */}
      <section className="py-20 bg-green-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">Our Impact</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Impact & Community Collaboration
              </h2>

              {/* Empowering the Lowlands */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-600" /> Empowering the Lowlands
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  At AMENTA, commercial success goes hand-in-hand with measurable community progress.
                  We are a key economic engine in the South Omo Zone, directly generating stable employment
                  for <strong className="text-green-700">45 local staff members</strong> (22 permanent and
                  23 temporary employees), with a special focus on hiring local youth and women.
                </p>
              </div>

              {/* Strategic Collaboration */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" /> Strategic Collaboration with Pastoralists
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Through our signature "Outgrower & Technology Transfer" programs, we host hands-on training
                  sessions for local pastoralists, teaching them modern livestock finishing, animal health
                  management, and climate-smart forage cultivation. We purchase our feeder bulls directly from
                  local herders at fair, competitive market rates, providing them with a secure, stable cash
                  income and linking them directly to the formal commercial economy.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { value: "45", label: "Local Employees" },
                  { value: "22", label: "Permanent Staff" },
                  { value: "23", label: "Temporary Team" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold text-green-700">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/journey/community.jpg"
                alt="Community Impact — Pastoralist training"
                className="rounded-2xl shadow-xl w-full h-[420px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-amber-500 text-green-950 p-6 rounded-2xl shadow-lg hidden lg:block max-w-[200px]">
                <Shield className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">1,200+</div>
                <div className="text-sm font-medium">Families Empowered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Partners ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">Collaboration</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Our Partners</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              We believe that massive challenges are solved through world-class collaboration. AMENTA's
              operational and financial structure is supported by an elite network of institutional,
              regional, and national partners.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "DRIVE Project (World Bank)",
                desc: "A flagship initiative dedicated to building economic resilience, financial inclusion, and value enhancement in pastoral economies.",
                icon: Droplets,
              },
              {
                name: "Development Bank of Ethiopia (DBE)",
                desc: "Providing essential financial backing, strict compliance monitoring, and development capital to drive agricultural industrialization.",
                icon: Building2,
              },
              {
                name: "Southern Ethiopia Region (SER) Investment Bureau",
                desc: "Regional government body facilitating investment and regulatory support for agricultural enterprises.",
                icon: Globe,
              },
              {
                name: "South Omo Zone Investment Department",
                desc: "Local zonal authority promoting economic development and investment in the South Omo Zone.",
                icon: MapPin,
              },
            ].map((partner) => (
              <div
                key={partner.name}
                className="bg-green-50 p-6 rounded-2xl text-center hover:shadow-lg transition-all group border border-green-100"
              >
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                  <partner.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{partner.name}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{partner.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Location & Contact ───────────────────────────────── */}
      <section className="py-20 bg-green-950 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <span className="text-amber-400 font-semibold text-sm tracking-wider uppercase">Find Us</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-6">Location & Contact Details</h2>
              <p className="text-green-200/80 leading-relaxed mb-8">
                Our strategic location gives us direct access to year-round water and expansive, highly
                fertile agricultural soils.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-green-900/50 rounded-xl">
                  <MapPin className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Farm & Project Site</h4>
                    <p className="text-green-200/70 text-sm">
                      Loreng-Kachawo Kebele, Nyangatom Wereda, South Omo Zone, South Ethiopia Regional State
                      (adjacent to the Omo River, approximately 10 km from Kangate town).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-900/50 rounded-xl">
                  <Building2 className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Corporate Headquarters</h4>
                    <p className="text-green-200/70 text-sm">
                      South Ethiopia Region, Ari Zone, Jinka Town, Arkisha Kebele.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-900/50 rounded-xl">
                  <Shield className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Total Managed Land Area</h4>
                    <p className="text-green-200/70 text-sm">256 Hectares</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-900/50 rounded-xl">
                  <Phone className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Primary Corporate Contact</h4>
                    <p className="text-green-200/70 text-sm">+251 964 891 100 | +251 916 855 542</p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-green-950 rounded-full font-medium transition-all mt-8 hover:gap-3"
              >
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden h-full min-h-[400px] bg-gray-200">
              <iframe
                src="https://www.google.com/maps?q=5.27588699,36.18752591&z=15&t=k&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
