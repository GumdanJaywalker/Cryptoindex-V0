'use client';

import { Toaster } from 'react-hot-toast';

/**
 * Toast Provider Component
 * 
 * This component provides toast notifications throughout the application
 * using react-hot-toast library.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Global toast options
        duration: 4000,
        style: {
          background: '#1f2937', // gray-800
          color: '#f9fafb', // gray-50
          border: '1px solid #374151', // gray-700
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          padding: '12px 16px',
        },
        // Success toast styling
        success: {
          iconTheme: {
            primary: '#4ade80', // green-400
            secondary: '#f9fafb', // gray-50
          },
          style: {
            border: '1px solid #4ade80',
          },
        },
        // Error toast styling
        error: {
          iconTheme: {
            primary: '#dd7789', // red-600
            secondary: '#f9fafb', // gray-50
          },
          style: {
            border: '1px solid #dd7789',
          },
        },
        // Loading toast styling
        loading: {
          iconTheme: {
            primary: '#3b82f6', // blue-500
            secondary: '#f9fafb', // gray-50
          },
          style: {
            border: '1px solid #3b82f6',
          },
        },
      }}
    />
  );
}