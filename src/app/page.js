import Image from "next/image";
import { AuthProvider } from "./context/AuthContext";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import Hero from "@/components/herosection";

export default function Home() {
  return (
    <div className="max-h-svh">
      <Hero />
    </div>
  );
}
