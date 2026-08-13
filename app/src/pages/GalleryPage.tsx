import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { X, ChevronLeft, ChevronRight, Grid3X3, ImageOff } from "lucide-react";

export default function GalleryPage() {
  const { data: images, isLoading } = trpc.gallery.list.useQuery();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);

  const goNext = () => {
    if (lightbox !== null && images) {
      setLightbox((lightbox + 1) % images.length);
    }
  };

  const goPrev = () => {
    if (lightbox !== null && images) {
      setLightbox((lightbox - 1 + images.length) % images.length);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0} className="outline-none">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-green-900">
        <img
          src="/images/gallery/farming.jpg"
          alt="Gallery"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-shadow-lg mb-3">Our Gallery</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            A visual journey through Amenta's agricultural operations and community impact
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full" />
            </div>
          ) : images && images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative group cursor-pointer overflow-hidden rounded-xl ${
                    i === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={img.image}
                    alt={img.title || "Amenta"}
                    className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                      i === 0 ? "h-full min-h-[300px]" : "h-56"
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <Grid3X3 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {img.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">{img.title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ImageOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No images available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && images && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-5xl max-h-[85vh] px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightbox].image}
              alt={images[lightbox].title || "Gallery"}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {images[lightbox].title && (
              <p className="text-white text-center mt-4 text-lg font-medium">
                {images[lightbox].title}
              </p>
            )}
            <p className="text-white/50 text-center text-sm mt-1">
              {lightbox + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
