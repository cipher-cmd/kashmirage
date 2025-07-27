'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Modal from '@/components/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResultCard, { AnalysisResult } from '@/components/ResultCard';
import {
  Camera,
  Cpu,
  BellRing,
  Code,
  Bot,
  Database,
  Wind,
  MapPin,
  RefreshCw,
  Sparkles,
  Languages,
  TabletSmartphone,
  Upload,
} from 'lucide-react';

// --- Interfaces and Data ---
interface TranslationContent {
  tagline: string;
  locationsTitle: string;
  featuresTitle: string;
  featuresSubtitle: string;
}
interface Translations {
  en: TranslationContent;
  hi: TranslationContent;
  ks: TranslationContent;
}
const translations: Translations = {
  en: {
    tagline: 'Scan. Discover. Learn.',
    locationsTitle: 'Explore Hidden Gems',
    featuresTitle: 'Features & Technology',
    featuresSubtitle:
      'KashMirage combines modern web technologies to create a seamless and informative experience.',
  },
  hi: {
    tagline: 'स्कैन करें। खोजें। जानें।',
    locationsTitle: 'छिपे हुए रत्न खोजें',
    featuresTitle: 'विशेषताएँ और प्रौद्योगिकी',
    featuresSubtitle:
      'कशमिराज एक सहज और जानकारीपूर्ण अनुभव बनाने के लिए आधुनिक वेब तकनीकों को जोड़ता है।',
  },
  ks: {
    tagline: 'سکین کٔریو۔ ژھانٛڈِو۔ ہیٚچھِو۔',
    locationsTitle: 'لُکمتؠ جوہر ژھانٛڈِو',
    featuresTitle: 'خصوصیت تہٕ ٹیکنالوجی',
    featuresSubtitle:
      'کشمیراج چھُ جدید ویب ٹیکنالوجی ہُنٛد اِستعمال کران اَکھ ہموار تہٕ معلوماتی تجربہٕ پٲداه کرنہٕ خٲطرٕ۔',
  },
};
interface Location {
  name: string;
  description: string;
  image?: string;
  isLoading?: boolean;
}
const initialLocations: Location[] = [
  {
    name: 'Tarsar Lake',
    description:
      'A breathtaking almond-shaped alpine lake nestled between two mountains.',
  },
  {
    name: 'Gadsar Lake',
    description:
      'The "Lake of Flowers," known for its stunning beauty and floating icebergs even in summer.',
  },
  {
    name: 'Doodhpathri',
    description:
      'A "Valley of Milk," a beautiful meadow with lush green pastures.',
  },
];

// --- Helper Components ---
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div
    className="bg-white/5 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/10 h-full 
                 transition-all duration-300 ease-in-out 
                 hover:scale-105 hover:shadow-orange-500/30 hover:bg-white/10"
  >
    <div className="text-orange-500 mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
  </div>
);
const TechCard = ({ icon, name }: { icon: React.ReactNode; name: string }) => (
  <div
    className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/10 
                 transition-all duration-300 ease-in-out 
                 hover:scale-110 hover:shadow-orange-500/30 hover:bg-white/10"
  >
    <div className="w-10 h-10 text-orange-400">{icon}</div>
    <span className="text-xl font-semibold text-white">{name}</span>
  </div>
);
const LocationCard = ({ name, description, image, isLoading }: Location) => (
  <div
    className="bg-black/30 rounded-lg shadow-2xl overflow-hidden group 
                 transition-all duration-300 ease-in-out 
                 hover:shadow-orange-500/40 hover:-translate-y-2 hover:scale-105"
  >
    <div className="w-full h-56 bg-gray-800/50 flex items-center justify-center overflow-hidden">
      {isLoading && (
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
      )}
      {image && (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      )}
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

export default function Home() {
  // --- State Management ---
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isConnectModalOpen, setConnectModalOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [isExploring, setIsExploring] = useState(false);

  // This is the clean and correct fix for the build error.
  const [language, setLanguage] = useState<keyof Translations>('en');
  const t = translations[language];

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Image Generation Effect ---
  useEffect(() => {
    const generateImagesForNewLocations = async () => {
      const locationsToUpdate = locations.filter(
        (loc) => !loc.image && !loc.isLoading
      );
      if (locationsToUpdate.length === 0) return;
      setLocations((prev) =>
        prev.map((loc) =>
          locationsToUpdate.some((ltu) => ltu.name === loc.name)
            ? { ...loc, isLoading: true }
            : loc
        )
      );
      for (const location of locationsToUpdate) {
        try {
          const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: location.name }),
          });
          if (!response.ok)
            throw new Error('Image generation failed for ' + location.name);
          const data = await response.json();
          setLocations((prev) =>
            prev.map((loc) =>
              loc.name === location.name
                ? { ...loc, image: data.imageUrl, isLoading: false }
                : loc
            )
          );
        } catch (error) {
          console.error(error);
          setLocations((prev) =>
            prev.map((loc) =>
              loc.name === location.name
                ? {
                    ...loc,
                    image:
                      'https://placehold.co/600x400/1e2b3b/f87171?text=Error',
                    isLoading: false,
                  }
                : loc
            )
          );
        }
      }
    };
    generateImagesForNewLocations();
  }, [locations]);

  // --- Handlers ---
  const handleExploreMore = async () => {
    setIsExploring(true);
    const existingNames = locations.map((l) => l.name);
    try {
      const response = await fetch('/api/suggest-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ existingLocations: existingNames }),
      });
      if (!response.ok) throw new Error('Failed to get suggestions');
      const { suggestedLocation } = await response.json();
      if (
        suggestedLocation &&
        !locations.find((l) => l.name === suggestedLocation.name)
      ) {
        setLocations((prev) => [
          ...prev,
          { ...suggestedLocation, isLoading: false, image: undefined },
        ]);
      }
    } catch (err) {
      console.error('Failed to explore more locations', err);
    } finally {
      setIsExploring(false);
    }
  };

  const handleStartCapture = async () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(streamData);
      if (videoRef.current) videoRef.current.srcObject = streamData;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(
        'Could not access the camera. Please check your browser permissions.'
      );
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage }),
      });
      if (!response.ok) {
        let errorMsg = 'Failed to analyze image';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          errorMsg = 'The server returned an unexpected response.';
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      const fullResult: AnalysisResult = {
        name: data.name,
        location: 'AI Generated Description',
        description: data.description,
        funFacts: [
          'Analysis generated by AI.',
          'Describes the visual content.',
          'Can describe almost any image!',
        ],
        imageUrl: capturedImage,
      };
      setAnalysisResult(fullResult);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // --- UI State ---
  const showInitialView =
    !stream && !capturedImage && !isLoading && !analysisResult && !error;
  const showCameraView = stream && !capturedImage;
  const showCapturedView =
    capturedImage && !isLoading && !analysisResult && !error;
  const showLoadingView = isLoading;
  const showResultView = analysisResult && !error;
  const showErrorView = error;

  return (
    <div className="bg-black/60 backdrop-blur-sm flex flex-col min-h-screen text-gray-200">
      <Header
        onConnectClick={() => setConnectModalOpen(true)}
        onLanguageSelect={(lang) => setLanguage(lang as keyof Translations)}
      />
      <main className="flex-grow">
        <div className="min-h-screen flex flex-col items-center justify-center text-center w-full pt-32 pb-12 px-4">
          {showInitialView && (
            <div className="animate-fade-in flex flex-col items-center">
              {' '}
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl">
                Kash<span className="text-orange-500">Mirage</span>
              </h1>{' '}
              <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300 sm:text-2xl">
                {t.tagline}
              </p>{' '}
              <div className="mt-12 flex flex-col sm:flex-row gap-6">
                {' '}
                <button
                  onClick={handleStartCapture}
                  className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full text-xl hover:bg-orange-700 shadow-lg flex items-center gap-3"
                >
                  <Camera size={30} />
                  <span>Use Camera</span>
                </button>{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-gray-600 text-white font-bold rounded-full text-xl hover:bg-gray-700 shadow-lg flex items-center gap-3"
                >
                  <Upload size={30} />
                  <span>Upload Image</span>
                </button>{' '}
              </div>{' '}
            </div>
          )}
          {showCameraView && (
            <div className="w-full max-w-4xl animate-fade-in">
              {' '}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg shadow-2xl border-4 border-white/20"
              />{' '}
              <div className="mt-8">
                <button
                  onClick={handleTakePhoto}
                  className="px-12 py-5 bg-red-600 text-white font-bold rounded-full text-2xl hover:bg-red-700"
                >
                  Take Photo
                </button>
              </div>{' '}
            </div>
          )}
          {showCapturedView && (
            <div className="w-full max-w-4xl animate-fade-in">
              {' '}
              <h2 className="text-3xl font-bold text-white mb-4">
                Confirm Your Image
              </h2>{' '}
              <img
                src={capturedImage!}
                alt="Captured"
                className="w-full rounded-lg shadow-2xl border-4 border-white/20"
              />{' '}
              <div className="mt-8 flex justify-center gap-6">
                {' '}
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-gray-600 text-white font-bold rounded-full text-lg hover:bg-gray-700"
                >
                  Retake
                </button>{' '}
                <button
                  onClick={handleAnalyzePhoto}
                  className="px-8 py-4 bg-green-600 text-white font-bold rounded-full text-lg hover:bg-green-700"
                >
                  Continue with this image
                </button>{' '}
              </div>{' '}
            </div>
          )}
          {showLoadingView && <LoadingSpinner />}
          {showResultView && (
            <div className="flex flex-col items-center gap-8 animate-fade-in">
              {' '}
              <ResultCard result={analysisResult} />{' '}
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full text-lg hover:bg-orange-700"
              >
                Scan Another
              </button>{' '}
            </div>
          )}
          {showErrorView && (
            <div className="flex flex-col items-center gap-4 animate-fade-in p-8 bg-red-900/50 rounded-lg border border-red-500/50">
              {' '}
              <h2 className="text-2xl font-bold text-red-400">
                Analysis Failed
              </h2>{' '}
              <p className="text-red-300">{error}</p>{' '}
              <button
                onClick={handleReset}
                className="mt-4 px-8 py-4 bg-orange-600 text-white font-bold rounded-full text-lg hover:bg-orange-700"
              >
                Try Again
              </button>{' '}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        <section
          id="locations"
          className="w-full bg-black/30 backdrop-blur-xl py-24 px-4"
        >
          <div className="container mx-auto text-center">
            <MapPin size={48} className="mx-auto text-orange-500 mb-6" />
            <h2 className="text-5xl font-extrabold text-white mb-6">
              {t.locationsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {locations.map((location) => (
                <LocationCard key={location.name} {...location} />
              ))}
            </div>
            <div className="mt-16">
              <button
                onClick={handleExploreMore}
                disabled={isExploring}
                className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full text-lg hover:bg-orange-700 disabled:bg-gray-500 flex items-center gap-3 mx-auto"
              >
                {isExploring ? (
                  <>
                    <RefreshCw className="animate-spin" />
                    <span>Discovering...</span>
                  </>
                ) : (
                  'Explore More'
                )}
              </button>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full bg-black/40 backdrop-blur-2xl py-24 px-4"
        >
          <div className="container mx-auto text-center">
            <h2 className="text-5xl font-extrabold text-white mb-6">
              {t.featuresTitle}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16">
              {t.featuresSubtitle}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20 text-left">
              <FeatureCard
                icon={<Camera size={40} />}
                title="AI Landmark Recognition"
                description="Utilizes Google Cloud Vision to accurately identify landmarks from user-captured photos."
              />
              <FeatureCard
                icon={<Sparkles size={40} />}
                title="Generative AI Imagery"
                description="Dynamically creates beautiful, photorealistic images for locations using a powerful AI model."
              />
              <FeatureCard
                icon={<RefreshCw size={40} />}
                title="AI-Powered Discovery"
                description="Suggests new, unexplored locations for users to discover."
              />
              <FeatureCard
                icon={<BellRing size={40} />}
                title="Secure Backend API"
                description="Protects API keys by handling all external AI requests through secure, server-side Next.js routes."
              />
              <FeatureCard
                icon={<TabletSmartphone size={40} />}
                title="Responsive & Interactive UI"
                description="Built with a mobile-first approach using Tailwind CSS for a seamless experience on all devices."
              />
              <FeatureCard
                icon={<Languages size={40} />}
                title="Multi-Lingual Support"
                description="Features a language-switching capability to make the application accessible to a wider audience."
              />
            </div>
            <h3 className="text-4xl font-bold text-white mb-12">
              Technology Stack
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <TechCard name="Next.js" icon={<Code />} />
              <TechCard name="React" icon={<Bot />} />
              <TechCard name="Tailwind CSS" icon={<Wind />} />
              <TechCard name="TypeScript" icon={<Code />} />
              <TechCard name="Generative AI" icon={<Cpu />} />
              <TechCard name="Vercel" icon={<Database />} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        title="Connect With Us"
      >
        <form action="https://api.web3forms.com/submit" method="POST">
          <input
            type="hidden"
            name="access_key"
            value={process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY}
          />
          <div className="flex flex-col gap-6 text-lg">
            {/* Each input field is wrapped in a div for the gradient border effect */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="relative w-full bg-gray-900 p-3 rounded-lg border border-white/20 
                   text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="relative w-full bg-gray-900 p-3 rounded-lg border border-white/20 
                   text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <textarea
                name="message"
                placeholder="Your Message"
                required
                rows={4}
                className="relative w-full bg-gray-900 p-3 rounded-lg border border-white/20 
                   text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-full text-lg 
                 transition-all duration-300 ease-in-out
                 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/40"
            >
              Send Message
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
