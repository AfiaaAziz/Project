
import React, { useState } from "react";
import {
  DollarSign,
  Download,
  BarChart2,
  FolderKanban,
  Edit,
  Share2,
  Plus,
  MapPin,
  Calendar,
  Camera,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUserCampaigns, useUpdateCampaign } from "../hooks/useCampaigns";
import { formatCurrency, formatDate } from "../utils/formatters";
import toast from "react-hot-toast";
import { Campaign } from "../types";
const FundraiserCardPlaceholder: React.FC = () => (
  <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-3/4">
        <div className="h-7 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
    <div className="w-full bg-gray-200 h-2.5 rounded-full mb-2"></div>
    <div className="flex justify-between mb-6">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="bg-white rounded-lg border border-gray-200 mt-4 grid grid-cols-3 divide-x h-20"></div>
  </div>
);
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  console.log("Dashboard User:", user);
  const { data: campaigns = [], isLoading } = useUserCampaigns(user?.id);
  const updateCampaignMutation = useUpdateCampaign();
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(
    null
  );
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
  });
  const totalRaised = campaigns.reduce(
    (sum, campaign) => sum + campaign.raised_amount,
    0
  );
  const totalPhotoDownloads = campaigns.reduce(
    (sum, campaign) => sum + (campaign.donations?.length || 0),
    0
  );
  const totalPageViews = campaigns.reduce(
    (sum, campaign) => sum + (campaign.page_views || 0),
    0
  );
  const handleEditClick = (campaign: Campaign) => {
    setEditingCampaignId(campaign.id);
    setEditFormData({
      title: campaign.title,
      description: campaign.description,
    });
  };
  const handleCancelEdit = () => {
    setEditingCampaignId(null);
    setEditFormData({ title: "", description: "" });
  };
  const handleSaveEdit = async (campaignId: string) => {
    if (!editFormData.title.trim()) {
      toast.error("Campaign title cannot be empty.");
      return;
    }

    await updateCampaignMutation.mutateAsync(
      { id: campaignId, ...editFormData },
      {
        onSuccess: () => {
          setEditingCampaignId(null);
        },
      }
    );
  };
  const handleShareCampaign = async (campaignId: string) => {

const url = `${window.location.origin}/fundraiser/${campaignId}`;    try {
      await navigator.clipboard.writeText(url);
      toast.success("Fundraiser link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link.");
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your fundraisers and track their performance
              </p>
            </div>
            <Link
              to="/create-campaign"
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center space-x-2 transition-colors mt-4 sm:mt-0"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Fundraiser</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {formatCurrency(totalRaised)}
              </p>
              <p className="text-sm text-gray-500">Total Raised</p>
            </div>
            <div className="bg-orange-50 rounded-full p-2">
              <DollarSign className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {totalPhotoDownloads}
              </p>
              <p className="text-sm text-gray-500">Photo Downloads</p>
            </div>
            <div className="bg-orange-50 rounded-full p-2">
              <Download className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {totalPageViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Page Views</p>
            </div>
            <div className="bg-orange-50 rounded-full p-2">
              <BarChart2 className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {campaigns.length}
              </p>
              <p className="text-sm text-gray-500">Fundraisers</p>
            </div>
            <div className="bg-orange-50 rounded-full p-2">
              <FolderKanban className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Fundraisers ({String(campaigns.length).padStart(2, "0")})
          </h2>
          <div className="space-y-6">
            {isLoading ? (
              <>
                <FundraiserCardPlaceholder />
                <FundraiserCardPlaceholder />
              </>
            ) : campaigns.length === 0 ? (
              <div className="text-center bg-gray-50 border border-gray-200 p-12 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800">
                  No fundraisers yet
                </h3>
                <p className="text-gray-500 mt-2 mb-6">
                  Create your first fundraiser to get started.
                </p>
                <Link
                  to="/create-campaign"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Fundraiser</span>
                </Link>
              </div>
            ) : (
              campaigns.map((campaign: Campaign) => {
                const isEditing = editingCampaignId === campaign.id;
                const progressPercentage =
                  campaign.goal_amount > 0
                    ? (campaign.raised_amount / campaign.goal_amount) * 100
                    : 0;
                const pageViews = campaign.page_views || 0;

                return (
                  <div
                    key={campaign.id}
                    className="bg-gray-50 border border-gray-200 p-6 rounded-lg"
                  >
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Campaign Title
                          </label>
                          <input
                            type="text"
                            value={editFormData.title}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                title: e.target.value,
                              })
                            }
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={editFormData.description}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                description: e.target.value,
                              })
                            }
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSaveEdit(campaign.id)}
                            disabled={updateCampaignMutation.isPending}
                            className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-md hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
                          >
                            {updateCampaignMutation.isPending
                              ? "Saving..."
                              : "Save Changes"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-md hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col md:flex-row justify-between md:items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">
                              {campaign.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 mb-3">
                              {campaign.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1.5">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{campaign.location || "N/A"}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>{formatDate(campaign.event_date)}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <Camera className="w-4 h-4 text-gray-500" />
                                <span>{campaign.photo_count} photos</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-4 md:mt-0 flex-shrink-0">
                            <button
                              onClick={() => handleEditClick(campaign)}
                              className="px-4 py-2 bg-white text-gray-800 text-sm font-semibold rounded-md border border-gray-300 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                            >
                              <Edit className="w-4 h-4 text-orange-500" />
                              <span>Edit Fundraiser</span>
                            </button>
                            <button
                              onClick={() => handleShareCampaign(campaign.id)}
                              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2"
                            >
                              <Share2 className="w-4 h-4 text-gray-500" />
                              <span>Share Fundraiser</span>
                            </button>
                          </div>
                        </div>

                        {campaign.goal_amount > 0 && (
                          <div className="my-4">
                            <div className="flex justify-between text-sm text-gray-700 mb-1.5">
                              <span className="font-bold text-gray-800">
                                {formatCurrency(campaign.raised_amount)} raised
                              </span>
                              <span className="text-gray-500">
                                of {formatCurrency(campaign.goal_amount)} goal
                              </span>
                            </div>
                            <div className="w-full bg-white border border-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    progressPercentage,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="bg-white rounded-md border border-gray-200 mt-4 grid grid-cols-3 divide-x divide-gray-200">
                          <div className="text-center p-4">
                            <p className="text-xl font-bold text-orange-500">
                              {campaign.donations?.length || 0}
                            </p>
                            <p className="text-sm text-gray-500">
                              Photo Downloads
                            </p>
                          </div>
                          <div className="text-center p-4">
                            <p className="text-xl font-bold text-orange-500">
                              {pageViews.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">Page Views</p>
                          </div>
                          <div className="text-center p-4">
                            <p className="text-xl font-bold text-orange-500">
                              {Math.round(progressPercentage)}%
                            </p>
                            <p className="text-sm text-gray-500">Goal</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
