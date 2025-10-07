'use client';

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db, auth } from '@/lib/firebase';

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!selectedFile || !auth.currentUser) return;

    setUploading(true);
    try {
      // Upload to Firebase Storage
      const timestamp = Date.now();
      const storageRef = ref(
        storage,
        `images/${auth.currentUser.uid}/${timestamp}_${selectedFile.name}`
      );
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      await addDoc(collection(db, 'images'), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        userName: auth.currentUser.displayName,
        imageUrl: downloadURL,
        timestamp: new Date(),
        type: 'upload',
      });

      alert('Image uploaded successfully!');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (previewUrl && selectedFile) {
    return (
      <div className="w-full space-y-4">
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full rounded-lg shadow-lg"
        />
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={uploading}
          >
            Cancel
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
    <label className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer">
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
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Upload Image
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </label>
  );
}
