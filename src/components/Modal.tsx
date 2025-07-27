// src/components/Modal.tsx

import { X } from 'lucide-react';
import React from 'react';

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
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center"
      onClick={onClose}
    >
      {/* Modal Panel */}
      <div
        className="bg-gray-900 border border-white/20 rounded-lg shadow-2xl w-full max-w-lg m-4 p-6 relative"
        onClick={(e) => e.stopPropagation()}
        // THIS INLINE STYLE WILL FORCE THE MODAL TO BE VISIBLE
        style={{ opacity: 1 }}
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
    </div>
  );
}
