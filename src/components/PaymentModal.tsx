
import React, { useState } from "react";
import { X, CreditCard, ShoppingCart, Heart } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import StripePaymentForm from "./StripePaymentForm";
import { stripePromise } from "../lib/stripe";
import { Campaign } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { formatCurrency } from "../utils/formatters";
import toast from "react-hot-toast";
const donationSchema = z.object({
donorEmail: z.string().email("Please enter a valid email"),
donorName: z.string().min(1, "Please enter your name"),
});
type DonationForm = z.infer<typeof donationSchema>;
interface PaymentModalProps {
isOpen: boolean;
onClose: () => void;
campaign: Campaign;
selectedPhotos: string[];
additionalDonation: number;
onSuccess: () => void;
}
const PaymentModal: React.FC<PaymentModalProps> = ({
isOpen,
onClose,
campaign,
selectedPhotos,
additionalDonation,
onSuccess,
}) => {
const { user } = useAuth();
const [showPaymentForm, setShowPaymentForm] = useState(false);
const [paymentData, setPaymentData] = useState<any>(null);
const {
register,
handleSubmit,
formState: { errors },
reset,
} = useForm<DonationForm>({
resolver: zodResolver(donationSchema),
defaultValues: {
donorName: user?.user_metadata?.full_name || "",
donorEmail: user?.email || "",
},
});
const isOwnCampaign =
user &&
(campaign.organizer_id === user.id || campaign.photographer_id === user.id);
const photoTotal = selectedPhotos.length * (campaign.photo_price || 5);
const totalAmount = photoTotal + additionalDonation;
const onSubmit = async (data: DonationForm) => {
if (isOwnCampaign) {
toast.error("You cannot donate to your own campaign");
return;
}
codeCode
if (selectedPhotos.length === 0) {
  toast.error("Please select at least one photo");
  return;
}

setPaymentData({
  campaignId: campaign.id,
  amount: totalAmount,
  donorEmail: data.donorEmail,
  donorName: data.donorName,
  photoIds: selectedPhotos,
  donationAmount: additionalDonation,
  photoAmount: photoTotal,
});
setShowPaymentForm(true);
};
const handlePaymentSuccess = () => {
setShowPaymentForm(false);
reset();
onSuccess();
toast.success("Thank you for your donation!");
};
const handlePaymentError = (error: string) => {
setShowPaymentForm(false);
toast.error(error);
};
const handleClose = () => {
setShowPaymentForm(false);
setPaymentData(null);
reset();
onClose();
};
if (!isOpen) return null;
if (isOwnCampaign) {
return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-lg max-w-md w-full p-6">
<div className="flex items-center justify-between mb-6">
<h3 className="text-xl font-bold text-gray-900">Cannot Donate</h3>
<button
onClick={onClose}
className="p-2 hover:bg-gray-100 rounded-full transition-colors"
>
<X className="w-5 h-5" />
</button>
</div>
codeCode
<div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          You cannot donate to your own campaign
        </h4>
        <p className="text-gray-600 mb-6">
          Campaign organizers and photographers cannot fund their own
          campaigns to maintain transparency and trust.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-colors"
        >
          Understood
        </button>
      </div>
    </div>
  </div>
);
}
if (showPaymentForm && paymentData) {
return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
<div className="flex items-center justify-between mb-6">
<h3 className="text-xl font-bold text-gray-900">
Complete Payment
</h3>
<button
onClick={() => setShowPaymentForm(false)}
className="p-2 hover:bg-gray-100 rounded-full transition-colors"
>
<X className="w-5 h-5" />
</button>
</div>
codeCode
<div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">
          {campaign.title}
        </h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Photos ({selectedPhotos.length}):</span>
            <span className="font-medium">
              {formatCurrency(paymentData.photoAmount)}
            </span>
          </div>
          {paymentData.donationAmount > 0 && (
            <div className="flex justify-between">
              <span>Additional Donation:</span>
              <span className="font-medium">
                {formatCurrency(paymentData.donationAmount)}
              </span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total:</span>
            <span className="text-orange-600">
              {formatCurrency(paymentData.amount)}
            </span>
          </div>
        </div>
      </div>

      <Elements stripe={stripePromise}>
        <StripePaymentForm
          paymentData={paymentData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </Elements>
    </div>
  </div>
);
}
return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
<div className="flex items-center justify-between mb-6">
<h3 className="text-xl font-bold text-gray-900">
Support This Campaign
</h3>
<button
onClick={handleClose}
className="p-2 hover:bg-gray-100 rounded-full transition-colors"
>
<X className="w-5 h-5" />
</button>
</div>
codeCode
<div className="mb-6">
      <h4 className="font-semibold text-gray-900 mb-2">{campaign.title}</h4>
      <p className="text-gray-600 text-sm mb-4">
        Supporting {campaign.charity_name || campaign.cause_type}
      </p>

      {selectedPhotos.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              Selected Photos
            </span>
          </div>
          <p className="text-sm text-orange-700">
            {selectedPhotos.length} photo
            {selectedPhotos.length > 1 ? "s" : ""} ×{" "}
            {formatCurrency(campaign.photo_price || 5)} ={" "}
            {formatCurrency(photoTotal)}
          </p>
          <p className="text-xs text-orange-600 mt-1">
            Photos will be available for download after payment
          </p>
        </div>
      )}
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Name
        </label>
        <input
          type="text"
          {...register("donorName")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Enter your full name"
        />
        {errors.donorName && (
          <p className="text-red-600 text-sm mt-1">
            {errors.donorName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          {...register("donorEmail")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Enter your email"
        />
        {errors.donorEmail && (
          <p className="text-red-600 text-sm mt-1">
            {errors.donorEmail.message}
          </p>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Photos ({selectedPhotos.length}):</span>
            <span>{formatCurrency(photoTotal)}</span>
          </div>
          {additionalDonation > 0 && (
            <div className="flex justify-between">
              <span>Additional Donation:</span>
              <span>{formatCurrency(additionalDonation)}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total:</span>
            <span className="text-orange-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={selectedPhotos.length === 0}
          className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>Continue to Payment</span>
        </button>
      </div>
    </form>
  </div>
</div>
);
};
export default PaymentModal;
