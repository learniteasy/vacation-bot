import React from "react";
import "../../styles/ui.css"; // Import CSS

const Button = ({ onClick, children, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 ${className}`}
    >
      {children}
    </button>
  );
};

export { Button };
