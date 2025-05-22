import React from 'react';

interface ButtonProps {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ disabled, onClick, children }) => {
  return (
    <button
      className={`${
        disabled ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-700 cursor-pointer'
      } text-white font-bold py-2 px-4 rounded-lg flex items-center`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
