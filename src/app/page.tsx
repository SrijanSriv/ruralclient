import { Facilities } from "./components/Facilities";
import { Navbar } from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex h-[calc(100vh-64px)] justify-center items-center">
        <Facilities />
      </main>
    </>
  );
}
