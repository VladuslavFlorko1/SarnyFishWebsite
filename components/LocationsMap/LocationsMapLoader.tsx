"use client";

import dynamic from "next/dynamic";

const LocationsMap = dynamic(() => import("./LocationsMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 400,
        borderRadius: 16,
        background: "rgba(15, 46, 61, 0.6)",
      }}
    />
  ),
});

export default LocationsMap;
