import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CampaignCard from "../components/CampaignCard";
import { useCampaigns } from "../hooks/useCampaigns";
import LoadingSpinner from "../components/LoadingSpinner";

const CampaignCardPlaceholder: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="w-full h-64 bg-gray-200"></div>
    <div className="p-5">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

const BrowseCampaigns: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All"
  );

  const { data: campaigns = [], isLoading } = useCampaigns({
    search: searchTerm || undefined,
    category: activeCategory === "All" ? undefined : activeCategory,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (activeCategory && activeCategory !== "All")
      params.set("category", activeCategory);
    setSearchParams(params, { replace: true });
  }, [searchTerm, activeCategory, setSearchParams]);

  const categories = [
    "All",
    "Education",
    "Health & Wellness",
    "Animal Welfare",
    "International Aid",
    "Environment",
    "Arts & Culture",
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white">
      
      <div className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Browse Photo Fundraisers
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover beautiful photography while supporting meaningful causes in
            communities around the world.
          </p>

        
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto mb-6"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Search
            </button>
          </form>

          
          <div className="flex justify-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array(6)
                  .fill(null)
                  .map((_, index) => <CampaignCardPlaceholder key={index} />)
              : campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
          </div>

          {!isLoading && campaigns.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No fundraisers found. Try adjusting your search or filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseCampaigns;
