"use client";

import dynamic from "next/dynamic";

const LocationMapPicker = dynamic(() => import("./LocationMapPicker"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 280,
        borderRadius: 16,
        background: "rgba(15, 46, 61, 0.6)",
      }}
    />
  ),
});

export default LocationMapPicker;
