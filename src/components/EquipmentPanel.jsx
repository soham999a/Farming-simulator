import { useState } from 'react';
import { formatMoney } from '../utils/time.js';
import { equipment, consumables } from '../systems/EquipmentSystem.js';

const EquipmentPanel = ({ gameState, gameController, onNotification }) => {
  const [activeTab, setActiveTab] = useState('shop');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const ownedEquipment = gameController.equipment.getOwnedEquipment();
  const inventory = gameController.equipment.getInventory();

  const equipmentCategories = {
    all: 'All Equipment',
    tractor: '🚜 Tractors',
    irrigation: '💧 Irrigation',
    fertilizer: '🌿 Fertilizer',
    harvester: '🌾 Harvesters',
    soil: '🔨 Soil Tools',
    protection: '🏠 Protection'
  };

  const handleBuyEquipment = async (equipmentId) => {
    const result = gameController.equipment.buyEquipment(
      equipmentId, 
      gameState.player.money, 
      gameState.player.level
    );
    
    if (result.success) {
      gameState.player.money -= result.cost;
      onNotification('success', result.message);
    } else {
      onNotification('error', result.message);
    }
  };

  const handleMaintainEquipment = async (equipmentId) => {
    const result = gameController.equipment.maintainEquipment(equipmentId, gameState.player.money);
    
    if (result.success) {
      gameState.player.money -= result.cost;
      onNotification('success', result.message);
    } else {
      onNotification('error', result.message);
    }
  };

  const handleBuyConsumable = async (consumableId, quantity = 1) => {
    const result = gameController.equipment.buyConsumable(consumableId, quantity, gameState.player.money);
    
    if (result.success) {
      gameState.player.money -= result.cost;
      onNotification('success', result.message);
    } else {
      onNotification('error', result.message);
    }
  };



  const filteredEquipment = Object.values(equipment).filter(item => 
    selectedCategory === 'all' || item.type === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Equipment Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-2 mb-6">
          {[
            { id: 'shop', label: '🛒 Equipment Shop', icon: '🏪' },
            { id: 'owned', label: '🚜 My Equipment', icon: '📦' },
            { id: 'consumables', label: '🌿 Consumables', icon: '🧪' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Equipment Shop */}
        {activeTab === 'shop' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🛒</span>
              Equipment Shop
            </h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(equipmentCategories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    selectedCategory === key
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEquipment.map(item => {
                const canAfford = gameState.player.money >= item.cost;
                const canUnlock = gameState.player.level >= item.unlockLevel;
                const isOwned = ownedEquipment.some(owned => owned.id === item.id);

                return (
                  <div
                    key={item.id}
                    className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                      canAfford && canUnlock && !isOwned
                        ? 'border-green-300 hover:border-green-500 hover:shadow-lg'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    {/* Equipment Header */}
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>

                    {/* Equipment Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Cost:</span>
                        <span className="font-bold">{formatMoney(item.cost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Unlock Level:</span>
                        <span className={`font-bold ${canUnlock ? 'text-green-600' : 'text-red-600'}`}>
                          Level {item.unlockLevel}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Durability:</span>
                        <span className="font-bold">{item.durability}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Maintenance:</span>
                        <span className="font-bold">{formatMoney(item.maintenanceCost)}</span>
                      </div>
                    </div>

                    {/* Equipment Effects */}
                    <div className="mb-4">
                      <div className="text-sm font-bold text-gray-700 mb-2">Effects:</div>
                      <div className="space-y-1 text-xs">
                        {Object.entries(item.effects).map(([effect, value]) => (
                          <div key={effect} className="flex justify-between">
                            <span className="capitalize">{effect.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-bold text-blue-600">
                              {typeof value === 'number' ? 
                                (value > 1 ? `+${Math.round((value - 1) * 100)}%` : `${Math.round(value * 100)}%`) :
                                value.toString()
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Buy Button */}
                    <button
                      onClick={() => handleBuyEquipment(item.id)}
                      disabled={!canAfford || !canUnlock || isOwned}
                      className={`w-full py-2 px-4 rounded-lg font-bold transition-colors ${
                        isOwned
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : canAfford && canUnlock
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-red-400 text-white cursor-not-allowed'
                      }`}
                    >
                      {isOwned ? '✅ Owned' :
                       !canUnlock ? `🔒 Level ${item.unlockLevel} Required` :
                       !canAfford ? '💰 Not Enough Money' :
                       `🛒 Buy ${formatMoney(item.cost)}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Owned Equipment */}
        {activeTab === 'owned' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🚜</span>
              My Equipment
            </h2>

            {ownedEquipment.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Equipment Yet</h3>
                <p className="text-gray-500">Visit the shop to buy your first equipment!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedEquipment.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                    </div>

                    {/* Condition */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Condition:</span>
                        <span className={`font-bold ${
                          item.condition >= 80 ? 'text-green-600' :
                          item.condition >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round(item.condition)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.condition >= 80 ? 'bg-green-500' :
                            item.condition >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.condition}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Maintenance Button */}
                    {item.condition < 100 && (
                      <button
                        onClick={() => handleMaintainEquipment(item.id)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                      >
                        🔧 Maintain ({formatMoney(item.maintenanceCost)})
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Consumables */}
        {activeTab === 'consumables' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🌿</span>
              Consumables & Supplies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shop */}
              <div>
                <h3 className="text-lg font-bold mb-3">🛒 Shop</h3>
                <div className="space-y-3">
                  {Object.values(consumables).map(item => (
                    <div key={item.id} className="border rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                          <div className="text-sm font-bold">{formatMoney(item.costPerUnit)} each</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBuyConsumable(item.id, 1)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-bold"
                        >
                          Buy 1
                        </button>
                        <button
                          onClick={() => handleBuyConsumable(item.id, 10)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold"
                        >
                          Buy 10
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory */}
              <div>
                <h3 className="text-lg font-bold mb-3">📦 Inventory</h3>
                <div className="space-y-3">
                  {inventory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📦</div>
                      <div>No consumables in inventory</div>
                    </div>
                  ) : (
                    inventory.map(item => (
                      <div key={item.id} className="border rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.emoji}</span>
                          <div>
                            <div className="font-bold">{item.name}</div>
                            <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentPanel;
