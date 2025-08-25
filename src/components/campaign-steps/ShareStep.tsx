import React from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Campaign } from "../../types";
import { Copy, Share2, QrCode, ExternalLink } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

type ShareStepProps = {
  data: Partial<Campaign>;
  onComplete: () => void;
  onBack: () => void;
};

const ShareStep: React.FC<ShareStepProps> = ({ data, onComplete, onBack }) => {
  const navigate = useNavigate();
  const fundraiserUrl = `${window.location.origin}/fundraiser/${data.id || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fundraiserUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById(
      "qr-code-canvas"
    ) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${data.title || "fundraiser"}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR Code downloaded!");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: data.title || "Check out this fundraiser!",
          text:
            data.description ||
            "Support this great cause by downloading photos.",
          url: fundraiserUrl,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      handleCopy();
      toast.success("Link copied! You can now paste it on social media.");
    }
  };
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div style={{ display: "none" }}>
        <QRCodeCanvas
          id="qr-code-canvas"
          value={fundraiserUrl}
          size={256}
          level={"H"}
          imageSettings={{
            src: "/images/logo-icon.png",
            excavate: true,
            height: 40,
            width: 40,
          }}
        />
      </div>

      <div>
        <label
          htmlFor="fundraiserUrl"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Your Fundraiser URL
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="fundraiserUrl"
            type="text"
            readOnly
            value={fundraiserUrl}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-600"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold transition-colors text-sm"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors text-sm"
        >
          <Share2 className="w-4 h-4" />
          <span>Share on Social Media</span>
        </button>
        <button
          type="button"
          onClick={handleDownloadQR}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors text-sm"
        >
          <QrCode className="w-4 h-4" />
          <span>Download QR Code</span>
        </button>
      </div>

      <div className="text-center">
        <Link
          to={fundraiserUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center space-x-2 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold transition-colors text-sm"
        >
          <span>View Fundraiser</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-md font-semibold text-gray-800 mb-4">Next Steps</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
          <li>Share your fundraiser link with potential donors</li>
          <li>Monitor donations and downloads in your dashboard</li>
          <li>Upload additional photos as your event progresses</li>
          <li>Send thank you messages to your supporters</li>
        </ul>
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
          type="button"
          onClick={onComplete}
          className="px-8 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors text-sm"
        >
          Return Home »
        </button>
      </div>
    </div>
  );
};

export default ShareStep;
