import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="animate-fadeIn relative w-full rounded-lg bg-white p-4 shadow-xl max-w-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default React.memo(Modal);
