import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Leaf } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-green-900">
        <img
          src="/images/gallery/irrigation.jpg"
          alt="Contact"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-shadow-lg mb-3">Contact Us</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            We'd love to hear from you. Reach out for inquiries, partnerships, or feedback.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <span className="text-green-600 font-medium text-sm tracking-wider uppercase">Get In Touch</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">
                Let's Start a Conversation
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Whether you're interested in our forage seeds, livestock programs, partnership 
                opportunities, or simply want to learn more about our work in South Omo, 
                our team is ready to assist you.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Visit Us</h4>
                    <p className="text-gray-500 text-sm">
                      Loreng-Kachawo Kebele, Nyangatom Woreda<br />
                      South Omo Zone, Ethiopia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Call Us</h4>
                    <p className="text-gray-500 text-sm">+251 91 685 5542</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Us</h4>
                    <p className="text-gray-500 text-sm">amentaagriculturaldevelopmentp@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Working Hours</h4>
                    <p className="text-gray-500 text-sm">Monday - Saturday: 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden h-64 bg-gray-200 shadow-md">
                <iframe
                  src="https://www.google.com/maps?q=5.27588699,36.18752591&z=15&t=k&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Send a Message</h3>
                      <p className="text-sm text-gray-500">Fill out the form below</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none bg-gray-50/50"
                        placeholder="Tell us about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-600/20 hover:shadow-green-600/30"
                    >
                      {contactMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
