import { useState, useRef, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import JSZip from 'jszip';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBU2MvuZpfSQXIyWOkgprYiN7PZy3W1nnA",
  authDomain: "green-booth.firebaseapp.com",
  projectId: "green-booth",
  storageBucket: "green-booth.firebasestorage.app",
  messagingSenderId: "357781015739",
  appId: "1:357781015739:web:6d08463b6e633f4d39ad9e",
  measurementId: "G-KSFW4KWNFT"
};

// Admin emails who can download all photos - ADD YOUR EMAIL HERE
const ADMIN_EMAILS = [
  'shaaz.mehetab@gmail.com',  // Replace with your email
  // Add more admin emails below:
  // 'admin2@gmail.com',
  // 'admin3@gmail.com',
];

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// SVG Icons
const CameraIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const GalleryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const FlipCameraIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

function App() {
  const [user, setUser] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'gallery'
  const [photos, setPhotos] = useState([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front camera, 'environment' for back
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Check if user is admin
  useEffect(() => {
    if (user && user.email) {
      const userIsAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
      setIsAdmin(userIsAdmin);
      if (userIsAdmin) {
        console.log('Admin access granted for:', user.email);
      }
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load photos from Firestore - now loads for all users, even when not signed in
  useEffect(() => {
    setIsLoadingPhotos(true);
    const q = query(collection(db, 'photos'), orderBy('timestamp', 'desc'), limit(50));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const photosData = [];
      querySnapshot.forEach((doc) => {
        photosData.push({ id: doc.id, ...doc.data() });
      });
      setPhotos(photosData);
      setIsLoadingPhotos(false);
    }, (error) => {
      console.error('Error loading photos:', error);
      showMessage('Error loading gallery.', 'error');
      setIsLoadingPhotos(false);
    });

    return () => unsubscribe();
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const signInWithGoogle = async () => {
    setIsAuthenticating(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showMessage('Successfully signed in!', 'success');
    } catch (error) {
      console.error('Error signing in:', error);
      showMessage('Failed to sign in. Please try again.', 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setPhotoPreview(null);
      showMessage('Successfully signed out.', 'success');
    } catch (error) {
      console.error('Error signing out:', error);
      showMessage('Failed to sign out.', 'error');
    }
  };

  const startCamera = async () => {
    setIsCameraLoading(true);
    setIsCameraActive(false);
    
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraLoading(false);
      showMessage('Camera not supported on this device or browser. Please use a modern browser with HTTPS.', 'error');
      return;
    }

    try {
      // First, stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      console.log('Requesting camera access with facingMode:', facingMode);
      
      const constraints = {
        video: {
          facingMode: facingMode, // 'user' for front, 'environment' for back
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', stream);
      
      if (!videoRef.current) {
        console.error('Video element not found');
        setIsCameraLoading(false);
        showMessage('Video element not ready. Please try again.', 'error');
        return;
      }

      // Store stream reference
      streamRef.current = stream;
      
      // Set video source
      videoRef.current.srcObject = stream;
      
      // Ensure video element is properly configured
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.autoplay = true;
      
      console.log('Video element configured, waiting for metadata...');
      
      // Create a promise that resolves when video is ready
      const videoReady = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video metadata loading timeout'));
        }, 5000);

        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          clearTimeout(timeout);
          resolve();
        };

        // Sometimes metadata event doesn't fire, check if already loaded
        if (videoRef.current.readyState >= 2) {
          console.log('Video already ready');
          clearTimeout(timeout);
          resolve();
        }
      });

      try {
        await videoReady;
        console.log('Attempting to play video...');
        await videoRef.current.play();
        console.log('Video playing successfully');
        setIsCameraActive(true);
        setIsCameraLoading(false);
        showMessage('Camera started successfully!', 'success');
      } catch (playError) {
        console.error('Error playing video:', playError);
        // Try one more time with a small delay
        await new Promise(resolve => setTimeout(resolve, 100));
        try {
          await videoRef.current.play();
          console.log('Video playing after retry');
          setIsCameraActive(true);
          setIsCameraLoading(false);
          showMessage('Camera started successfully!', 'success');
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          setIsCameraLoading(false);
          showMessage('Error starting camera preview. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraLoading(false);
      
      // Clean up stream if it was created
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      let errorMessage = 'Unable to access camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported. Please use HTTPS.';
      } else if (error.name === 'TypeError') {
        errorMessage += 'Camera access requires HTTPS. Make sure you\'re using https://.';
      } else if (error.name === 'AbortError') {
        errorMessage += 'Camera access was aborted. Please try again.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Camera resolution not supported. Trying with default settings...';
        // Retry with simpler constraints
        setTimeout(() => startCameraSimple(), 1000);
        return;
      } else {
        errorMessage += `Error: ${error.message || 'Please check your camera settings and permissions.'}`;
      }
      
      showMessage(errorMessage, 'error');
    }
  };

  // Flip camera between front and back
  const flipCamera = async () => {
    if (!isCameraActive) return;
    
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    setIsCameraLoading(true);
    
    try {
      // Stop current stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Start with new facing mode
      const constraints = {
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        await videoRef.current.play();
        setIsCameraLoading(false);
        showMessage(`Switched to ${newFacingMode === 'user' ? 'front' : 'back'} camera`, 'success');
      }
    } catch (error) {
      console.error('Error flipping camera:', error);
      setIsCameraLoading(false);
      showMessage('Could not switch camera. This device may only have one camera.', 'error');
    }
  };

  // Simplified camera start with minimal constraints (fallback)
  const startCameraSimple = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode } 
      });
      if (videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        await videoRef.current.play();
        setIsCameraActive(true);
        showMessage('Camera started with basic settings!', 'success');
      }
    } catch (err) {
      console.error('Simple camera start failed:', err);
      showMessage('Camera failed to start. Please check permissions.', 'error');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      
      // Only flip for front camera (user facing)
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPhotoPreview(photoDataUrl);
      
      // Stop camera stream
      stopCamera();
      showMessage('Photo captured successfully!', 'success');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showMessage('Please select a valid image file.', 'error');
    }
  };

  const submitPhoto = async () => {
    if (!photoPreview || !user) {
      showMessage('Please capture or upload a photo first.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      await addDoc(collection(db, 'photos'), {
        imageData: photoPreview,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        timestamp: serverTimestamp()
      });
      
      showMessage('Photo submitted successfully!', 'success');
      
      // Reset the form
      setPhotoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error submitting photo:', error);
      showMessage('Failed to submit photo. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const cancelCamera = () => {
    stopCamera();
    showMessage('Camera stopped.', 'success');
  };

  // Admin function to download all photos as ZIP
  const downloadAllPhotos = async () => {
    if (!user) {
      showMessage('Please sign in to download photos.', 'error');
      return;
    }

    // Check if user is admin
    if (!isAdmin) {
      showMessage('You do not have permission to download all photos. Only admins can access this feature.', 'error');
      return;
    }

    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder('green-booth-photos');

      showMessage(`Preparing ${photos.length} photos for download...`, 'success');

      // Add each photo to the ZIP
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        try {
          // Convert base64 to blob
          const base64Data = photo.imageData.split(',')[1];
          const binaryData = atob(base64Data);
          const arrayBuffer = new Uint8Array(binaryData.length);
          
          for (let j = 0; j < binaryData.length; j++) {
            arrayBuffer[j] = binaryData.charCodeAt(j);
          }

          // Create filename with date and user info
          const date = photo.timestamp 
            ? new Date(photo.timestamp.seconds * 1000).toISOString().split('T')[0]
            : 'unknown';
          const userName = photo.userName ? photo.userName.replace(/\s+/g, '-') : 'anonymous';
          const filename = `${date}_${userName}_${i + 1}.jpg`;

          imgFolder.file(filename, arrayBuffer, { binary: true });
        } catch (err) {
          console.error(`Error processing photo ${i}:`, err);
        }
      }

      // Generate ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Download the ZIP
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `green-booth-photos-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showMessage('Photos downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error downloading photos:', error);
      showMessage('Failed to download photos. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Menu Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <h1 className="text-xl font-bold text-green-800">Green Booth</h1>
            </div>

            {/* Menu Items */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                  currentView === 'home'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <HomeIcon />
                <span className="hidden sm:inline">Home</span>
              </button>
              
              <button
                onClick={() => setCurrentView('gallery')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                  currentView === 'gallery'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <GalleryIcon />
                <span className="hidden sm:inline">Gallery</span>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {photos.length}
                </span>
              </button>

              {user && (
                <div className="flex items-center gap-2 ml-2">
                  <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                    {user.photoURL && (
                      <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                    )}
                    <span className="text-sm text-gray-700">{user.displayName?.split(' ')[0] || user.email}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Gallery View */}
        {currentView === 'gallery' ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold text-green-800">Photo Gallery</h2>
                <span className="text-sm text-gray-600">{photos.length} photos</span>
              </div>
              
              {user && isAdmin && photos.length > 0 && (
                <button
                  onClick={downloadAllPhotos}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition duration-200 shadow-md"
                >
                  {isDownloading ? (
                    <>
                      <LoadingSpinner />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <DownloadIcon />
                      <span>Download All</span>
                    </>
                  )}
                </button>
              )}
              
              {user && !isAdmin && photos.length > 0 && (
                <div className="text-xs text-gray-500 italic">
                  Admin access required to download
                </div>
              )}
            </div>
            
            {isLoadingPhotos ? (
              <div className="text-center py-12">
                <LoadingSpinner />
                <p className="mt-4 text-gray-500">Loading photos...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-12">
                <ImagePlaceholderIcon />
                <p className="mt-4 text-gray-500">No photos yet. Be the first to share!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-2">
                {photos.map((photo) => (
                  <div key={photo.id} className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200">
                    <img 
                      src={photo.imageData} 
                      alt="Uploaded" 
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {photo.userName && (
                          <span className="font-semibold">{photo.userName}</span>
                        )}
                        {photo.timestamp && (
                          <span className="text-xs">
                            {new Date(photo.timestamp.seconds * 1000).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
            Capture Your Green Moment
          </h2>
          <p className="text-lg text-green-700">
            Take or upload a photo to share with the community
          </p>
        </div>

        {/* Sign In Required */}
        {!user ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="text-center py-12">
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Sign In Required</h2>
              <p className="text-gray-600 mb-6">Please sign in with your Google account to use Green Booth</p>
              <button
                onClick={signInWithGoogle}
                disabled={isAuthenticating}
                className="inline-flex items-center gap-3 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                  <>
                    <LoadingSpinner />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Photo Preview / Camera Feed Area */}
          <div className="mb-6">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px] md:aspect-video">
              {/* Video element - always rendered but hidden when not active */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-contain md:object-cover ${isCameraActive ? '' : 'hidden'}`}
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
              />
              
              {/* Flip Camera Button - shown when camera is active on mobile/tablet only */}
              {isCameraActive && (
                <button
                  onClick={flipCamera}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition duration-200 shadow-lg md:hidden z-10"
                  title="Flip Camera"
                  disabled={isCameraLoading}
                >
                  <FlipCameraIcon />
                </button>
              )}
              
              {/* Photo preview */}
              {!isCameraActive && photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              )}
              
              {/* Placeholder */}
              {!isCameraActive && !photoPreview && (
                <div className="text-center">
                  <ImagePlaceholderIcon />
                  <p className="mt-4 text-gray-500">No photo captured yet</p>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Camera Controls */}
            <div className="flex gap-3">
              {!isCameraActive && !isCameraLoading ? (
                <button
                  onClick={startCamera}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md"
                >
                  <CameraIcon />
                  Start Camera
                </button>
              ) : isCameraLoading ? (
                <button
                  disabled
                  className="flex-1 bg-green-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md cursor-wait"
                >
                  <LoadingSpinner />
                  Starting Camera...
                </button>
              ) : (
                <>
                  <button
                    onClick={capturePhoto}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md"
                  >
                    <CameraIcon />
                    Capture Photo
                  </button>
                  <button
                    onClick={cancelCamera}
                    className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* File Upload */}
            {!isCameraActive && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <UploadIcon />
                  Upload File
                </label>
              </div>
            )}

            {/* Submit Button */}
            {!isCameraActive && (
              <button
                onClick={submitPhoto}
                disabled={!photoPreview || isUploading}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md ${
                  !photoPreview || isUploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isUploading ? (
                  <>
                    <LoadingSpinner />
                    Submitting...
                  </>
                ) : (
                  'Submit Photo'
                )}
              </button>
            )}
          </div>
        </div>
        </>
        )}
        </>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-green-700 text-sm">
          <p>🌱 Every photo helps our environmental cause 🌱</p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
