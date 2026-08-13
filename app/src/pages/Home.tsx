import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  ArrowRight, ChevronLeft, ChevronRight, Leaf, Sprout, Users, Globe,
  Target, Eye, Lightbulb, Heart, Award, Mail, Phone, MapPin, Calendar,
  ArrowUpRight, Send
} from "lucide-react";
import { toast } from "sonner";

// ─── Hero Section ────────────────────────────────────────────────
const heroSlides = [
  { image: "/images/hero-farmland.jpg", title: "Sustainable Agriculture", subtitle: "Transforming Ethiopia's Farmlands" },
  { image: "/images/gallery/hero-farmland2.jpg", title: "Community Empowerment", subtitle: "Building Stronger Rural Communities" },
  { image: "/images/gallery/habab9.png", title: "Habab Forage Program", subtitle: "Premium Forage Seed Production" },
  { image: "/images/gallery/tomato6.png", title: "Hands-On Farming", subtitle: "Growing Ethiopia's Agricultural Future" },
  { image: "/images/gallery/habab5.png", title: "Hands-On Farming", subtitle: "Growing Ethiopia's Agricultural Future" },
  { image: "/images/gallery/solar-news.jpg", title: "Hands-On Farming", subtitle: "Growing Ethiopia's Agricultural Future" },
  { image: "/images/gallery/Solar_Pump1.jpg", title: "Solar Irrigation", subtitle: "Sustainable Water for Our Crops" },
 
];

function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % heroSlides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-4xl mx-auto animate-slide-up">
          <span className="inline-block px-4 py-1.5 bg-green-600/90 rounded-full text-xs font-medium mb-4 tracking-wider uppercase">
            Pioneering Sustainable Agriculture Since 2015 E.C
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-shadow-lg">
            Amenta Agricultural
            <br />
            <span className="text-amber-400">Development PLC</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto text-shadow">
            Transforming Ethiopia's Agricultural Landscape Through Innovation and Community Empowerment
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/gallery"
              className="px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all flex items-center gap-2 hover:gap-3"
            >
              Discover Our Impact <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full font-medium transition-all flex items-center gap-2 border border-white/30"
            >
              Get in Touch <Mail className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: "260+", label: "Hectares" },
              { value: "178K", label: "Kg Forage/Year" },
              { value: "500+", label: "Jobs Created" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-amber-400">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all">
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all">
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-amber-400 w-8" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── About Section ──────────────────────────────────────────────
function AboutSection() {
  const features = [
    { icon: Sprout, label: "178,000 kg/year forage" },
    { icon: Award, label: "150+ bulls/year" },
    { icon: Users, label: "Empowering 1,200+ families" },
  ];

  const timeline = [
    { year: "2023", title: "Foundation", desc: "260 hectares of irrigable land along the Omo River", icon: Sprout },
    { year: "2024", title: "Expansion", desc: "Forage seed production, fattening and trading high-quality live animals", icon: Leaf },
    { year: "2025", title: "Partnership", desc: "Strategic collaboration with the DRIVE Project", icon: Target },
    { year: "2026", title: "Growth", desc: "Full production capacity with 45 dedicated employees", icon: Users },
    { year: "2027", title: "Leadership", desc: "Leading forage seed supplier in Southern Ethiopia", icon: Award },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* About Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <img
              src="/images/gallery/amenta1.png"
              alt="Amenta Farmland"
              className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg hidden lg:flex">
              <div className="text-center text-white">
                <div className="text-4xl font-bold">5+</div>
                <div className="text-sm opacity-90">Years of Expertise</div>
              </div>
            </div>
          </div>
          <div>
            <span className="text-green-600 font-medium text-sm tracking-wider uppercase">About Us</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
              About Amenta PLC
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Amenta Agricultural Development, formally known as the Amenta Integrated Forage Development 
              and Live Animal Trading Project, is a large-scale agribusiness venture established in 
              Nyangatom Woreda, South Omo Zone, Ethiopia. Led by Tamirat Moja, we operate on 260 hectares 
              of irrigable land along the Omo River, producing high-quality forage seeds and fattening 
              premium live animals for domestic and export markets.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {features.map((f) => (
                <div key={f.label} className="text-center p-3 bg-green-50 rounded-xl">
                  <f.icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <span className="text-xs font-medium text-gray-700">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="bg-green-50 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To revolutionize Ethiopian agriculture through sustainable forage development, modern 
              livestock practices, and community empowerment, creating economic opportunities while 
              preserving our natural resources.
            </p>
          </div>
          <div className="bg-amber-50 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become East Africa's leading integrated agricultural enterprise, setting standards 
              for sustainable farming while transforming pastoral communities into thriving economic hubs.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Our Core Values</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Sprout, title: "Sustainability", desc: "Preserving natural resources for future generations." },
              { icon: Heart, title: "Community", desc: "Empowering local communities through education and employment." },
              { icon: Lightbulb, title: "Innovation", desc: "Seeking new ways to improve agricultural practices." },
              { icon: Globe, title: "Impact", desc: "Measuring success by positive community impact." },
            ].map((v) => (
              <div key={v.title} className="text-center p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{v.title}</h4>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">Our Journey</h3>
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-green-200 -translate-y-1/2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {timeline.map((t, i) => (
                <div key={t.year} className="relative text-center" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 relative z-10 ring-4 ring-white">
                    <t.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-amber-500 font-bold text-lg">{t.year}</div>
                  <h4 className="font-semibold text-gray-900 text-sm">{t.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Team Section ───────────────────────────────────────────────
function TeamSection() {
  const { data: team } = trpc.team.list.useQuery();

  return (
    <section id="team" className="py-20 bg-green-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-green-600 font-medium text-sm tracking-wider uppercase">Our Team</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
            Our Leadership Team
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Experienced professionals driving Amenta's agricultural innovation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team?.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={member.image || "/images/team/tamrat.jpg"}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-green-600 text-sm font-medium">{member.role}</p>
                <p className="text-gray-500 text-sm mt-3 line-clamp-3">{member.bio}</p>
                {member.email && (
                  <a href={`mailto:${member.email}`} className="text-sm text-green-600 hover:underline mt-3 inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {member.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Portfolio Section ──────────────────────────────────────────
function PortfolioSection() {
  const { data: projects } = trpc.portfolio.list.useQuery();

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-green-600 font-medium text-sm tracking-wider uppercase">Projects</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
            Our Major Projects
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Transforming South Omo through agricultural innovation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects?.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-gray-100">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={project.image || "/images/projects/forage.jpg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{project.description}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: project.stat1Value, label: project.stat1Label },
                    { value: project.stat2Value, label: project.stat2Label },
                    { value: project.stat3Value, label: project.stat3Label },
                  ].map((s, i) => (
                    <div key={i} className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-700">{s.value}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Preview Section ────────────────────────────────────
function GalleryPreview() {
  const { data: images } = trpc.gallery.list.useQuery({});
  const displayImages = images?.slice(0, 6) ?? [];

  return (
    <section id="gallery" className="py-20 bg-green-950 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <span className="text-amber-400 font-medium text-sm tracking-wider uppercase">Gallery</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2">Project Gallery</h2>
            <p className="text-green-200/70 mt-2">Visual journey through our agricultural operations</p>
          </div>
          <Link
            to="/gallery"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-green-950 rounded-full font-medium transition-all flex items-center gap-2"
          >
            View All Photos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayImages.map((img, i) => (
            <div
              key={img.id}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={img.image}
                alt={img.title || "Gallery"}
                className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                  i === 0 ? "h-full min-h-[300px]" : "h-48"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-medium text-sm">{img.title || "Amenta Farm"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── News Preview Section ───────────────────────────────────────
function NewsPreview() {
  const { data: newsData } = trpc.news.list.useQuery({ limit: 3 });
  const news = newsData?.items || [];

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <span className="text-green-600 font-medium text-sm tracking-wider uppercase">News</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
              Latest News & Insights
            </h2>
            <p className="text-gray-500 mt-2">Updates from our agricultural initiatives in South Omo</p>
          </div>
          <Link
            to="/news"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all flex items-center gap-2"
          >
            All News <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image || "/images/news/forage-harvest.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {post.tag && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                    {post.tag}
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                <Link
                  to={`/news/${post.slug}`}
                  className="inline-flex items-center gap-1 text-green-600 text-sm font-medium hover:gap-2 transition-all"
                >
                  Read More <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ────────────────────────────────────────────
function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <section id="contact" className="py-20 bg-green-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-green-600 font-medium text-sm tracking-wider uppercase">Contact</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Contact Us</h2>
          <p className="text-gray-500 mt-3">Get in touch with our team in South Omo</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Headquarters</h4>
                <p className="text-gray-500 text-sm">Loreng-Kachawo Kebele, Nyangatom Woreda, South Omo Zone, Ethiopia</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Phone</h4>
                <p className="text-gray-500 text-sm">+251 91 685 5542</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Email</h4>
                <p className="text-gray-500 text-sm">amentaagriculturaldevelopmentp@gmail.com</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden h-64 bg-gray-200">
              <iframe
                src="https://www.google.com/maps?q=5.27588699,36.18752591&z=15&t=k&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {contactMutation.isPending ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Home Page ──────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <TeamSection />
      <PortfolioSection />
      <GalleryPreview />
      <NewsPreview />
      <ContactSection />
    </>
  );
}
