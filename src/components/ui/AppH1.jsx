import React from "react";

export default function AppH1({ children, className = "" }) {
  return (
    <h1 className={`text-2xl sm:text-4xl font-bold ${className}`}>
      {children}
    </h1>
  );
}
