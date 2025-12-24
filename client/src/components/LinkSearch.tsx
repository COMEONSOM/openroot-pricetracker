import { useState } from "react";
import { useSearch } from "../hooks/useSearch";

const LinkSearch = () => {
  const [url, setUrl] = useState("");
  const { searchByLink, loading } = useSearch();

  const handleSearch = () => {
    if (!url.trim()) return;
    searchByLink(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <div className="flex gap-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-3">
        <input
          type="url"
          placeholder="Paste Amazon / Flipkart / Meesho product link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-white disabled:opacity-50"
        >
          Track
        </button>
      </div>
    </div>
  );
};

export default LinkSearch;
