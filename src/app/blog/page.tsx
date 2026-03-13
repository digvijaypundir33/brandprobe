import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - Marketing Insights & AI Search Optimization | BrandProbe',
  description: 'Learn about AI search optimization (AEO), website audits, SEO, conversion optimization, and startup marketing strategies from the BrandProbe team.',
  openGraph: {
    title: 'Blog - Marketing Insights & AI Search Optimization | BrandProbe',
    description: 'Learn about AI search optimization, website audits, SEO, and startup marketing strategies.',
    type: 'website',
    url: 'https://brandprobe.io/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Marketing Insights & Guides
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Learn how to optimize your website for AI search engines, improve conversions,
              and grow your startup with actionable marketing strategies.
            </p>
          </div>

          {/* Categories Filter (Future) */}
          {/* <div className="flex gap-3 mb-8 overflow-x-auto">
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">All</button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">AI Search</button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">SEO</button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">Startup Marketing</button>
          </div> */}

          {/* Blog Posts */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base sm:text-lg text-gray-600">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span className="text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-1 rounded bg-blue-100 text-blue-700">
                          {post.category}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">•</span>
                        <span className="text-xs sm:text-sm text-gray-500">{post.readingTime}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 hover:text-blue-600 transition-colors leading-tight">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-2.5 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm sm:text-base font-medium text-blue-600 hover:text-blue-700"
                      >
                        Read more
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Newsletter CTA */}
          <div
            className="mt-8 sm:mt-12 rounded-xl p-6 sm:p-8 text-center text-white"
            style={{ background: 'var(--brand-primary)' }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Get marketing insights in your inbox
            </h3>
            <p className="text-sm sm:text-base text-white/90 mb-5 sm:mb-6">
              Weekly tips on AI search optimization, SEO, and startup growth.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 border-2 border-white/30 focus:outline-none focus:border-white transition-colors text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm sm:text-base whitespace-nowrap"
                style={{ color: 'var(--brand-primary)' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
