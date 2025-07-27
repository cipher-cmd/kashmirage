// src/components/Header.tsx

import { Globe, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onConnectClick: () => void;
  onLanguageSelect: (language: string) => void;
}

export default function Header({
  onConnectClick,
  onLanguageSelect,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="container mx-auto flex justify-between items-center p-6 text-white">
          {/* Logo */}
          <a href="#" className="text-4xl font-bold tracking-wider">
            KashMir<span className="text-orange-500">age</span>
          </a>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            <a
              href="#"
              className="text-xl font-bold text-orange-400 hover:text-orange-300 transition-all duration-300"
            >
              Scan
            </a>
            <a
              href="#locations"
              className="text-xl text-gray-300 hover:text-white border-b-2 border-transparent hover:border-orange-500 transition-all duration-300 pb-1"
            >
              Locations
            </a>
            <a
              href="#features"
              className="text-xl text-gray-300 hover:text-white border-b-2 border-transparent hover:border-orange-500 transition-all duration-300 pb-1"
            >
              Features
            </a>
          </nav>

          {/* Right-side Actions */}
          <div className="flex items-center gap-6">
            <a
              href="#footer"
              className="hidden sm:block text-lg text-gray-300 hover:text-white transition-colors duration-300"
            >
              Credentials
            </a>
            <button
              onClick={onConnectClick}
              // Added 'relative' and 'z-10' to ensure the button is clickable
              className="relative z-10 px-6 py-3 bg-orange-600 text-white font-bold rounded-full text-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
            >
              Connect
            </button>
            {/* Language Dropdown */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                <Globe size={28} />
                <ChevronDown
                  size={20}
                  className="ml-1 group-hover:rotate-180 transition-transform duration-300"
                />
              </button>
              <div className="absolute top-full right-0 mt-4 w-48 bg-black/70 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
                <button
                  onClick={() => onLanguageSelect('en')}
                  className="w-full text-left block px-4 py-3 hover:bg-white/10"
                >
                  English
                </button>
                <button
                  onClick={() => onLanguageSelect('hi')}
                  className="w-full text-left block px-4 py-3 hover:bg-white/10"
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  onClick={() => onLanguageSelect('ks')}
                  className="w-full text-left block px-4 py-3 hover:bg-white/10"
                >
                  कॉशुर (Kashmiri)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
