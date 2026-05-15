import React from 'react';

const LoadingSpinner = ({ size = "md", color = "primary" }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4"
  };

  const colors = {
    primary: "border-primary/20 border-t-primary",
    white: "border-white/20 border-t-white",
    slate: "border-slate-200 border-t-slate-600"
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
