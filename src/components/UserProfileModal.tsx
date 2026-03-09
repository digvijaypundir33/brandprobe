'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlertModal from './AlertModal';

interface UserProfile {
  displayName: string;
  company: string;
  bio: string;
  websiteUrl: string;
  twitterHandle: string;
  linkedinUrl: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  currentProfile: {
    displayName: string | null;
    company: string | null;
    bio: string | null;
    websiteUrl: string | null;
    twitterHandle: string | null;
    linkedinUrl: string | null;
  };
  subscriptionStatus: string;
  reportsUsed: number;
  reportsLimit: number;
  onProfileUpdate?: () => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  email,
  currentProfile,
  subscriptionStatus,
  reportsUsed,
  reportsLimit,
  onProfileUpdate,
}: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>({
    displayName: currentProfile.displayName || '',
    company: currentProfile.company || '',
    bio: currentProfile.bio || '',
    websiteUrl: currentProfile.websiteUrl || '',
    twitterHandle: currentProfile.twitterHandle || '',
    linkedinUrl: currentProfile.linkedinUrl || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'error' | 'success' | 'info' | 'warning';
  }>({ isOpen: false, title: '', message: '', variant: 'info' });

  // Update form when currentProfile changes
  useEffect(() => {
    setProfile({
      displayName: currentProfile.displayName || '',
      company: currentProfile.company || '',
      bio: currentProfile.bio || '',
      websiteUrl: currentProfile.websiteUrl || '',
      twitterHandle: currentProfile.twitterHandle || '',
      linkedinUrl: currentProfile.linkedinUrl || '',
    });
  }, [currentProfile]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!data.success) {
        setAlertModal({
          isOpen: true,
          title: 'Error',
          message: data.error || 'Failed to update profile',
          variant: 'error',
        });
        return;
      }

      setAlertModal({
        isOpen: true,
        title: 'Success',
        message: 'Profile updated successfully!',
        variant: 'success',
      });

      onProfileUpdate?.();
    } catch (error) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to update profile. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPlanBadge = () => {
    switch (subscriptionStatus) {
      case 'active':
        return (
          <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full">
            PRO
          </span>
        );
      case 'starter':
        return (
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
            STARTER
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
            FREE
          </span>
        );
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4 space-y-6">
                  {/* Account Info Section */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Account</p>
                        <p className="font-medium text-gray-900">{email}</p>
                      </div>
                      {getPlanBadge()}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Reports:</span>{' '}
                        <span className="font-semibold text-gray-900">
                          {reportsUsed} / {reportsLimit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Public Profile
                    </h3>
                    <p className="text-sm text-gray-500">
                      This information will be shown on your showcased sites.
                    </p>

                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={profile.displayName}
                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                        placeholder="John Doe"
                        maxLength={50}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Shown instead of your email on showcases
                      </p>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        placeholder="Acme Inc."
                        maxLength={100}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value.slice(0, 200) })}
                        placeholder="Founder & CEO building awesome products..."
                        rows={2}
                        maxLength={200}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        {profile.bio.length}/200 characters
                      </p>
                    </div>

                    {/* Website URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profile.websiteUrl}
                        onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Social Links */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Twitter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Twitter/X
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                          <input
                            type="text"
                            value={profile.twitterHandle}
                            onChange={(e) => setProfile({ ...profile, twitterHandle: e.target.value.replace('@', '') })}
                            placeholder="username"
                            maxLength={15}
                            className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* LinkedIn */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={profile.linkedinUrl}
                          onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                          placeholder="linkedin.com/in/..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => {
          setAlertModal({ ...alertModal, isOpen: false });
          if (alertModal.variant === 'success') {
            onClose();
          }
        }}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
      />
    </>
  );
}
