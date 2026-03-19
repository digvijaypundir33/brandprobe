'use client';

const steps = [
  {
    number: '01',
    title: 'Paste Your URL',
    description:
      'No complex setup. Just drop your link and tell us what you\'re trying to achieve. Our AI crawls your site immediately.',
  },
  {
    number: '02',
    title: 'We Probe',
    description:
      'Our proprietary "Editorial AI" analyzes your copy, performance, and SEO through the lens of a high-conversion marketer.',
  },
  {
    number: '03',
    title: 'You Act',
    description:
      'Get a prioritized list of fixes. From headline tweaks to technical SEO, we give you the exact steps to improve ROI.',
  },
];

export default function HowItWorksEditorial() {
  return (
    <section className="max-w-7xl mx-auto px-8 pt-4 pb-20">
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
          How Our Website Marketing Analysis Tool Works
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <span className="text-6xl text-gray-200 absolute -top-8 -left-2 z-0 select-none">
              {step.number}
            </span>
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-3 text-gray-900">
                {step.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
