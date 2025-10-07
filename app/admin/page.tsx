'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from 'firebase/auth';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

interface ImageData {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  imageUrl: string;
  timestamp: {
    toDate?: () => Date;
  } | Date;
  type: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadImages();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadImages = async () => {
    setLoadingImages(true);
    try {
      const q = query(collection(db, 'images'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const imagesData: ImageData[] = [];
      querySnapshot.forEach((doc) => {
        imagesData.push({ id: doc.id, ...doc.data() } as ImageData);
      });
      setImages(imagesData);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Admin Access Required
              </h1>
              <p className="text-gray-600 mb-6">
                Please sign in to access the admin panel.
              </p>
              <div className="flex justify-center">
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
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
              🌿 Green Booth Admin
            </h1>
            <p className="text-gray-600">View all uploaded images</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </Link>
            <AuthButton />
          </div>
        </header>

        {/* Stats */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {images.length}
              </div>
              <div className="text-gray-600">Total Images</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {images.filter((img) => img.type === 'camera').length}
              </div>
              <div className="text-gray-600">Camera Captures</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {images.filter((img) => img.type === 'upload').length}
              </div>
              <div className="text-gray-600">Uploads</div>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {loadingImages ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">
              No images uploaded yet. Start capturing green moments!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-64">
                  <img
                    src={image.imageUrl}
                    alt="Green booth submission"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        image.type === 'camera'
                          ? 'bg-blue-500 text-white'
                          : 'bg-purple-500 text-white'
                      }`}
                    >
                      {image.type === 'camera' ? '📷 Camera' : '📤 Upload'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-semibold text-gray-800">
                      {image.userName || 'Anonymous'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {image.userEmail}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(
                      typeof image.timestamp === 'object' && 'toDate' in image.timestamp && image.timestamp.toDate
                        ? image.timestamp.toDate()
                        : image.timestamp as Date
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
