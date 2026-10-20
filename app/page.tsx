import { Hero } from "../components/Hero.tsx";
import { Nav } from "../components/Nav.tsx";
import {
  BuildTogether,
  ExamCentres,
  Footer,
  ForAlumni,
  GapNote,
  HowItWorks,
  TaskWall,
  WaitlistPlaceholder,
} from "../components/Sections.tsx";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <GapNote />
        <TaskWall />
        <HowItWorks />
        <ForAlumni />
        <BuildTogether />
        <ExamCentres />
        <WaitlistPlaceholder />
      </main>
      <Footer />
    </>
  );
}
