import React from 'react';

const LoadingState = ({ message, isRetrying, retryCount }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <div className="text-center">
        <p className="text-gray-700 font-medium">{message}</p>
        {isRetrying && (
          <p className="text-sm text-gray-500 mt-2">
            正在重试... ({retryCount}/3)
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingState; 