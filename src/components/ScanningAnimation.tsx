'use client';

import { useEffect, useState } from 'react';
import {
  Globe,
  FileText,
  Map,
  Newspaper,
  Shield,
  MessageCircle,
  Search,
  Pencil,
  Megaphone,
  MousePointerClick,
  Share2,
  Calculator,
  Sparkles,
  Loader2,
  Check,
  BarChart3,
} from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  icon: any;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
}

interface ScanningAnimationProps {
  websiteUrl?: string;
}

const VISIBLE_STEPS = 4; // Show only 4 steps at a time

// Extract hostname from URL for display
function getHostname(url: string): string {
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function ScanningAnimation({ websiteUrl }: ScanningAnimationProps = {}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allComplete, setAllComplete] = useState(false);

  const [steps, setSteps] = useState<ProgressStep[]>([
    {
      id: 'connecting',
      label: 'Connecting to website',
      icon: Globe,
      status: 'in-progress',
      description: "Knocking on your website's door...",
    },
    {
      id: 'scraping',
      label: 'Scraping homepage content',
      icon: FileText,
      status: 'pending',
      description: 'Reading every word on your page...',
    },
    {
      id: 'navigation',
      label: 'Analyzing navigation structure',
      icon: Map,
      status: 'pending',
      description: 'Exploring where everything lives...',
    },
    {
      id: 'headlines',
      label: 'Extracting headlines and CTAs',
      icon: Newspaper,
      status: 'pending',
      description: 'Checking if your copy pops...',
    },
    {
      id: 'trust',
      label: 'Identifying trust signals',
      icon: Shield,
      status: 'pending',
      description: 'Looking for credibility boosters...',
    },
    {
      id: 'messaging',
      label: 'Analyzing messaging clarity',
      icon: MessageCircle,
      status: 'pending',
      description: 'Decoding your brand voice...',
    },
    {
      id: 'seo',
      label: 'Evaluating SEO opportunities',
      icon: Search,
      status: 'pending',
      description: 'Finding your Google opportunities...',
    },
    {
      id: 'content',
      label: 'Generating content recommendations',
      icon: Pencil,
      status: 'pending',
      description: 'Planning your content strategy...',
    },
    {
      id: 'ads',
      label: 'Crafting ad angles',
      icon: Megaphone,
      status: 'pending',
      description: 'Brainstorming ad ideas...',
    },
    {
      id: 'conversion',
      label: 'Auditing conversion elements',
      icon: MousePointerClick,
      status: 'pending',
      description: 'Spotting conversion leaks...',
    },
    {
      id: 'distribution',
      label: 'Building distribution strategy',
      icon: Share2,
      status: 'pending',
      description: 'Mapping your reach strategy...',
    },
    {
      id: 'calculating',
      label: 'Calculating scores',
      icon: Calculator,
      status: 'pending',
      description: 'Crunching the numbers...',
    },
    {
      id: 'finalizing',
      label: 'Finalizing report',
      icon: Sparkles,
      status: 'pending',
      description: 'Putting the finishing touches...',
    },
  ]);

  // Simulate progress through steps
  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      setAllComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];
        // Mark current step as completed
        if (currentStepIndex > 0) {
          newSteps[currentStepIndex - 1].status = 'completed';
        }
        // Mark next step as in-progress
        if (currentStepIndex < newSteps.length) {
          newSteps[currentStepIndex].status = 'in-progress';
        }
        return newSteps;
      });
      setCurrentStepIndex((prev) => prev + 1);
    }, 4000); // Each step takes 4 seconds

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps.length]);

  // Mark last step as completed when all steps are done
  useEffect(() => {
    if (allComplete) {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];
        newSteps[newSteps.length - 1].status = 'completed';
        return newSteps;
      });
    }
  }, [allComplete]);

  const getStepIcon = (step: ProgressStep) => {
    const IconComponent = step.icon;
    if (step.status === 'completed') {
      return <Check className="w-5 h-5 text-green-500" />;
    }
    if (step.status === 'in-progress') {
      return <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'rgb(91, 91, 213)' }} />;
    }
    return <IconComponent className="w-5 h-5 text-gray-400" />;
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter((s) => s.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  // Get visible steps (sliding window)
  const getVisibleSteps = () => {
    if (allComplete) {
      // Show last 4 completed steps
      return steps.slice(-VISIBLE_STEPS);
    }

    // Calculate the range of steps to show
    const inProgressIndex = steps.findIndex((s) => s.status === 'in-progress');

    if (inProgressIndex === -1) return steps.slice(0, VISIBLE_STEPS);

    // Show 1 completed + current in-progress + 2 pending
    const startIndex = Math.max(0, inProgressIndex - 1);
    const endIndex = Math.min(steps.length, startIndex + VISIBLE_STEPS);

    return steps.slice(startIndex, endIndex);
  };

  const visibleSteps = getVisibleSteps();
  const completedCount = steps.filter((s) => s.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center bg-white border-b border-gray-100">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-100">
              {allComplete ? (
                <Sparkles className="w-8 h-8" style={{ color: 'rgb(91, 91, 213)' }} />
              ) : (
                <BarChart3 className="w-8 h-8 animate-pulse" style={{ color: 'rgb(91, 91, 213)' }} />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {allComplete ? 'Report Ready!' : websiteUrl ? `Analyzing ${getHostname(websiteUrl)}` : 'Analyzing Your Brand'}
            </h1>
            <p className="text-lg text-gray-600">
              {allComplete
                ? 'Your comprehensive brand analysis is complete'
                : 'Probing your website across 10 key areas...'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="px-8 pt-6">
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${getProgressPercentage()}%`,
                    backgroundColor: 'rgb(91, 91, 213)',
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-600">
                  Step {completedCount + (allComplete ? 0 : 1)} of {steps.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {Math.round(getProgressPercentage())}% Complete
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps - Only show 4 at a time */}
          <div className="p-8 space-y-3">
            {visibleSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
                  step.status === 'in-progress'
                    ? 'bg-blue-50 border-2 scale-[1.02]'
                    : step.status === 'completed'
                    ? 'bg-green-50 border-2 border-green-100'
                    : 'bg-gray-50 border-2 border-transparent'
                }`}
                style={
                  step.status === 'in-progress'
                    ? { borderColor: 'rgb(91, 91, 213)', backgroundColor: 'rgba(91, 91, 213, 0.05)' }
                    : {}
                }
              >
                <div className="flex-shrink-0 mt-0.5">{getStepIcon(step)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`font-semibold text-sm ${
                        step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {step.label}
                    </h3>
                    {step.status === 'completed' && (
                      <span className="text-xs text-green-600 font-medium">Done</span>
                    )}
                    {step.status === 'in-progress' && (
                      <span className="text-xs font-medium animate-pulse" style={{ color: 'rgb(91, 91, 213)' }}>
                        Processing...
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 italic ${
                      step.status === 'pending' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {!allComplete && (
            <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
              <p className="text-sm text-gray-600">This usually takes 60-90 seconds...</p>
            </div>
          )}

          {allComplete && (
            <div className="bg-green-50 p-6 text-center border-t border-green-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                <p className="text-lg font-semibold text-green-600">Analysis Complete!</p>
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">
                Your comprehensive brand report is ready. Redirecting to results...
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
