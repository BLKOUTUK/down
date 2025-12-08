'use client';

export function PrototypeBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-black text-center py-1.5 px-4 text-sm font-medium">
      <span className="hidden sm:inline">Prototype Preview - </span>
      Experimental app, it may break
      <span className="hidden sm:inline"> - </span>
      <span className="sm:hidden"> | </span>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdk3azo5qC4KToH9jmfX4wt2v7YIHGc18HX0vE_Sf_sjwMQyA/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-bold hover:no-underline"
      >
        Share feedback
      </a>
    </div>
  );
}
