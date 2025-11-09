import { useMemo } from 'react';
import { EMI_PLANS, MONTHS_PER_YEAR, PERCENTAGE_DIVISOR, LOCALE, INTEREST_RATE_DISPLAY, type EMIPlan } from '../constant';

interface EMIPlanSelectorProps {
  productPrice: number;
  onSelectPlan: (plan: EMIPlan | null) => void;
  selectedPlan: EMIPlan | null;
}

function EMIPlanSelector({ productPrice, onSelectPlan, selectedPlan }: EMIPlanSelectorProps) {
  // Use EMI plans from constants
  const emiPlans: EMIPlan[] = useMemo(() => EMI_PLANS, []);

  const calculateMonthlyPayment = (plan: EMIPlan): number => {
    const principal = productPrice - plan.cashback;
    
    if (plan.interestRate === 0) {
      // For 0% interest: simply divide principal by tenure
      return Math.ceil(principal / plan.tenureMonths);
    }

    // For interest-based plans: use EMI formula
    // EMI = [P × r × (1+r)^n] / [(1+r)^n-1]
    const monthlyInterestRate = plan.interestRate / PERCENTAGE_DIVISOR / MONTHS_PER_YEAR;
    const n = plan.tenureMonths;
    
    const emi =
      (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, n)) /
      (Math.pow(1 + monthlyInterestRate, n) - 1);

    return Math.ceil(emi);
  };

  const calculateTotalAmount = (plan: EMIPlan): number => {
    const monthlyPayment = calculateMonthlyPayment(plan);
    return monthlyPayment * plan.tenureMonths;
  };

  return (
    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto px-1.5 py-1 mt-1">
      {emiPlans.map((plan) => {
        const monthlyPayment = calculateMonthlyPayment(plan);
        const totalAmount = calculateTotalAmount(plan);
        const isSelected = selectedPlan?.id === plan.id;

        return (
          <div
            key={plan.id}
            onClick={() => onSelectPlan(isSelected ? null : plan)}
            className={`px-3 py-2.5 border rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.01] ${
              isSelected
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md ring-1 ring-blue-200'
                : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-row justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 shadow-sm'
                      : 'border-gray-300 bg-white group-hover:border-blue-400'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    ₹{monthlyPayment.toLocaleString(LOCALE)}
                    <span className="text-gray-500 font-medium text-sm ml-1">
                      × {plan.tenureMonths} months
                    </span>
                  </p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                plan.interestRate === 0 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-orange-100 text-orange-700 border border-orange-200'
              }`}>
                {plan.interestRate === 0 ? INTEREST_RATE_DISPLAY.ZERO_INTEREST : INTEREST_RATE_DISPLAY.WITH_INTEREST(plan.interestRate)}
              </span>
            </div>
            <div className="ml-6 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-gray-600">
                  Total Amount:
                </p>
                <p className="text-xs font-semibold text-gray-800">
                  ₹{totalAmount.toLocaleString(LOCALE)}
                </p>
              </div>
              {plan.cashback > 0 && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs font-medium text-green-700">
                    Cashback: ₹{plan.cashback.toLocaleString(LOCALE)}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EMIPlanSelector;

