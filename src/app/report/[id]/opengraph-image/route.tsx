import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reportId } = await params;

  try {
    // Fetch report data
    const reportResponse = await fetch(
      `${request.nextUrl.origin}/api/report/${reportId}`
    );
    const reportData = await reportResponse.json();

    if (!reportData.success || !reportData.report) {
      return new Response('Report not found', { status: 404 });
    }

    const report = reportData.report;
    const websiteName = new URL(report.url).hostname.replace(/^www\./, '');
    const overallScore = report.overallScore || 0;

    // Calculate top 5 scores
    const scores = [
      { label: 'Messaging', score: report.messagingScore || 0 },
      { label: 'SEO', score: report.seoScore || 0 },
      { label: 'Content', score: report.contentScore || 0 },
      { label: 'Ads', score: report.adsScore || 0 },
      { label: 'Conversion', score: report.conversionScore || 0 },
      { label: 'Distribution', score: report.distributionScore || 0 },
      { label: 'AI Search', score: report.aiSearchScore || 0 },
      { label: 'Technical', score: report.technicalScore || 0 },
      { label: 'Brand Health', score: report.brandHealthScore || 0 },
      { label: 'Design', score: report.designAuthenticityScore || 0 },
    ];

    const topScores = scores
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Pad if less than 5
    while (topScores.length < 5) {
      topScores.push({ label: '-', score: 0 });
    }

    const getScoreColor = (score: number) => {
      if (score >= 70) return '#16a34a';
      if (score >= 50) return '#ca8a04';
      if (score >= 30) return '#ea580c';
      return '#dc2626';
    };

    // Generate image using Next.js OG Image generation
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(to bottom, #eff6ff, #ffffff)',
            padding: '48px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '32px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  marginBottom: '4px',
                }}
              >
                BrandProbe
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Marketing Analysis
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  color: getScoreColor(overallScore),
                  lineHeight: 1,
                }}
              >
                {overallScore}/100
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                Overall Score
              </div>
            </div>
          </div>

          {/* Website Info */}
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              🌐 {websiteName}
            </div>
            <div style={{ fontSize: '20px', color: '#6b7280' }}>
              Marketing Analysis Report
            </div>
          </div>

          {/* Scores */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginBottom: '48px',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {topScores.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: getScoreColor(s.score),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {s.score}%
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
              Get your free website analysis
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>
              brandprobe.io
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Failed to generate OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
