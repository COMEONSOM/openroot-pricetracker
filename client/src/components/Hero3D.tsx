// Hero3D.tsx = showroom
// hero3d/ = engine room
import HeroCanvas from "./hero3d/HeroCanvas";
import TextSearch from "./TextSearch";

interface Props {
  onSearch: (q: string) => Promise<void>;
  onLink: (url: string) => Promise<void>;
  onImage: (file: File) => void;
  loading: boolean;
}

export default function Hero3D({
  onSearch,
  onLink,
  onImage,
  loading,
}: Props) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <HeroCanvas />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <TextSearch
          onSearch={onSearch}
          onLink={onLink}
          onImage={onImage}
          loading={loading}
        />
      </div>
    </section>
  );
}
