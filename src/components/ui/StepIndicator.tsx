import React from "react";
import { clsx } from "clsx";
import type { BuildStep } from "../../types";

const STEPS: { key: BuildStep; label: string; short: string }[] = [
  { key: "configure", label: "Configure", short: "1" },
  { key: "operations", label: "Operations", short: "2" },
  { key: "preview", label: "Preview XDR", short: "3" },
  { key: "sign", label: "Sign", short: "4" },
  { key: "submit", label: "Submit", short: "5" },
];

interface StepIndicatorProps {
  currentStep: BuildStep;
  onStepClick?: (step: BuildStep) => void;
  completedSteps: BuildStep[];
}

export function StepIndicator({ currentStep, onStepClick, completedSteps }: StepIndicatorProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-0 w-full mb-8" role="navigation" aria-label="Build steps">
      {STEPS.map((step, idx) => {
        const isCompleted = completedSteps.includes(step.key);
        const isCurrent = step.key === currentStep;
        const isClickable = isCompleted || idx <= currentIdx;

        return (
          <React.Fragment key={step.key}>
            <button
              onClick={() => isClickable && onStepClick?.(step.key)}
              disabled={!isClickable}
              aria-current={isCurrent ? "step" : undefined}
              className={clsx(
                "flex flex-col items-center gap-1.5 min-w-0 flex-1 group transition-all duration-200",
                isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-40"
              )}
            >
              <div
                className={clsx(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-mono transition-all duration-300",
                  isCurrent && [
                    "bg-stellar-500 text-white shadow-lg",
                    "shadow-stellar-500/40 ring-2 ring-stellar-400/30",
                    "animate-pulse-glow",
                  ],
                  isCompleted && !isCurrent && "bg-stellar-700 text-stellar-200",
                  !isCompleted && !isCurrent && "bg-void-200 text-slate-500 border border-slate-700"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.short
                )}
              </div>
              <span
                className={clsx(
                  "text-xs font-medium tracking-wide hidden sm:block truncate max-w-full",
                  isCurrent && "text-stellar-400",
                  isCompleted && !isCurrent && "text-stellar-600",
                  !isCompleted && !isCurrent && "text-slate-600"
                )}
              >
                {step.label}
              </span>
            </button>

            {idx < STEPS.length - 1 && (
              <div
                className={clsx(
                  "h-px flex-1 mx-1 transition-all duration-500",
                  idx < currentIdx ? "bg-stellar-600" : "bg-slate-700"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
