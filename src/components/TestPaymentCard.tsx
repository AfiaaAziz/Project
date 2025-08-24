import React from "react";
import { CreditCard } from "lucide-react";

const TestPaymentCard: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-blue-900">
          Test Payment Information
        </span>
      </div>
      <div className="text-sm text-blue-800 space-y-1">
        <p>
          <strong>Test Card Numbers:</strong>
        </p>
        <p>• Success: 4242 4242 4242 4242</p>
        <p>• Decline: 4000 0000 0000 0002</p>
        <p>• Use any future expiry date and any 3-digit CVC</p>
      </div>
    </div>
  );
};

export default TestPaymentCard;
