import AnnualFundSettings from './AnnualFundSettings';
import FundsManager from './FundsManager';

export default function GivingManager() {
  return (
    <div className="space-y-12">
      <AnnualFundSettings />
      <FundsManager />
    </div>
  );
}