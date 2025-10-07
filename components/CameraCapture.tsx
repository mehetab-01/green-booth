'use client';

import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db, auth } from '@/lib/firebase';

export default function CameraCapture() {
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setCapturing(false);
    }
  }, [webcamRef]);

  const uploadImage = async () => {
    if (!capturedImage || !auth.currentUser) return;

    setUploading(true);
    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // Upload to Firebase Storage
      const timestamp = Date.now();
      const storageRef = ref(
        storage,
        `images/${auth.currentUser.uid}/${timestamp}.jpg`
      );
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      await addDoc(collection(db, 'images'), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        userName: auth.currentUser.displayName,
        imageUrl: downloadURL,
        timestamp: new Date(),
        type: 'camera',
      });

      alert('Image uploaded successfully!');
      setCapturedImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!capturing && !capturedImage) {
    return (
      <button
        onClick={() => setCapturing(true)}
        className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Open Camera
      </button>
    );
  }

  if (capturedImage) {
    return (
      <div className="w-full space-y-4">
        <img
          src={capturedImage}
          alt="Captured"
          className="w-full rounded-lg shadow-lg"
        />
        <div className="flex gap-4">
          <button
            onClick={() => setCapturedImage(null)}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={uploading}
          >
            Retake
          </button>
          <button
            onClick={uploadImage}
            disabled={uploading}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full"
          videoConstraints={{
            facingMode: 'user',
          }}
        />
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setCapturing(false)}
          className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={capture}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Capture
        </button>
      </div>
    </div>
  );
}
