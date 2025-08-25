import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { DonationData } from "../lib/stripe";
import { usePayment } from "../hooks/usePayments";
import { formatCurrency } from "../utils/formatters";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface StripePaymentFormProps {
  paymentData: DonationData & {
    donationAmount?: number;
    photoAmount?: number;
  };
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  paymentData,
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();

  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string>("");
  const { invalidateQueries } = usePayment();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (
          !supabaseUrl ||
          !supabaseKey ||
          supabaseUrl.includes("placeholder")
        ) {
          throw new Error(
            "Supabase configuration is missing. Please connect to Supabase first."
          );
        }

        const response = await fetch(
          `${supabaseUrl}/functions/v1/create-payment-intent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify(paymentData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to initialize payment");
        }

        const paymentIntent = await response.json();
        setClientSecret(paymentIntent.client_secret);
      } catch (error: any) {
        console.error("Failed to create payment intent:", error);
        setPaymentError(error.message);
        onError(error.message);
      }
    };

    initializePayment();
  }, [paymentData, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPaymentError("");

    if (!stripe || !elements || !clientSecret) {
      setPaymentError("Payment system not ready. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: paymentData.donorName,
              email: paymentData.donorEmail,
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Payment failed");
      }
      else if (paymentIntent.status === "succeeded") {
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        queryClient.invalidateQueries({ queryKey: ['campaign', paymentData.campaignId] });
        toast.success("Payment successful! Thank you for your donation.");
        onSuccess();
      }
      else {
        throw new Error("Payment was not completed successfully");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentError(error.message || "Payment failed");
      onError(error.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: "Inter, system-ui, sans-serif",
        "::placeholder": {
          color: "#aab7c4",
        },
        iconColor: "#666EE8",
      },
      invalid: {
        color: "#9e2146",
        iconColor: "#fa755a",
      },
    },
    hidePostalCode: false,
  };

  if (!stripe || !elements) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading payment system...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{paymentError}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Payment Information</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={paymentData.donorName || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-lg p-3 bg-white">
              <CardElement options={cardElementOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Lock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe || !clientSecret}
        className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Complete Payment - {formatCurrency(paymentData.amount)}</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By completing this payment, you agree to our Terms of Service and
        Privacy Policy. Your donation supports{" "}
        {paymentData.donationAmount
          ? `${formatCurrency(paymentData.donationAmount)} to the cause`
          : "this campaign"}
        {paymentData.photoAmount > 0 &&
          ` and includes ${formatCurrency(
            paymentData.photoAmount
          )} for photo downloads`}
        .
      </p>
    </form>
  );
};

export default StripePaymentForm;
