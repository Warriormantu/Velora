import { useState, useRef, useEffect } from "react";
import { HiOutlineMapPin } from "react-icons/hi2";

/**
 * Location Modal popover.
 */
const LocationModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-0 md:left-24 z-50 animate-fade-in" ref={modalRef}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-100 p-5 w-[360px] relative">
        {/* Triangle pointer */}
        <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45"></div>

        <div className="relative z-10">
          <p className="text-xs text-midnight-lighter mb-4">Welcome to VELORA</p>
          
          <div className="flex items-start gap-3 mb-5">
            <HiOutlineMapPin className="w-6 h-6 text-midnight mt-1 flex-shrink-0" />
            <p className="text-sm text-midnight">
              Please provide your delivery location to see products at nearby store
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex-1 bg-midnight text-gold text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-midnight-light transition-colors">
              Detect my location
            </button>
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-gray-200"></div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">OR</span>
              <div className="w-4 h-px bg-gray-200"></div>
            </div>
            <input 
              type="text" 
              placeholder="search delivery location" 
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder:text-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
