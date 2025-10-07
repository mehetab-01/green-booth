'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import AuthButton from '@/components/AuthButton';
import CameraCapture from '@/components/CameraCapture';
import ImageUpload from '@/components/ImageUpload';
import QRCodeDisplay from '@/components/QRCodeDisplay';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-green-800 mb-2">
              🌿 Green Booth
            </h1>
            <p className="text-gray-600">
              Capture and share your green initiatives
            </p>
          </div>
          <AuthButton />
        </header>

        {!user ? (
          /* Not signed in - show QR code and sign in prompt */
          <div className="max-w-md mx-auto space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to Green Booth
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in with Google to capture and upload images related to
                greenery, social cleanliness, and green club events.
              </p>
              <div className="flex justify-center">
                <AuthButton />
              </div>
            </div>
            <QRCodeDisplay />
          </div>
        ) : (
          /* Signed in - show camera and upload options */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Capture Your Green Moment
              </h2>
              <div className="space-y-4">
                <CameraCapture />
                <div className="text-center text-gray-500">or</div>
                <ImageUpload />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">
                📸 Photo Guidelines
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Capture greenery and environmental initiatives</li>
                <li>• Document cleanliness drives and social activities</li>
                <li>• Share green club events and programs</li>
                <li>• Inspire others with your eco-friendly actions</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
