import React from "react";
import "../../styles/ui.css"; // Import CSS

const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className }) => {
  return <div className={`p-2 ${className}`}>{children}</div>;
};

export { Card, CardContent };
