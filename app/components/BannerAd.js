"use client";

import { useState, useEffect } from "react";

export default function BannerAd() {
  const [currentAd, setCurrentAd] = useState(0);

  const ads = [
    { title: "Next Issue Coming Soon!", image: "/ad1.jpg" },
    { title: "Read Issue 1 Now!", image: "/ad2.jpg" },
    { title: "Check Out Our Merch!", image: "/ad3.jpg" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-red-600 text-center">
        <p className="font-bold mb-2">{ads[currentAd].title}</p>
        <div className="border-2 border-red-600 p-2">
          [Ad Image {currentAd + 1}]
        </div>
      </div>
    </div>
  );
}
