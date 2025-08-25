import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Campaign } from "../../types";

interface YourCauseStepProps {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
  onNext: () => void;
  onBack: () => void;
}

const YourCauseStep: React.FC<YourCauseStepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    cause_type: data.cause_type || "",
    charity_name: data.charity_name || "",
    charity_percentage: data.charity_fee || 70,
    personal_percentage: 0,
    photographer_percentage: data.photographer_fee || 30,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "Animal Welfare",
    "Education",
    "Health & Medical",
    "Environment",
    "Community Development",
    "Arts & Culture",
    "Sports & Recreation",
    "Emergency Relief",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.cause_type)
      newErrors.cause_type = "Please select a cause type";
    if (!formData.charity_name.trim())
      newErrors.charity_name = "Charity/organization name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onUpdate({
      cause_type: formData.cause_type,
      charity_name: formData.charity_name.trim(),
      charity_fee: formData.charity_percentage,
      photographer_fee: formData.photographer_percentage,
    });
    onNext();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePercentageChange = (
    field: "charity_percentage" | "photographer_percentage",
    value: number
  ) => {
    const cleanValue = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));

    let charity = formData.charity_percentage;
    let photographer = formData.photographer_percentage;

    if (field === "charity_percentage") {
      charity = cleanValue;
      photographer = 100 - charity;
    } else if (field === "photographer_percentage") {
      photographer = cleanValue;
      charity = 100 - photographer;
    }

    setFormData((prev) => ({
      ...prev,
      charity_percentage: charity,
      photographer_percentage: photographer,
      personal_percentage: 0,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label
          htmlFor="cause_type"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Primary Cause Type
        </label>
        <div className="relative">
          <select
            id="cause_type"
            name="cause_type"
            value={formData.cause_type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none"
          >
            <option value="" disabled>
              Select a cause type
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {errors.cause_type && (
          <p className="text-red-500 text-xs mt-1">{errors.cause_type}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="charity_name"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Charity/Organization Name
        </label>
        <input
          id="charity_name"
          name="charity_name"
          type="text"
          value={formData.charity_name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          placeholder="e.g. Local Children Hospital"
        />
        {errors.charity_name && (
          <p className="text-red-500 text-xs mt-1">{errors.charity_name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Payment Split Configuration
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="charity_percentage"
              className="block text-sm text-gray-600 mb-1"
            >
              Charity (%)
            </label>
            <input
              id="charity_percentage"
              name="charity_percentage"
              type="number"
              value={formData.charity_percentage}
              onChange={(e) =>
                handlePercentageChange(
                  "charity_percentage",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label
              htmlFor="personal_cause"
              className="block text-sm text-gray-600 mb-1"
            >
              Personal Cause (%)
            </label>
            <input
              id="personal_cause"
              name="personal_cause"
              type="number"
              value={formData.personal_percentage}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="photographer_percentage"
              className="block text-sm text-gray-600 mb-1"
            >
              Photographer Fee (%)
            </label>
            <input
              id="photographer_percentage"
              name="photographer_percentage"
              type="number"
              value={formData.photographer_percentage}
              onChange={(e) =>
                handlePercentageChange(
                  "photographer_percentage",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
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
          Next »
        </button>
      </div>
    </form>
  );
};

export default YourCauseStep;
