
"use client";

export default function VideoSection() {
  return (
      <section className="w-full mt-20 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg">
        <video
          className="w-full h-auto aspect-video object-cover"
          src="/prev.mp4"
          poster="/images/about-poster.jpg"
          controls
          playsInline
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}