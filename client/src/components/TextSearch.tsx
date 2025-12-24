import { useRef } from "react";
import ImageSearch from "./ImageSearch";

interface Props {
  onSearch: (query: string) => void;
  onImage: (file: File) => void;
  loading: boolean;
}

export default function TextSearch({ onSearch, onImage, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full max-w-3xl">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-700 bg-surface px-4 py-3 shadow-xl">
        <input
          ref={inputRef}
          placeholder="Search product name, paste link, or use image"
          className="flex-1 bg-transparent outline-none text-sm"
        />

        {/* Lens Icon */}
        <ImageSearch onImage={onImage} />

        <button
          disabled={loading}
          onClick={() => onSearch(inputRef.current?.value || "")}
          className="rounded-xl bg-accent px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
    </div>
  );
}
