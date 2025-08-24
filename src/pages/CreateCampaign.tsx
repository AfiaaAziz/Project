import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import ProgressSteps from "../components/ProgressSteps";
import EventDetailsStep from "../components/campaign-steps/EventDetailsStep";
import YourCauseStep from "../components/campaign-steps/YourCauseStep";
import UploadPhotosStep from "../components/campaign-steps/UploadPhotosStep";
import SetPricingStep from "../components/campaign-steps/SetPricingStep";
import TermsConditionsStep from "../components/campaign-steps/TermsConditionsStep";
import ShareStep from "../components/campaign-steps/ShareStep";

import { Campaign } from "../types";
import { useCreateCampaign } from "../hooks/useCampaigns";
import { useAuth } from "../contexts/AuthContext";

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  
  const {
    mutate: createCampaign,
    isSuccess,
    data: createdCampaign,
    error,
  } = useCreateCampaign();

  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<Partial<Campaign>>({
    photo_price: 10,
    platform_fee: 7,
    photographer_fee: 0,
    charity_fee: 70,
    visibility: "public",
    status: "draft",
  });

  const steps = [
    "Event Details",
    "Your Cause",
    "Upload Photos",
    "Set pricing",
    "Terms & Conditions",
    "Share",
  ];


  useEffect(() => {
    if (isSuccess && createdCampaign) {
      toast.success("Campaign created successfully!");
      handleNext();
    }
    if (error) {
      toast.error(
        "Failed to create campaign. Please check the details and try again."
      );
    }
  }, [isSuccess, createdCampaign, error]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleUpdateCampaign = (updates: Partial<Campaign>) => {
    setCampaignData((prevData) => ({ ...prevData, ...updates }));
  };

  
  const handleCreateCampaign = () => {
    if (!user?.id) {
      toast.error("You must be logged in to create a campaign.");
      return;
    }
    const finalCampaignData = {
      ...campaignData,
      organizer_id: user.id,
      status: "active" as const,
    };
    createCampaign(finalCampaignData as Campaign);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EventDetailsStep
            data={campaignData}
            onUpdate={handleUpdateCampaign}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <YourCauseStep
            data={campaignData}
            onUpdate={handleUpdateCampaign}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <UploadPhotosStep
            data={campaignData}
            onUpdate={handleUpdateCampaign}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <SetPricingStep
            data={campaignData}
            onUpdate={handleUpdateCampaign}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <TermsConditionsStep
            data={campaignData}
            onUpdate={handleUpdateCampaign}
            onComplete={handleCreateCampaign}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <ShareStep
            data={createdCampaign || campaignData}
            onComplete={() => navigate("/")}
            onBack={handleBack}
          />
        );
      default:
        return <div>Step not found.</div>;
    }
  };

  const currentTitle = steps[currentStep - 1] || "Create Campaign";

  return (
    <div className="min-h-screen">
      <div className="bg-white pt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-light text-center text-gray-800 mb-8">
            {currentTitle}
          </h1>
          <div className="mb-10">
            <ProgressSteps currentStep={currentStep} steps={steps} />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
