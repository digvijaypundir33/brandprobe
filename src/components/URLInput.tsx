'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function URLInput() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Validate and normalize URL - returns { url, error } object
  const validateUrl = (input: string): { url: string | null; error: string | null } => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { url: null, error: 'Please enter a website URL' };
    }

    // Check if it looks like a domain (contains at least one dot)
    if (!trimmed.includes('.')) {
      return { url: null, error: 'Enter a valid domain (e.g., example.com)' };
    }

    try {
      let testUrl = trimmed;
      if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
        testUrl = `https://${testUrl}`;
      }
      const parsed = new URL(testUrl);

      // Must be a public website with a valid domain
      if (!parsed.hostname || parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        return { url: null, error: 'Please enter a public website URL' };
      }

      // Check for valid TLD (at least 2 characters after the last dot)
      const parts = parsed.hostname.split('.');
      const tld = parts[parts.length - 1];
      if (tld.length < 2 || /^\d+$/.test(tld)) {
        return { url: null, error: 'Enter a valid domain (e.g., example.com)' };
      }

      return { url: testUrl, error: null };
    } catch {
      return { url: null, error: 'Please enter a valid website URL' };
    }
  };

  const triggerError = (message: string) => {
    setError(message);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setError(null), 3000);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { url: validUrl, error: validationError } = validateUrl(url);
    if (validationError || !validUrl) {
      triggerError(validationError || 'Please enter a valid website URL');
      return;
    }

    setChecking(true);

    try {
      // Check if user is already logged in
      const response = await fetch('/api/auth/session');
      const session = await response.json();

      const encodedUrl = encodeURIComponent(validUrl);

      if (session.authenticated) {
        // User is logged in - redirect to dashboard with URL for confirmation
        router.push(`/dashboard?analyze=${encodedUrl}`);
      } else {
        // User not logged in - redirect to signup
        router.push(`/signup?url=${encodedUrl}`);
      }
    } catch {
      // On error, default to signup flow
      const encodedUrl = encodeURIComponent(validUrl);
      router.push(`/signup?url=${encodedUrl}`);
    } finally {
      setChecking(false);
    }
  };

  return (
    <form onSubmit={handleUrlSubmit} className="w-full max-w-2xl mx-auto">
      <div className={`flex flex-col sm:flex-row sm:items-start gap-3 ${shake ? 'animate-shake' : ''}`}>
        <div className="flex-grow">
          <label htmlFor="url" className="sr-only">Website URL</label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            placeholder="yourstartup.com"
            className={`w-full bg-[var(--surface-container-lowest)] rounded-xl px-6 py-4 text-[var(--on-surface)] focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-2 border-rose-300 focus:ring-rose-100 focus:border-rose-300'
                : 'ghost-border focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'
            }`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            disabled={checking}
          />
          {/* Error message - inline below input */}
          {error && (
            <p className="mt-2 text-rose-600 text-sm font-medium animate-fadeIn">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={checking}
          className="bg-[#5B5BD5] hover:bg-[#4a4ac4] text-white px-8 py-4 rounded-xl font-[family-name:var(--font-space-grotesk)] font-bold text-lg hover:scale-[0.98] transition-all whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {checking ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Checking...
            </span>
          ) : (
            'Analyze My Site'
          )}
        </button>
      </div>
    </form>
  );
}
