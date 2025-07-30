'use client';

import { useState } from 'react';
import { Globe, ChevronDown, Menu, X } from 'lucide-react';

interface HeaderProps {
  onConnectClick: () => void;
  onLanguageSelect: (language: string) => void;
}

export default function Header({
  onConnectClick,
  onLanguageSelect,
}: HeaderProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="container mx-auto flex justify-between items-center p-6 text-white">
          {/* Logo */}
          <a href="#" className="text-4xl font-bold tracking-wider">
            Kash<span className="text-orange-500">Mirage</span>
          </a>

          {/* Desktop Navigation - now hidden until 'lg' breakpoint (1024px) */}
          <nav className="hidden lg:flex items-center gap-12">
            <a
              href="#"
              className="text-xl font-bold text-orange-400 hover:text-orange-300 transition-colors duration-300"
            >
              Scan
            </a>
            <a
              href="#locations"
              className="text-xl text-gray-300 hover:text-white transition-colors duration-300"
            >
              Locations
            </a>
            <a
              href="#features"
              className="text-xl text-gray-300 hover:text-white transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#footer"
              className="text-xl text-gray-300 hover:text-white transition-colors duration-300"
            >
              Credentials
            </a>
          </nav>

          {/* Right-side Actions (Desktop) - now hidden until 'lg' breakpoint */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={onConnectClick}
              className="px-6 py-3 bg-orange-600 text-white font-bold rounded-full text-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
            >
              Connect
            </button>
            <div className="relative group">
              <button className="text-gray-300 hover:text-white flex items-center">
                <Globe size={28} />
                <ChevronDown
                  size={20}
                  className="ml-1 transition-transform group-hover:rotate-180"
                />
              </button>
              <div className="absolute top-full right-0 mt-4 w-48 bg-black/70 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
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
                  कॉшुर (Kashmiri)
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button - now visible up to 'lg' breakpoint */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel - now visible up to 'lg' breakpoint */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black/80 backdrop-blur-xl text-white animate-fade-in">
          <div className="container mx-auto flex flex-col items-center gap-6 py-8">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-bold text-orange-400"
            >
              Scan
            </a>
            <a
              href="#locations"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl"
            >
              Locations
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl"
            >
              Features
            </a>
            <a
              href="#footer"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl"
            >
              Credentials
            </a>
            <button
              onClick={() => {
                onConnectClick();
                setMobileMenuOpen(false);
              }}
              className="mt-4 px-8 py-4 bg-orange-600 text-white font-bold rounded-full text-xl"
            >
              Connect
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
