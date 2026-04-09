import React from "react";
import { motion } from "framer-motion";

interface MealBoxProgressProps {
  currentStep: number;
  steps: string[];
}

const MealBoxProgress = ({ currentStep, steps }: MealBoxProgressProps) => {
  return (
    <div className="max-w-4xl mx-auto w-full mb-12">
      <div className="flex justify-between items-center relative gap-2">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep - 1;
          const isActive = idx === currentStep - 1;
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-start gap-3">
              <div className="w-full relative h-1.5 rounded-full bg-[#EEF8F1] overflow-hidden">
                {(isCompleted || isActive) && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? "100%" : "50%" }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="absolute inset-0 bg-[#2D6A4F] rounded-full"
                  />
                )}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                isActive ? "text-[#1B2D24]" : isCompleted ? "text-[#2D6A4F]" : "text-[#7A9A88]"
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealBoxProgress;
