import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { Campaign } from "../../types";

interface EventDetailsStepProps {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
  onNext: () => void;
  onBack: () => void;
}

const EventDetailsStep: React.FC<EventDetailsStepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    title: data.title || "",
    description: data.description || "",
    photographer_name: data.photographer_name || "",
    photographer_website: "",
    location: data.location || "",
    event_date: data.event_date ? new Date(data.event_date) : null,
    fundraising_goal: data.goal_amount?.toString() || "",
    visibility: data.visibility || "public",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.photographer_name.trim())
      newErrors.photographer_name = "Photographer name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.event_date) newErrors.event_date = "Event date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onUpdate({
      title: formData.title,
      description: formData.description,
      photographer_name: formData.photographer_name,

      event_date: formData.event_date?.toISOString(),
      goal_amount: formData.fundraising_goal
        ? Number(formData.fundraising_goal)
        : undefined,
      visibility: formData.visibility as "public" | "private",
      location: formData.location,
    });
    onNext();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, event_date: date }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Fundraiser Title*
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          placeholder="e.g. Annual charity gala etc."
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 resize-none"
          placeholder="Describe your event, what makes it special..."
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="photographer"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Photographer*
          </label>
          <input
            id="photographer_name"
            name="photographer_name"
            type="text"
            value={formData.photographer_name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Photographer name"
          />
          {errors.photographer && (
            <p className="text-red-500 text-xs mt-1">{errors.photographer}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="photographer_website"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Photographer Website URL{" "}
            <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            id="photographer_website"
            name="photographer_website"
            type="url"
            value={formData.photographer_website}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g. www.studio.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Location*
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Event City"
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="event_date"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Event Date*
          </label>
          <div className="relative">
            <DatePicker
              selected={formData.event_date}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yy"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              autoComplete="off"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 pointer-events-none" />
          </div>
          {errors.event_date && (
            <p className="text-red-500 text-xs mt-1">{errors.event_date}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="fundraising_goal"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Fundraising Goal{" "}
          <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <input
          id="fundraising_goal"
          name="fundraising_goal"
          type="number"
          value={formData.fundraising_goal}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          placeholder="e.g. $5000"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Visibility
        </label>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={formData.visibility === "public"}
              onChange={handleInputChange}
              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Public - Anyone can find and view
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={formData.visibility === "private"}
              onChange={handleInputChange}
              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Private - Only people with link can view
            </span>
          </label>
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

export default EventDetailsStep;
