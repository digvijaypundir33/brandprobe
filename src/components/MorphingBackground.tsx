'use client';

export default function MorphingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Decorative Rings/Soft Shadows - visible on larger screens */}
      <div className="hidden lg:block">
        <div className="absolute inset-[0.5rem] rounded-[12rem] bg-white/[0.02] shadow-[0_0_40px_rgba(91,91,213,0.15)] blur-[4px]"></div>
        <div className="absolute inset-[3rem] rounded-[12rem] bg-white/[0.02] shadow-[0_0_30px_rgba(91,91,213,0.1)] blur-[3px]"></div>
        <div className="absolute inset-[6rem] rounded-[12rem] bg-white/[0.02] shadow-[0_0_20px_rgba(91,91,213,0.08)] blur-[2px]"></div>
        <div className="absolute inset-[10rem] rounded-[8rem] bg-white/[0.02] shadow-[inset_0_0_30px_rgba(255,255,255,0.4)] blur-[1px]"></div>
      </div>

      {/* The Morphing Blob - centered horizontally */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden blur-3xl flex items-center justify-center"
      >
        <div
          className="morph-blob aspect-[1155/678] w-[80%] bg-gradient-to-tr from-[#5B5BD5] to-[#7B7BE5] opacity-20 sm:w-[36rem] md:w-[72rem]"
        ></div>
      </div>
    </div>
  );
}
