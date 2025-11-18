import { useState } from "react";
import TagCard from "./TagCard";
import type { Tag } from "../types/lp";
import usePostLp from "../hooks/mutations/usePostLp";

interface LpModalProps {
  isOpen: boolean;
  onClose: () => void;
  toggle: () => void;
}

const LpModal = ({ isOpen, onClose, toggle }: LpModalProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [thumnailFile, setThumnailFile] = useState<File | null>(null);
  const [tagName, setTagName] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);

  const { mutate } = usePostLp();

  const handlePostLp = () => {
    mutate({
      title: name,
      content: content,
      thumbnail: thumnailFile?.name, // 파일 경로를 파일 이름으로 대체
      tags: tags.map((tag) => tag.name),
      published: true,
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumnailFile(file);
  };

  const deleteTag = (idToDelete: number) => {
    setTags((prev) => prev.filter((tag) => tag.id !== idToDelete));
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-30 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed inset-x-1/4 inset-y-24 rounded-2xl flex flex-col items-center space-y-4 box-border px-4 py-2 bg-gray-50 shadow-2xl z-40 ${
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
        <input
          type="file"
          className="hidden"
          id="upload-lp-image"
          onChange={handleFileChange}
          accept="image/*"
        />
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Lp Name"
          className="pl-4 py-2 w-full border border-gray-950 rounded-lg"
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Lp Content"
          className="pl-4 py-2 w-full border border-gray-950 rounded-lg"
        />
        <div className="flex w-full space-x-2">
          <input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Lp Tag"
            className="pl-4 py-2 w-full border border-gray-950 rounded-lg"
          />
          <button
            disabled={tagName.length === 0}
            className="cursor-pointer py-2 px-4 bg-gray-950 text-gray-50 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => {
              setTags((prev) => [...prev, { name: tagName, id: Date.now() }]);
              setTagName("");
            }}
          >
            Add
          </button>
        </div>
        <div className="flex w-full space-x-2 overflow-x-scroll">
          {tags.map((tag) => (
            <TagCard
              name={tag.name}
              id={tag.id}
              onDelete={deleteTag}
              key={tag.id}
            />
          ))}
        </div>
        <button
          disabled={name.length === 0 || content.length === 0}
          className="cursor-pointer py-2 w-full bg-gray-950 text-gray-50 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handlePostLp}
        >
          Add Lp
        </button>
      </div>
    </>
  );
};

export default LpModal;
