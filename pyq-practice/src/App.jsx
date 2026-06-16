import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import TopBar from "./components/TopBar.jsx";
import Hero from "./components/Hero.jsx";
import Studio from "./components/Studio.jsx";
import Footer from "./components/Footer.jsx";
import { useProgress } from "./hooks/useProgress.js";

export default function App() {
  const [view, setView] = useState("home"); // "home" | "studio"
  const [selection, setSelection] = useState({
    exam: "jee-main",
    subject: "physics",
    chapter: null,
    topic: null,
  });
  const progress = useProgress();

  const enterStudio = useCallback((next) => {
    if (next) setSelection((s) => ({ ...s, ...next }));
    setView("studio");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const goHome = useCallback(() => {
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const content = useMemo(() => {
    if (view === "studio") {
      return (
        <Studio
          key="studio"
          selection={selection}
          setSelection={setSelection}
          progress={progress}
        />
      );
    }
    return <Hero key="home" onStart={enterStudio} progress={progress} />;
  }, [view, selection, progress, enterStudio]);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <TopBar
        view={view}
        onHome={goHome}
        onStudio={() => enterStudio()}
        stats={progress.stats}
      />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </main>
      {view === "home" && <Footer />}
    </div>
  );
}
