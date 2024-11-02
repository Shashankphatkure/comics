"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function BannerAd() {
  const [currentAd, setCurrentAd] = useState(0);

  const ads = [
    {
      title: "Next Issue Coming Soon!",
      image:
        "https://images.unsplash.com/photo-1611416517780-eff3a13b0359?w=500&h=300",
    },
    {
      title: "Read Issue 1 Now!",
      image:
        "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=500&h=300",
    },
    {
      title: "Check Out Our Merch!",
      image:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=300",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-[var(--color-text)] text-center w-full">
        <p className="font-bold mb-2">{ads[currentAd].title}</p>
        <div className="relative aspect-video w-full overflow-hidden comic-panel">
          <Image
            src={ads[currentAd].image}
            alt={ads[currentAd].title}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
