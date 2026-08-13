import { Link } from "react-router";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Send, Leaf, ArrowUp } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const newsletterMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setEmail("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    newsletterMutation.mutate({ email });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-green-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="Amenta" className="h-14 w-auto" />
              <div>
                <h3 className="font-bold text-lg">AMENTA</h3>
                <p className="text-[10px] text-green-300 tracking-wide">AGRICULTURAL DEVELOPMENT PLC</p>
              </div>
            </div>
            <p className="text-green-100/80 text-sm leading-relaxed mb-4">
              Transforming Ethiopian agriculture through sustainable forage development,
              livestock trading, and community empowerment since 2023.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-green-800/50 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-green-800/50 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-green-800/50 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-green-800/50 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/gallery", label: "Gallery" },
                { to: "/news", label: "News & Updates" },
                { to: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-green-100/80 text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Contact Info
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-green-100/80">
                <MapPin className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                <span>Loreng-Kachawo Kebele, Nyangatom Woreda, South Omo, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-green-100/80">
                <Phone className="w-4 h-4 text-green-500 shrink-0" />
                <span>+251 91 685 5542</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-green-100/80">
                <Mail className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                <span>amentaagriculturaldevelopmentp@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Newsletter
            </h4>
            <p className="text-green-100/80 text-sm mb-4">
              Subscribe for the latest updates on our agricultural projects.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-2.5 bg-green-900/50 border border-green-700 rounded-lg text-sm text-white placeholder:text-green-400/60 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="submit"
                disabled={newsletterMutation.isPending}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-green-950 rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-green-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-green-300/60 text-sm">
            &copy; {new Date().getFullYear()} Amenta Agricultural Development PLC. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-green-300/60">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
          </div>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-green-800 hover:bg-amber-500 flex items-center justify-center transition-colors group"
          >
            <ArrowUp className="w-5 h-5 group-hover:text-green-950 transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
}
