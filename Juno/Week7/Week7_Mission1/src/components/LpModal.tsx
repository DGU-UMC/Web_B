import { useState } from "react";

interface LpModalProps {
  isOpen: boolean;
  onClose: () => void;
  toggle: () => void;
}

const LpModal = ({ isOpen, onClose, toggle }: LpModalProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-30 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed inset-x-1/4 inset-y-1/6 rounded-2xl flex flex-col items-center space-y-4 box-border px-4 py-2 bg-gray-50 shadow-2xl z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full flex justify-end">
          <button
            className="cursor-pointer font-normal text-2xl text-gray-950"
            onClick={toggle}
          >
            x
          </button>
        </div>

        <label
          htmlFor="upload-lp-image"
          className="w-40 h-40 rounded-full bg-gray-500"
        ></label>
        <input type="file" className="hidden" id="upload-lp-image" />
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Lp Name"
          className="pl-4 py-2 w-full border border-gray-950 rounded-xl"
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Lp Content"
          className="pl-4 py-2 w-full border border-gray-950 rounded-xl"
        />
        <button
          disabled={name.length === 0 || content.length === 0}
          className="cursor-pointer py-2 w-full bg-gray-950 text-gray-50 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Lp
        </button>
      </div>
    </>
  );
};

export default LpModal;
