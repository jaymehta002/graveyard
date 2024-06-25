// components/Modal.tsx
import React, { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-gray-800 opacity-50"
        onClick={onClose}
      ></div>
      <div className=" rounded-lg p-6 z-10">{children}</div>
    </div>
  );
};

export default Modal;
