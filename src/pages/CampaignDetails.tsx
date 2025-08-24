import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, User, Calendar, Download, Share2 } from "lucide-react";
import CampaignComments from "../components/CampaignComments";

import LoadingSpinner from "../components/LoadingSpinner";
import PaymentModal from "../components/PaymentModal";
import { useCampaign } from "../hooks/useCampaigns";
import { formatCurrency, formatDate } from "../utils/formatters";
import { supabase } from "../lib/supabase";

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading } = useCampaign(id!);

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [additionalDonation, setAdditionalDonation] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (id) {
      supabase.rpc("increment_page_view", { campaign_id_to_update: id });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500">Campaign not found.</p>
      </div>
    );
  }

  const approvedPhotos =
    campaign.photos?.filter((p) => p.moderation_status === "approved") || [];
  const progressPercentage =
    campaign.goal_amount > 0
      ? (campaign.raised_amount / campaign.goal_amount) * 100
      : 0;
  const photoTotal = selectedPhotos.length * (campaign.photo_price || 0);
  const donationAmount = additionalDonation
    ? parseFloat(additionalDonation)
    : 0;
  const finalTotal = photoTotal + donationAmount;

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const selectAllPhotos = () => {
    setSelectedPhotos(
      selectedPhotos.length === approvedPhotos.length
        ? []
        : approvedPhotos.map((p) => p.id)
    );
  };

  const handleCheckout = () => {
    if (selectedPhotos.length === 0) {
      alert("Please select at least one photo to checkout.");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Campaign link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {campaign.cause_type || "General"}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-3">
                {campaign.title} Photos
              </h1>
              <p className="text-gray-600 leading-relaxed max-w-2xl mb-8">
                {campaign.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-gray-700 mb-8">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{campaign.location || "Not specified"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span>{campaign.organizer?.full_name || "Anonymous"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>
                    {campaign.event_date
                      ? formatDate(campaign.event_date)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-gray-400" />
                  <span>{campaign.donations?.length || 0} Downloads</span>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 self-start">
              <div className="mb-4 text-center">
                <span className="text-4xl font-bold text-orange-500">
                  {formatCurrency(campaign.raised_amount)}
                </span>
                <p className="text-gray-500 mt-1">
                  Raised of {formatCurrency(campaign.goal_amount)} goal
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mb-2 text-center">
                Supporting {campaign.charity_name || "the designated cause"}
              </p>
              <p className="text-sm text-gray-600 text-center">
                Photos: {formatCurrency(campaign.photo_price || 0)} each
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Photos ({approvedPhotos.length})
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectAllPhotos}
                  className="font-semibold text-gray-700 hover:text-orange-600"
                >
                  {selectedPhotos.length === approvedPhotos.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
                {selectedPhotos.length > 0 && (
                  <button
                    onClick={handleCheckout}
                    className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold"
                  >
                    Checkout ({selectedPhotos.length})
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {approvedPhotos.map((photo) => {
                const isSelected = selectedPhotos.includes(photo.id);
                return (
                  <div
                    key={photo.id}
                    className="relative cursor-pointer group"
                    onClick={() => togglePhotoSelection(photo.id)}
                  >
                    <img
                      src={photo.thumbnail_url || photo.url}
                      alt="Event"
                      className={`w-full h-48 object-cover rounded-lg transition-all ${isSelected ? "ring-4 ring-orange-500" : ""
                        }`}
                    />
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-md border border-gray-300 flex items-center justify-center">
                      {isSelected && (
                        <div className="w-4 h-4 bg-orange-500 rounded-sm" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-16">
              <CampaignComments campaign={campaign} />
            </div>

          </div>

          <div className="space-y-8 self-start">
            {selectedPhotos.length > 0 && (
              <div className="bg-gray-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Your Selection
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-800">
                    <span>{selectedPhotos.length} photos</span>
                    <span>{formatCurrency(photoTotal)}</span>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Additional Donation (optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={additionalDonation}
                        onChange={(e) => setAdditionalDonation(e.target.value)}
                        className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div className="border-t border-gray-300 pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                About This Event
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {campaign.description}
              </p>
              <div className="text-sm text-gray-500 border-t border-gray-200 pt-4 mb-4">
                10% of proceeds go to charity, personal cause, or the
                photographer
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-800">
                    {campaign.organizer?.full_name || "Anonymous"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Professional event photographer with 10+ years experience
                    specializing in nonprofit and community events.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Share This Fundraiser
              </h3>
              <p className="text-gray-600 mb-4">
                Help us reach our goal by sharing with friends and family.
              </p>
              <button
                onClick={handleShare}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        campaign={campaign}
        selectedPhotos={selectedPhotos}
        additionalDonation={donationAmount}
        onSuccess={() => {
          setShowPaymentModal(false);
          setSelectedPhotos([]);
          setAdditionalDonation("");
        }}
      />
    </div>
  );
};

export default CampaignDetails;
