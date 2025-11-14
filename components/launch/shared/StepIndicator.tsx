"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-px bg-teal-elevated -z-10">
          <div
            className="h-full bg-[#75FCE8] transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          const isHovered = hoveredStep === stepNumber;

          // Calculate filter value for glow effect
          const getFilter = () => {
            if (!isCompleted && !isCurrent) return undefined;
            if (isHovered) {
              return 'drop-shadow(0 0 20px rgba(152, 252, 228, 0.9))';
            }
            if (isCurrent) {
              return 'drop-shadow(0 0 16px rgba(152, 252, 228, 0.7))';
            }
            if (isCompleted) {
              return 'drop-shadow(0 0 12px rgba(152, 252, 228, 0.5))';
            }
            return undefined;
          };

          return (
            <div
              key={step.number}
              className="flex flex-col items-center gap-2 flex-1"
            >
              {/* Step Circle */}
              <div
                onMouseEnter={() => setHoveredStep(stepNumber)}
                onMouseLeave={() => setHoveredStep(null)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300",
                  isCompleted && "bg-brand text-black",
                  isCurrent && "bg-brand text-black",
                  isUpcoming && "bg-teal-elevated text-slate-400 border-2 border-teal",
                  isHovered && "-translate-y-1"
                )}
                style={{
                  filter: getFilter(),
                }}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              {/* Step Label */}
              <div className="text-center hidden md:block">
                <div
                  className={cn(
                    "font-medium text-sm transition-colors",
                    (isCompleted || isCurrent) && "text-white",
                    isUpcoming && "text-slate-500"
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: Current Step Label */}
      <div className="mt-4 text-center md:hidden">
        <div className="text-white font-medium">
          {steps[currentStep - 1]?.title}
        </div>
        <div className="text-slate-400 text-sm">
          {steps[currentStep - 1]?.description}
        </div>
      </div>
    </div>
  );
}
