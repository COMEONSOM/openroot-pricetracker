import { Routes, Route } from "react-router-dom";
import Home from "./components/otherfiles/Home";


export default function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
