"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import WelcomeStep from "@/components/WelcomeStep";
import StyleStep from "@/components/StyleStep";
import ProjectBuilder from "@/components/ProjectBuilder";
import type { TemplateId } from "@/lib/samples";

const ProfileForm = dynamic(() => import("@/components/ProfileForm"), { ssr: false });

type Step = "welcome" | "style" | "build" | "profile";
type Dir  = "forward" | "backward" | "up";

const STEP_DEPTH: Record<Step, number> = {
  welcome: 0, style: 1, build: 2, profile: 1,
};

export default function Home() {
  const [step, setStep]             = useState<Step>("welcome");
  const [dir, setDir]               = useState<Dir>("forward");
  const [templateId, setTemplateId] = useState<TemplateId | undefined>();

  const navigate = useCallback((next: Step) => {
    setDir(STEP_DEPTH[next] >= STEP_DEPTH[step] ? "forward" : "backward");
    setStep(next);
  }, [step]);

  const handleTemplateSelect = useCallback((tid: TemplateId) => {
    setTemplateId(tid);
    setDir("up");
    setStep("build");
  }, []);

  const handleReset = useCallback(() => {
    setDir("backward");
    setStep("welcome");
    setTemplateId(undefined);
  }, []);

  const enterClass = dir === "up" ? "page-enter-up"
    : dir === "forward"  ? "page-enter-forward"
    : "page-enter-backward";

  return (
    <div className="min-h-screen">
      <Header onLogoClick={handleReset} />

      {step === "welcome" && (
        <main key="welcome" className={enterClass}>
          <WelcomeStep
            onSelectProject={() => navigate("style")}
            onSelectProfile={() => navigate("profile")}
          />
        </main>
      )}

      {step === "style" && (
        <main key="style" className={enterClass}>
          <StyleStep
            onSelect={handleTemplateSelect}
            onBack={() => navigate("welcome")}
          />
          <footer className="text-center py-8 mt-6">
            <p className="text-[11px] text-zinc-700">
              ReadMeCraft — Built for developers who ship.
            </p>
          </footer>
        </main>
      )}

      {step === "build" && templateId && (
        <div key="build" className={enterClass}>
          <ProjectBuilder
            templateId={templateId}
            onBack={() => navigate("style")}
          />
        </div>
      )}

      {step === "profile" && (
        <main key="profile" className={enterClass}>
          <ProfileForm onBack={handleReset} />
        </main>
      )}
    </div>
  );
}
