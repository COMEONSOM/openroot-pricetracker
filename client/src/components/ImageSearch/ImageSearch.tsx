export default function ImageSearch({
  onSearch
}: {
  onSearch: (file: File) => void;
}) {
  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          onSearch(e.target.files[0]);
        }
      }}
    />
  );
}
