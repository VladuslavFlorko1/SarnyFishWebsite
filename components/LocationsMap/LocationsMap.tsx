"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import Link from "next/link";
import { Location } from "@/types/location";
import styles from "./LocationsMap.module.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationsMapProps {
  locations: Location[];
}

const DEFAULT_CENTER: [number, number] = [51.335, 26.599];

export default function LocationsMap({ locations }: LocationsMapProps) {
  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={11}
        className={styles.map}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <Marker
            key={location._id}
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={markerIcon}
          >
            <Popup>
              <div className={styles.popup}>
                {location.images?.[0] && (
                  <div className={styles.popupImageWrapper}>
                    <Image
                      src={location.images[0]}
                      alt={location.name}
                      fill
                      sizes="200px"
                      className={styles.popupImage}
                    />
                  </div>
                )}
                <p className={styles.popupName}>{location.name}</p>
                <p className={styles.popupCity}>{location.city}</p>
                <div className={styles.popupFish}>
                  {location.fish.slice(0, 3).map((fish) => (
                    <span key={fish} className={styles.popupTag}>
                      {fish}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/locations/${location._id}`}
                  className={styles.popupLink}
                >
                  Детальніше
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
