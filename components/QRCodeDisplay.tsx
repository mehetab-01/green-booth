'use client';

import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay() {
  const [url, setUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (url && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#059669',
          light: '#ffffff',
        },
      }).catch((err) => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [url]);

  if (!url) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Scan to Access Green Booth
      </h2>
      <div className="flex justify-center">
        <canvas ref={canvasRef} />
      </div>
      <p className="text-sm text-gray-600 text-center mt-4">
        Scan this QR code to access the application
      </p>
    </div>
  );
}
