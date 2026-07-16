import { useState, useCallback, useRef } from "react";
import { Upload, Image, X, Loader2, Camera } from "lucide-react";
import "./ImageSearch.css";

interface Props {
  onSearch: (file: File, query?: string) => Promise<void>;
  loading: boolean;
}

type DragState = "idle" | "over" | "invalid";

export default function ImageSearch({ onSearch, loading }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragState, setDragState] = useState<DragState>("idle");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const VALID_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = useCallback((file: File): string | null => {
    if (!VALID_TYPES.includes(file.type)) {
      return "Please upload a valid image (JPEG, PNG, WebP, or GIF)";
    }
    if (file.size > MAX_SIZE) {
      return "Image size should be less than 10MB";
    }
    return null;
  }, []);

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [validateFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragState("idle");

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    if (items.length > 0 && items[0].type.startsWith("image/")) {
      setDragState("over");
    } else {
      setDragState("invalid");
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragState("idle");
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleSearch = useCallback(async () => {
    if (!selectedFile || loading) return;
    await onSearch(selectedFile);
  }, [selectedFile, loading, onSearch]);

  const handleClear = useCallback(() => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <div className="image-search">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileInput}
        hidden
        disabled={loading}
      />

      {!preview ? (
        /* Drop Zone */
        <div
          className={`image-search__dropzone ${
            dragState === "over" ? "image-search__dropzone--active" : ""
          } ${dragState === "invalid" ? "image-search__dropzone--invalid" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload image to search"
        >
          <div className="image-search__dropzone-content">
            <div className="image-search__icon-wrapper">
              <Upload className="image-search__icon" />
            </div>
            <p className="image-search__title">
              Drop an image here
            </p>
            <p className="image-search__subtitle">
              or click to browse
            </p>
            <p className="image-search__hint">
              JPEG, PNG, WebP, GIF up to 10MB
            </p>
          </div>
        </div>
      ) : (
        /* Preview */
        <div className="image-search__preview">
          <div className="image-search__preview-image-wrapper">
            <img
              src={preview}
              alt="Selected product"
              className="image-search__preview-image"
            />
            <button
              type="button"
              className="image-search__preview-clear"
              onClick={handleClear}
              aria-label="Remove image"
              disabled={loading}
            >
              <X size={16} />
            </button>
          </div>

          <div className="image-search__preview-info">
            <div className="image-search__preview-name">
              <Image size={16} />
              <span>{selectedFile?.name}</span>
            </div>
            
            <button
              type="button"
              className="image-search__search-button"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="image-search__loader" />
                  Searching...
                </>
              ) : (
                <>
                  <Camera size={18} />
                  Search by Image
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="image-search__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
