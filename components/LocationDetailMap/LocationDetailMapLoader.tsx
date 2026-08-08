"use client";

import dynamic from "next/dynamic";

const LocationDetailMap = dynamic(() => import("./LocationDetailMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 240,
        borderRadius: 16,
        background: "rgba(15, 46, 61, 0.6)",
      }}
    />
  ),
});

export default LocationDetailMap;
