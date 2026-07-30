"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="w-full mt-20 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg relative bg-black">
        {isPlaying ? (
          <video
            className="w-full h-auto aspect-video object-cover"
            src="/prev.mp4"
            controls
            autoPlay
            playsInline
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <button
            onClick={() => setIsPlaying(true)}
            className="group relative w-full aspect-video block"
            aria-label="Play video"
          >
            <Image
              src="/video-poster.jpg"
              alt="Video preview"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all flex items-center justify-center shadow-lg">
                <Play
                  className="w-7 h-7 md:w-8 md:h-8 text-black ml-1"
                  fill="currentColor"
                />
              </div>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}