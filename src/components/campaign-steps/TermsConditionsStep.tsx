import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Campaign } from "../../types";

interface TermsConditionsStepProps {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
  onComplete: () => void;
  onBack: () => void;
}

const TermsConditionsStep: React.FC<TermsConditionsStepProps> = ({
  data,
  onUpdate,
  onComplete, 
  onBack,
}) => {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("You must agree to the terms to continue.");
      return;
    }
    onComplete(); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-md font-semibold text-gray-800 mb-4">
          GoodPix Terms of Service
        </h3>
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            By using GoodPix, you agree to the following terms and conditions...
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              You retain ownership of all photos uploaded to the platform.
            </li>
            <li>GoodPix takes a 10% platform fee from each transaction.</li>
            <li>Payment processing fees (typically 3%) are separate.</li>
            <li>You are responsible for obtaining proper photo permissions.</li>
            <li>Fundraiser creators must comply with applicable laws.</li>
            <li>GoodPix reserves the right to remove inappropriate content.</li>
            <li>
              GoodPix may remove photos from inactive campaigns after 90 days of
              dormant activity.
            </li>
          </ol>
          <p className="pt-2">
            Full terms and conditions are available at goodpix.org/terms
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="agree-terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 text-orange-600 border-gray-300 rounded-full focus:ring-orange-500"
        />
        <label
          htmlFor="agree-terms"
          className="ml-2 block text-sm text-gray-700 cursor-pointer"
        >
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>

      <div className="flex justify-between items-center pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors text-sm"
        >
          « Back
        </button>
        <button
          type="submit"
          className="px-8 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors text-sm"
        >
          Create Fundraiser »
        </button>
      </div>
    </form>
  );
};

export default TermsConditionsStep;
