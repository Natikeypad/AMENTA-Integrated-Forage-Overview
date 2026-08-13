import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Calendar, ArrowUpRight, Tag, Newspaper, Clock } from "lucide-react";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { data: newsData, isLoading } = trpc.news.list.useQuery({
    category: selectedCategory,
    limit: 12,
  });
  const { data: featuredNews } = trpc.news.featured.useQuery();

  const news = newsData?.items || [];
  const categories = [...new Set(news.filter(n => n.category).map((n) => n.category))];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-green-900">
        <img
          src="/images/news/forage-harvest.jpg"
          alt="News"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-shadow-lg mb-3">Latest News</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Stay informed with the latest updates and stories from Amenta PLC
          </p>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews && featuredNews.length > 0 && (
        <section className="py-12 bg-green-50/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-green-600" />
              Featured Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredNews.slice(0, 2).map((post) => (
                <Link
                  key={post.id}
                  to={`/news/${post.slug}`}
                  className="group relative h-64 md:h-80 rounded-2xl overflow-hidden"
                >
                  <img
                    src={post.image || "/images/news/forage-harvest.jpg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {post.tag && (
                      <span className="inline-block px-3 py-1 bg-amber-500 text-green-950 text-xs font-medium rounded-full mb-3">
                        {post.tag}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? "bg-green-600 text-white"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              All News
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat || undefined)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image || "/images/news/forage-harvest.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.tag && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {post.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                      {post.category && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.category}
                        </span>
                      )}
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
          )}
        </div>
      </section>
    </div>
  );
}
