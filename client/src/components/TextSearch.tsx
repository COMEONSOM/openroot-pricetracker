import { useState } from "react";

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
  loading
}: Props) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    if (!value.trim()) return;

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
    <div
      style={{
        display: "flex",
        gap: "0.8rem",
        alignItems: "center",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "0.8rem",
        width: "100%",
        maxWidth: 640
      }}
    >
      {/* INPUT */}
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search product name or paste product link…"
        disabled={loading}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--text)"
        }}
      />

      {/* IMAGE SEARCH */}
      <label style={{ cursor: "pointer" }}>
        📷
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
      </label>

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "var(--radius-md)",
          background: "var(--accent)",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "…" : "Search"}
      </button>
    </div>
  );
}
