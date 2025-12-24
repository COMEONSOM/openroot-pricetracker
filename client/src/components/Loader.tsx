import Lottie from "lottie-react";
import loaderAnimation from "../assets/loader.json";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-40 h-40">
        <Lottie
          animationData={loaderAnimation}
          loop
          autoplay
        />
      </div>
    </div>
  );
}
