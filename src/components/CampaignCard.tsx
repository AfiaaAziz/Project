import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Camera, TrendingUp } from "lucide-react";
import { Campaign } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const {
    id,
    title,
    cause_type,
    raised_amount,
    location,
    organizer,
    event_date,
    photos,
    photo_count,
  } = campaign;

  const approvedPhotos =
    photos?.filter((p) => p.moderation_status === "approved") || [];
  const heroImage = approvedPhotos[0]?.url || "/images/placeholder-1.jpg"; 

  return (
    <Link
      to={`/fundraiser/${id}`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow group"
    >
      <div className="relative">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-64 object-cover rounded-t-2xl"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {photo_count > 0 && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {photo_count} Photo{photo_count !== 1 ? "s" : ""}
            </span>
          )}
          {cause_type && (
            <span className="bg-black/40 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
              {cause_type}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          <div className="flex items-center space-x-1 text-gray-800">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="font-bold">{formatCurrency(raised_amount)}</span>
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{location || "Not specified"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>{organizer?.full_name || "Anonymous"}</span>
          </div>
          {event_date && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event_date)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
