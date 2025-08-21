"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  isLive?: boolean;
  src: string;
}

export default function VideoPlayer({ isLive = false, src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (src.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          liveDurationInfinity: isLive,
          enableWorker: true,
        });

        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!isLive) {
            video.play().catch((e) => console.log(e));
          }
        });

        return () => {
          hls.destroy();
        };
      }
    } else {
      video.src = src;
    }
  }, [src, isLive]);

  return (
    <div className="aspect-video overflow-hidden rounded-lg">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls
        playsInline
        autoPlay={isLive}
        muted={isLive}
      />
    </div>
  );
}
