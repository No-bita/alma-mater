import { Hero } from "../components/Hero.tsx";
import { Nav } from "../components/Nav.tsx";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
