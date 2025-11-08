import { useMemo } from 'react';

interface EMIPlan {
  id: string;
  tenureMonths: number;
  interestRate: number;
  cashback: number;
}

interface EMIPlanSelectorProps {
  productPrice: number;
  onSelectPlan: (plan: EMIPlan | null) => void;
  selectedPlan: EMIPlan | null;
}

function EMIPlanSelector({ productPrice, onSelectPlan, selectedPlan }: EMIPlanSelectorProps) {
  // Define the 7 EMI plans
  const emiPlans: EMIPlan[] = useMemo(() => [
    { id: '1', tenureMonths: 3, interestRate: 0, cashback: 0 },
    { id: '2', tenureMonths: 6, interestRate: 0, cashback: 0 },
    { id: '3', tenureMonths: 12, interestRate: 0, cashback: 0 },
    { id: '4', tenureMonths: 24, interestRate: 0, cashback: 0 },
    { id: '5', tenureMonths: 36, interestRate: 10.5, cashback: 0 },
    { id: '6', tenureMonths: 48, interestRate: 10.5, cashback: 0 },
    { id: '7', tenureMonths: 60, interestRate: 10.5, cashback: 0 },
  ], []);

  const calculateMonthlyPayment = (plan: EMIPlan): number => {
    const principal = productPrice - plan.cashback;
    
    if (plan.interestRate === 0) {
      // For 0% interest: simply divide principal by tenure
      return Math.ceil(principal / plan.tenureMonths);
    }

    // For interest-based plans: use EMI formula
    // EMI = [P × r × (1+r)^n] / [(1+r)^n-1]
    const monthlyInterestRate = plan.interestRate / 100 / 12;
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
            className={`px-3 py-3 border rounded-md transition-all cursor-pointer ${
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
                <p className="font-medium">₹{monthlyPayment.toLocaleString('en-IN')} ✕ {plan.tenureMonths} Months</p>
              </div>
              <p className={`text-sm font-semibold ${
                plan.interestRate === 0 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {plan.interestRate === 0 ? '0% Interest' : `${plan.interestRate}% Interest`}
              </p>
            </div>
            <div className="ml-6">
              <p className="text-xs text-gray-500 mt-1">
                Total: ₹{totalAmount.toLocaleString('en-IN')}
              </p>
              {plan.cashback > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Cashback: ₹{plan.cashback.toLocaleString('en-IN')}
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

