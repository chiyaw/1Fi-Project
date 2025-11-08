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
    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
      {emiPlans.map((plan) => {
        const monthlyPayment = calculateMonthlyPayment(plan);
        const totalAmount = calculateTotalAmount(plan);
        const isSelected = selectedPlan?.id === plan.id;

        return (
          <div
            key={plan.id}
            onClick={() => onSelectPlan(isSelected ? null : plan)}
            className={`px-1 py-1 border rounded-md transition-all cursor-pointer ${
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <div className="flex flex-row justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <p className="font-medium">₹{monthlyPayment.toLocaleString(LOCALE)} ✕ {plan.tenureMonths} Months</p>
              </div>
              <p className={`text-sm font-semibold ${
                plan.interestRate === 0 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {plan.interestRate === 0 ? INTEREST_RATE_DISPLAY.ZERO_INTEREST : INTEREST_RATE_DISPLAY.WITH_INTEREST(plan.interestRate)}
              </p>
            </div>
            <div className="ml-6">
              <p className="text-xs text-gray-500">
                Total: ₹{totalAmount.toLocaleString(LOCALE)}
              </p>
              {plan.cashback > 0 && (
                <p className="text-xs text-green-600">
                  Additional Cashback: ₹{plan.cashback.toLocaleString(LOCALE)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EMIPlanSelector;

