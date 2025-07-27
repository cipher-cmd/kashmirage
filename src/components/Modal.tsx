// src/components/Modal.tsx

'use client'; // Required for useEffect and useState

import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  // This ensures the modal only renders on the client, where the DOM is available.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) {
    return null;
  }

  // createPortal renders the modal outside of the normal component hierarchy,
  // directly into the document.body. This prevents parent styles from interfering.
  return createPortal(
    // Backdrop div that closes the modal on click
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center"
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="bg-gray-900 border border-white/20 rounded-lg shadow-2xl w-full max-w-lg m-4 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-orange-500">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body // The modal will be attached here
  );
}
