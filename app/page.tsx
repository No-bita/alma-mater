import { Button } from "../components/Button.tsx";

/** Placeholder until phase 2 (hero) and phase 3 (sections). */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6">
      <p className="font-display text-5xl font-bold uppercase">Alma Mater</p>
      <p className="font-mono text-sm text-label">[PLACEHOLDER: landing page, built in phases 2 to 5]</p>
      <Button href="/preview" variant="secondary">
        Component preview
      </Button>
    </main>
  );
}
