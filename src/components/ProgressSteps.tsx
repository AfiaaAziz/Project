import React from "react";

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  steps,
}) => {
  const stepLabels = [
    "Event Details",
    "Your Cause",
    "Upload Photos",
    "Set pricing",
    "Terms & Conditions",
    "Share",
  ];

  return (
    <div className="flex justify-center mb-12">
      <div className="flex items-center space-x-2">
        {stepLabels.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex items-center">
          
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${ // <-- ADDED WHITESPACE-NOWRAP
                  index + 1 === currentStep
                    ? "bg-orange-500 text-white"
                    : index + 1 < currentStep
                      ? "border border-orange-200 text-orange-600 bg-orange-50"
                      : "border border-gray-200 text-gray-500 bg-white"
                  }`}
              >
                {index + 1}. {step}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
