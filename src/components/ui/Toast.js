import React from 'react';
import { X } from 'lucide-react';

const variantStyles = {
  default: "bg-white border-gray-200",
  destructive: "bg-red-50 border-red-200 text-red-900",
  success: "bg-green-50 border-green-200 text-green-900",
};

export function Toast({ toast, onClose }) {
  const { title, description, variant = "default" } = toast;
  const variantStyle = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className={`${variantStyle} border rounded-lg shadow-lg p-4 mb-2 min-w-[300px] max-w-md relative`}
      role="alert"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
      {title && (
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
      )}
      {description && (
        <p className="text-sm">{description}</p>
      )}
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
} 