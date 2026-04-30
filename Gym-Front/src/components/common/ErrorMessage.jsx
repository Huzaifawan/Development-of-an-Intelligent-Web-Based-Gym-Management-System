import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AiOutlineCloseCircle className="text-red-500 text-xl" />
        <p className="text-red-400">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-300 transition"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
