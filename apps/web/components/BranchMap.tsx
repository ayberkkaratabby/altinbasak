'use client';

import React from 'react';

interface BranchMapProps {
  address: string;
  coordinates?: { lat: number; lng: number };
}

export function BranchMap({ address, coordinates }: BranchMapProps) {
  const mapsUrl = coordinates
    ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden border-2 bg-gray-100"
      style={{ borderColor: 'var(--color-primary)' }}
    >
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6R4Zuz5VwHs'}&q=${encodeURIComponent(address)}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0"
      />
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-background)',
        }}
      >
        Haritada Aç
      </a>
    </div>
  );
}

