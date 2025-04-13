import React from "react";

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border border-red-400 text-red-700 p-4 rounded-md" role="alert">
      {message}
    </div>
  );
};

export default ErrorDisplay;
