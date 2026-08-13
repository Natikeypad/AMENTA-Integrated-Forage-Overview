import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Calendar, ArrowLeft, Tag, User } from "lucide-react";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = trpc.news.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-6">The article you're looking for doesn't exist.</p>
        <Link to="/news" className="text-green-600 hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Image */}
      <section className="relative h-[50vh] min-h-[400px]">
        <img
          src={post.image || "/images/news/forage-harvest.jpg"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/news"
              className="inline-flex items-center gap-1 text-white/70 text-sm hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
            {post.tag && (
              <span className="inline-block px-3 py-1 bg-amber-500 text-green-950 text-xs font-medium rounded-full mb-4">
                {post.tag}
              </span>
            )}
            <h1 className="text-3xl lg:text-5xl font-bold text-white text-shadow-lg">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b">
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {post.author}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""}
            </span>
            {post.category && (
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" /> {post.category}
              </span>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          {post.content && (
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-green-600">
              <p>{post.content}</p>
            </div>
          )}

          {/* Back */}
          <div className="mt-12 pt-8 border-t">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All News
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
