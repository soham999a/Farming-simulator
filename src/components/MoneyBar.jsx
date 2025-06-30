import { formatMoney } from '../utils/time.js';

const MoneyBar = ({
  money,
  fieldCount,
  totalHarvests,
  totalEarnings,
  level,
  xp,
  reputation
}) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg shadow-lg mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Money Display */}
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-500 p-2 rounded-full">
            <span className="text-xl">💰</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatMoney(money)}</div>
            <div className="text-green-100 text-sm">Available Funds</div>
          </div>
        </div>

        {/* Fields Count */}
        <div className="flex items-center space-x-2">
          <div className="bg-brown-500 p-2 rounded-full">
            <span className="text-xl">🌾</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{fieldCount}</div>
            <div className="text-green-100 text-sm">Total Fields</div>
          </div>
        </div>

        {/* Total Harvests */}
        <div className="flex items-center space-x-2">
          <div className="bg-orange-500 p-2 rounded-full">
            <span className="text-xl">🚜</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalHarvests || 0}</div>
            <div className="text-green-100 text-sm">Harvests</div>
          </div>
        </div>

        {/* Level */}
        <div className="flex items-center space-x-2">
          <div className="bg-purple-500 p-2 rounded-full">
            <span className="text-xl">👑</span>
          </div>
          <div>
            <div className="text-2xl font-bold">Lv.{level || 1}</div>
            <div className="text-green-100 text-sm">Level</div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 p-2 rounded-full">
            <span className="text-xl">📈</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatMoney(totalEarnings || 0)}</div>
            <div className="text-green-100 text-sm">Total Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyBar;
