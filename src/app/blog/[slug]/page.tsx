import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { MDXComponents } from '@/components/MDXComponents';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | BrandProbe Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: post.ogImage
        ? [
            {
              url: post.ogImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Schema markup for blog post
  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://brandprobe.io',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BrandProbe',
      logo: {
        '@type': 'ImageObject',
        url: 'https://brandprobe.io/favicon.ico',
      },
    },
    image: post.ogImage || 'https://brandprobe.io/og-image.png',
    keywords: post.tags.join(', '),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />

      <Header />

      <main className="px-4 py-12 sm:py-16">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-blue-600">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 inline-block max-w-[200px] sm:max-w-none truncate align-bottom">{post.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {post.category}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">•</span>
              <span className="text-xs sm:text-sm text-gray-500">{post.readingTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
              {post.description}
            </p>

            <div className="flex items-center gap-2 mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-gray-600">By {post.author}</span>
            </div>
          </header>

          {/* Featured Image */}
          {post.ogImage && (
            <div className="mb-8 rounded-xl overflow-hidden border border-gray-200">
              <img
                src={post.ogImage}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <MDXRemote
              source={post.content}
              components={MDXComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeHighlight],
                },
              }}
            />
          </div>

          {/* Tags */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Share this article:</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://brandprobe.io/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-center"
              >
                Share on X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://brandprobe.io/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center"
              >
                Share on LinkedIn
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 sm:p-8 text-center text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Ready to optimize your website?
            </h3>
            <p className="text-sm sm:text-base text-blue-100 mb-5 sm:mb-6">
              Get a free AI-powered analysis of your website in 60 seconds.
            </p>
            <Link
              href="/"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Analyze Your Website →
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
