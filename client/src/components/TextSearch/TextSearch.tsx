import { useReducer, useCallback, useRef, useEffect, useMemo } from "react";
import { Search, Camera, X, Loader2, Link2, AlertCircle } from "lucide-react";
import "./TextSearch.css";

interface Props {
  onSearch: (query: string) => Promise<void>;
  onLink: (url: string) => Promise<void>;
  onImage: (file: File) => void;
  loading: boolean;
}

// State types with discriminated unions for better type safety
type InputType = "text" | "link" | null;
type ValidationState = "idle" | "valid" | "invalid";

interface State {
  value: string;
  focused: boolean;
  inputType: InputType;
  shake: boolean;
  urlValidation: ValidationState;
}

type Action =
  | { type: "SET_VALUE"; payload: string }
  | { type: "SET_FOCUSED"; payload: boolean }
  | { type: "SET_SHAKE"; payload: boolean }
  | { type: "SET_URL_VALIDATION"; payload: ValidationState }
  | { type: "CLEAR" };

const initialState: State = {
  value: "",
  focused: false,
  inputType: null,
  shake: false,
  urlValidation: "idle",
};

// URL validation with better pattern matching
const validateUrl = (str: string): boolean => {
  try {
    const url = new URL(str);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

// Determine input type from value
const getInputType = (value: string): InputType => {
  if (!value.trim()) return null;
  if (/^https?:\/\//i.test(value)) return "link";
  return "text";
};

// Reducer for centralized state management
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_VALUE": {
      const inputType = getInputType(action.payload);
      return {
        ...state,
        value: action.payload,
        inputType,
        urlValidation: inputType === "link" ? "idle" : "idle",
      };
    }
    case "SET_FOCUSED":
      return { ...state, focused: action.payload };
    case "SET_SHAKE":
      return { ...state, shake: action.payload };
    case "SET_URL_VALIDATION":
      return { ...state, urlValidation: action.payload };
    case "CLEAR":
      return { ...initialState, focused: state.focused };
    default:
      return state;
  }
}

// Custom hook for debounced URL validation
function useDebouncedValidation(
  value: string,
  inputType: InputType,
  delay: number = 300
) {
  const [isValid, setIsValid] = useReducer(
    (_: ValidationState, action: ValidationState) => action,
    "idle"
  );

  useEffect(() => {
    if (inputType !== "link" || !value.trim()) {
      setIsValid("idle");
      return;
    }

    const timer = setTimeout(() => {
      setIsValid(validateUrl(value) ? "valid" : "invalid");
    }, delay);

    return () => clearTimeout(timer);
  }, [value, inputType, delay]);

  return isValid;
}

export default function TextSearch({
  onSearch,
  onLink,
  onImage,
  loading,
}: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { value, focused, inputType, shake } = state;
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounced URL validation
  const urlValidation = useDebouncedValidation(value, inputType);

  // Memoized submission handler
  const handleSubmit = useCallback(() => {
    if (!value.trim() || loading) return;

    const trimmed = value.trim();

    if (inputType === "link") {
      if (validateUrl(trimmed)) {
        onLink(trimmed);
      } else {
        dispatch({ type: "SET_SHAKE", payload: true });
        setTimeout(() => dispatch({ type: "SET_SHAKE", payload: false }), 500);
      }
    } else {
      onSearch(trimmed);
    }
  }, [value, inputType, loading, onLink, onSearch]);

  // Handle image upload with validation
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      const maxSize = 10 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
        return;
      }
      if (file.size > maxSize) {
        alert("Image size should be less than 10MB");
        return;
      }
      onImage(file);
      e.target.value = "";
    },
    [onImage]
  );

  // Clear input handler
  const handleClear = useCallback(() => {
    dispatch({ type: "CLEAR" });
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Computed values for UI state
  const canSubmit = useMemo(() => {
    if (!value.trim() || loading) return false;
    if (inputType === "link") return urlValidation === "valid";
    return true;
  }, [value, loading, inputType, urlValidation]);

  const buttonText = useMemo(() => {
    if (loading) return null;
    return inputType === "link" ? "Fetch" : "Search";
  }, [loading, inputType]);

  const helperText = useMemo(() => {
    if (inputType !== "link") return null;
    if (urlValidation === "valid") return "Valid URL detected";
    if (urlValidation === "invalid") return "Please enter a valid URL";
    return "Checking URL...";
  }, [inputType, urlValidation]);

  return (
    <div className="ts-root">
      <form
        role="search"
        className={`ts-glow ${focused ? "ts-glow--active" : ""} ${
          shake ? "ts-shake" : ""
        }`}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="ts-surface">
          {/* Input Type Indicator */}
          <div className="ts-indicator" aria-hidden="true">
            {inputType === "link" ? (
              <Link2
                className={`ts-icon ts-icon--link ${
                  urlValidation === "invalid" ? "ts-icon--error" : ""
                }`}
              />
            ) : (
              <Search className="ts-icon" />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) =>
              dispatch({ type: "SET_VALUE", payload: e.target.value })
            }
            onFocus={() => dispatch({ type: "SET_FOCUSED", payload: true })}
            onBlur={() => dispatch({ type: "SET_FOCUSED", payload: false })}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                handleClear();
                inputRef.current?.blur();
              }
            }}
            placeholder="Search product or paste URL..."
            disabled={loading}
            className="ts-input"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search for products or paste a URL"
            aria-describedby={helperText ? "ts-helper-text" : undefined}
            aria-invalid={urlValidation === "invalid"}
          />

          {/* Clear Button */}
          {value && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="ts-clear"
              aria-label="Clear search"
            >
              <X className="ts-clear-icon" />
            </button>
          )}

          {/* Keyboard Shortcut Hint */}
          {!value && !focused && (
            <div className="ts-shortcut" aria-hidden="true">
              <kbd>⌘</kbd>
              <kbd>K</kbd>
            </div>
          )}

          {/* Divider */}
          <div className="ts-divider" aria-hidden="true" />

          {/* Image Upload */}
          <button
            type="button"
            className="ts-camera"
            title="Search using image"
            aria-label="Upload image to search"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Camera className="ts-camera-icon" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            disabled={loading}
            onChange={handleImageUpload}
            aria-hidden="true"
          />

          {/* Search Button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`ts-button ${inputType === "link" ? "ts-button--link" : ""}`}
          >
            {loading ? (
              <Loader2 className="ts-button-loader" aria-label="Loading" />
            ) : (
              buttonText
            )}
          </button>
        </div>
      </form>

      {/* Helper Text */}
      {helperText && (
        <div className="ts-helper" id="ts-helper-text" aria-live="polite">
          <span
            className={`ts-helper-text ${
              urlValidation === "invalid"
                ? "ts-helper-text--error"
                : urlValidation === "valid"
                  ? "ts-helper-text--success"
                  : ""
            }`}
          >
            {urlValidation === "invalid" && (
              <AlertCircle className="ts-helper-icon" />
            )}
            {helperText}
          </span>
        </div>
      )}
    </div>
  );
}
