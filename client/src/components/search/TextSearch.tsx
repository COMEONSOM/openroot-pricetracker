import { useState } from "react";
import { Search, Camera } from "lucide-react";
import "../../styles/TextSearch.css";

interface Props {
  onSearch: (query: string) => Promise<void>;
  onLink: (url: string) => Promise<void>;
  onImage: (file: File) => void;
  loading: boolean;
}

export default function TextSearch({
  onSearch,
  onLink,
  onImage,
  loading,
}: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  function handleSubmit() {
    if (!value.trim() || loading) return;

    // Simple heuristic: link vs text
    if (value.startsWith("http")) {
      onLink(value.trim());
    } else {
      onSearch(value.trim());
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onImage(file);
  }

  return (
    <div className="ts-root">
      <div
        className={`ts-glow ${focused ? "ts-glow--active" : ""}`}
      >
        <div className="ts-surface">

          {/* Search Icon */}
          <Search className="ts-icon" />

          {/* Input */}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Search product name or paste product link..."
            disabled={loading}
            className="ts-input"
          />

          {/* Image Upload */}
          <label className="ts-camera" title="Search using image">
            <Camera className="ts-camera-icon" />
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={loading}
              onChange={handleImageUpload}
            />
          </label>

          {/* Search Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="ts-button"
          >
            {loading ? "…" : "Search"}
          </button>

        </div>
      </div>
    </div>
  );
}
