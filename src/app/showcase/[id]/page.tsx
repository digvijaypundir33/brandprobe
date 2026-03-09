'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { ShowcaseDetail, ShowcaseComment } from '@/types/report';

export default function ShowcaseDetailPage() {
  const params = useParams();
  const reportId = params.id as string;

  const [detail, setDetail] = useState<ShowcaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // Upvote state
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [isUpvoting, setIsUpvoting] = useState(false);

  // Comment state
  const [comments, setComments] = useState<ShowcaseComment[]>([]);
  const [commentSort, setCommentSort] = useState<'newest' | 'oldest'>('newest');
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (data.email) {
          setUserEmail(data.email);
          setCommentEmail(data.email);
          setCommentName(data.email.split('@')[0]);
        }
      } catch (error) {
        console.error('Failed to check auth:', error);
      }
    };
    checkAuth();
  }, []);

  // Fetch showcase detail
  const fetchDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/showcase/${reportId}/detail`);
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to load showcase');
        return;
      }

      setDetail(data.detail);
      setHasUpvoted(data.detail.hasUpvoted || false);
      setUpvoteCount(data.detail.showcaseUpvotes || 0);
      setComments(data.detail.comments || []);
    } catch (err) {
      setError('Failed to load showcase');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Handle upvote toggle
  const handleUpvote = async () => {
    if (isUpvoting) return;

    // Require email for upvoting
    if (!userEmail && !commentEmail) {
      setCommentError('Please enter your email to upvote');
      return;
    }

    setIsUpvoting(true);

    try {
      const res = await fetch(`/api/showcase/${reportId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail || commentEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setHasUpvoted(data.upvoted);
        setUpvoteCount((prev) => (data.upvoted ? prev + 1 : prev - 1));
      }
    } catch (err) {
      console.error('Failed to toggle upvote:', err);
    } finally {
      setIsUpvoting(false);
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim() || !commentEmail.trim()) {
      setCommentError('Please fill in all fields');
      return;
    }

    setIsSubmittingComment(true);
    setCommentError(null);

    try {
      const res = await fetch(`/api/showcase/${reportId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: commentName,
          authorEmail: commentEmail,
          content: newComment,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setCommentError(data.error || 'Failed to post comment');
        return;
      }

      // Add new comment to list
      setComments((prev) =>
        commentSort === 'newest' ? [data.comment, ...prev] : [...prev, data.comment]
      );
      setNewComment('');
    } catch (err) {
      setCommentError('Failed to post comment');
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Score color helpers
  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score: number | null) => {
    if (!score) return 'bg-gray-300';
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Format date (consistent format to avoid hydration mismatch)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-600">Loading showcase...</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Showcase Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This showcase entry does not exist.'}</p>
          <Link
            href="/showcase"
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--brand-primary)' }}
          >
            Browse all showcases
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--brand-primary)'}}>
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">BrandProbe</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/access-reports"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                View My Reports
              </Link>
            )}
            <Link
              href="/plans"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Pricing
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              {/* Top Row: Icon, Name, Visit Button */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  {detail.iconUrl ? (
                    <img
                      src={detail.iconUrl}
                      alt={detail.displayName}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      {detail.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{detail.displayName}</h1>
                    <p className="text-gray-600">{detail.tagline}</p>
                    {detail.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mt-2">
                        {detail.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Visit Button */}
                <a
                  href={detail.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Visit
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              {/* Maker Info */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    {detail.ownerName?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{detail.ownerName || 'Anonymous'}</span>
                    {detail.ownerCompany && (
                      <p className="text-xs text-gray-500">{detail.ownerCompany}</p>
                    )}
                  </div>
                </div>
                {/* Social Links */}
                <div className="flex items-center gap-2">
                  {detail.ownerWebsiteUrl && (
                    <a
                      href={detail.ownerWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Website"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>
                  )}
                  {detail.ownerTwitterHandle && (
                    <a
                      href={`https://x.com/${detail.ownerTwitterHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title={`@${detail.ownerTwitterHandle}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {detail.ownerLinkedinUrl && (
                    <a
                      href={detail.ownerLinkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="LinkedIn"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Website Screenshot */}
            {detail.screenshotUrl && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <img
                  src={detail.screenshotUrl}
                  alt={`${detail.displayName} screenshot`}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement?.classList.add('hidden');
                  }}
                />
              </div>
            )}

            {/* Description */}
            {detail.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{detail.description}</p>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              {/* Comment Input */}
              <form onSubmit={handleSubmitComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your feedback!"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  maxLength={1000}
                />

                {/* Name and Email fields for non-authenticated users */}
                {!isAuthenticated && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                      type="text"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="Your name"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <input
                      type="email"
                      value={commentEmail}
                      onChange={(e) => setCommentEmail(e.target.value)}
                      placeholder="Your email"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                )}

                {commentError && (
                  <p className="text-sm text-red-600 mt-2">{commentError}</p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">{newComment.length}/1000</span>
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newComment.trim()}
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>

              {/* Comments Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Comments ({comments.length})
                  </span>
                </div>

                <select
                  value={commentSort}
                  onChange={(e) => setCommentSort(e.target.value as 'newest' | 'oldest')}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>

              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                <div className="space-y-4">
                  {comments
                    .sort((a, b) =>
                      commentSort === 'newest'
                        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    )
                    .map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                          style={{ backgroundColor: 'var(--brand-primary)' }}
                        >
                          {comment.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.authorName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* BrandProbe Score */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">BrandProbe Score</h3>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`flex items-center justify-center w-20 h-20 rounded-full bg-gray-50`}
                >
                  <span className={`text-3xl font-bold ${getScoreColor(detail.overallScore)}`}>
                    {detail.overallScore ?? '--'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(
                        detail.overallScore
                      )}`}
                      style={{ width: `${detail.overallScore ?? 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">out of 100</p>
                </div>
              </div>

              {/* Score interpretation */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {detail.overallScore && detail.overallScore >= 70 ? (
                    <>
                      <span className="font-semibold text-green-700">Excellent</span> - This
                      site has strong brand messaging, SEO foundation, and conversion elements.
                    </>
                  ) : detail.overallScore && detail.overallScore >= 50 ? (
                    <>
                      <span className="font-semibold text-yellow-700">Good</span> - Solid foundation
                      with room for optimization in messaging and conversion.
                    </>
                  ) : detail.overallScore && detail.overallScore >= 30 ? (
                    <>
                      <span className="font-semibold text-orange-700">Fair</span> - Key elements
                      present but significant improvements needed.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-red-700">Needs Work</span> - Many
                      opportunities to improve messaging and user experience.
                    </>
                  )}
                </p>
              </div>

              {/* Key stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">
                    {detail.category || 'Uncategorized'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Added</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(detail.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              {/* Upvotes and Views */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{upvoteCount}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Upvotes</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{detail.showcaseViews}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Views</p>
                </div>
              </div>

              {/* Upvote Button */}
              <button
                onClick={handleUpvote}
                disabled={isUpvoting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  hasUpvoted
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg
                  className={`w-5 h-5 ${hasUpvoted ? 'text-green-600' : ''}`}
                  fill={hasUpvoted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                {hasUpvoted ? 'Upvoted' : `${upvoteCount} Upvotes`}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
