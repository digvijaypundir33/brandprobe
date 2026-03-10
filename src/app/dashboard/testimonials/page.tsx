'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthenticatedHeader from '@/components/AuthenticatedHeader';

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  company_name: string | null;
  website_url: string | null;
  testimonial_text: string;
  rating: number;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
  is_verified: boolean;
  submitted_by_user_id: string | null;
  created_at: string;
}

export default function TestimonialsManagementPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    authorName: '',
    authorRole: '',
    companyName: '',
    websiteUrl: '',
    testimonialText: '',
    rating: 5,
    isFeatured: false,
    displayOrder: 0,
    isActive: true,
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        if (!data.authenticated) {
          router.push('/access-reports');
          return;
        }
        setIsAuthenticated(data.authenticated);
        setUserEmail(data.email || '');
        setSubscriptionStatus(data.subscriptionStatus || 'free');
      } catch (error) {
        console.error('Failed to check auth:', error);
        router.push('/access-reports');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTestimonials();
    }
  }, [isAuthenticated]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?includeInactive=true&includePending=true');
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, isFeatured: boolean = false) => {
    if (!confirm(`Approve this testimonial${isFeatured ? ' and mark as featured' : ''}?`)) return;

    try {
      const response = await fetch(`/api/testimonials/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isFeatured,
          displayOrder: testimonials.length,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchTestimonials();
        alert('Testimonial approved!');
      } else {
        alert(data.error || 'Failed to approve testimonial');
      }
    } catch (error) {
      console.error('Error approving testimonial:', error);
      alert('Failed to approve testimonial');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject and delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/testimonials/${id}/approve`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchTestimonials();
        alert('Testimonial rejected and deleted');
      } else {
        alert(data.error || 'Failed to reject testimonial');
      }
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
      alert('Failed to reject testimonial');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/testimonials/${editingId}`
        : '/api/testimonials';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchTestimonials();
        resetForm();
        alert(editingId ? 'Testimonial updated!' : 'Testimonial created!');
      } else {
        alert(data.error || 'Failed to save testimonial');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      authorName: testimonial.author_name,
      authorRole: testimonial.author_role,
      companyName: testimonial.company_name || '',
      websiteUrl: testimonial.website_url || '',
      testimonialText: testimonial.testimonial_text,
      rating: testimonial.rating,
      isFeatured: testimonial.is_featured,
      displayOrder: testimonial.display_order,
      isActive: testimonial.is_active,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchTestimonials();
        alert('Testimonial deleted!');
      } else {
        alert(data.error || 'Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      authorName: '',
      authorRole: '',
      companyName: '',
      websiteUrl: '',
      testimonialText: '',
      rating: 5,
      isFeatured: false,
      displayOrder: 0,
      isActive: true,
    });
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AuthenticatedHeader
        email={userEmail}
        subscriptionStatus={subscriptionStatus}
        pageTitle="Manage Testimonials"
        showUpgradeButton={true}
      />

      <main className="container mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Testimonials</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Add, edit, and manage homepage testimonials</p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center touch-target shrink-0"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-5 lg:p-6 w-full min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="DJ"
                />
              </div>

              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Author Role *
                </label>
                <input
                  type="text"
                  required
                  value={formData.authorRole}
                  onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Founder, ChatCrafterAI"
                />
              </div>

              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="ChatCrafterAI"
                />
              </div>

              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="https://chatcrafterai.com"
                />
              </div>

              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Testimonial Text *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.testimonialText}
                  onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  placeholder="BrandProbe helped us identify critical messaging gaps..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="w-full min-w-0">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                <label className="flex items-center gap-2 cursor-pointer touch-target">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer touch-target">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-target"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  {editingId ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-3 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors touch-target"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="space-y-3 sm:space-y-4 w-full min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              All Testimonials ({testimonials.length})
            </h2>

            {testimonials.length === 0 ? (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-gray-600">No testimonials yet. Add your first one!</p>
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">{testimonial.author_name}</h3>
                        {!testimonial.is_verified && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded whitespace-nowrap">
                            Pending Approval
                          </span>
                        )}
                        {testimonial.is_featured && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded whitespace-nowrap">
                            Featured
                          </span>
                        )}
                        {!testimonial.is_active && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded whitespace-nowrap">
                            Inactive
                          </span>
                        )}
                        {testimonial.submitted_by_user_id && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded whitespace-nowrap">
                            User Submitted
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{testimonial.author_role}</p>
                      {testimonial.website_url && (
                        <a
                          href={testimonial.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 break-all"
                        >
                          {testimonial.website_url}
                        </a>
                      )}
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic leading-relaxed">&ldquo;{testimonial.testimonial_text}&rdquo;</p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-200 gap-3">
                    <span className="text-xs text-gray-500">Order: {testimonial.display_order}</span>
                    <div className="flex flex-wrap gap-2">
                      {!testimonial.is_verified ? (
                        <>
                          <button
                            onClick={() => handleApprove(testimonial.id, false)}
                            className="px-3 py-2 text-xs sm:text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-target"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApprove(testimonial.id, true)}
                            className="px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-target whitespace-nowrap"
                          >
                            Approve & Feature
                          </button>
                          <button
                            onClick={() => handleReject(testimonial.id)}
                            className="px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-target"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(testimonial)}
                            className="px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-target"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(testimonial.id)}
                            className="px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-target"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
