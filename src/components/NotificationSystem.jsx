import { useEffect } from 'react';

const NotificationCard = ({ notification, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600 text-white';
      case 'error':
        return 'bg-red-500 border-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600 text-white';
      case 'info':
        return 'bg-blue-500 border-blue-600 text-white';
      default:
        return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div className={`
      ${getNotificationStyle(notification.type)}
      border-l-4 p-4 rounded-r-lg shadow-lg transform transition-all duration-300
      hover:scale-105 cursor-pointer animate-slideIn
    `}
    onClick={() => onRemove(notification.id)}
    >
      <div className="flex items-center space-x-3">
        <div className="text-2xl">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm">
            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </div>
          <div className="text-sm opacity-90">
            {notification.message}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notification.id);
          }}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const NotificationSystem = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default NotificationSystem;
