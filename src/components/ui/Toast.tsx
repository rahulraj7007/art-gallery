// NEW FILE: src/components/ui/Toast.tsx

'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X, ShoppingBag, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
  show: boolean;
}

export default function Toast({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose, 
  show 
}: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right duration-300">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm ${getToastStyles()}`}>
        {getIcon()}
        <span className="font-serif text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}