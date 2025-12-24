interface Props {
  onImage: (file: File) => void;
}

export default function ImageSearch({ onImage }: Props) {
  return (
    <label className="cursor-pointer rounded-lg p-2 hover:bg-white/5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7h4l2-2h6l2 2h4v11H3V7z"
        />
        <circle cx="12" cy="13" r="3" />
      </svg>

      <input
        type="file"
        accept="image/*"
        hidden
        onChange={e => {
          if (e.target.files?.[0]) {
            onImage(e.target.files[0]);
          }
        }}
      />
    </label>
  );
}
