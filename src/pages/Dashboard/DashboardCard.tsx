
const DashboardCard = ({
  icon,
  title,
  value,
  change,
  additionalInfo,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: string;
  additionalInfo?: string;
}) => {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  return (
    <div className="p-5 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-lg bg-blue-50">
          {icon}
        </div>
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-800' : isNegative ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium mt-4 text-gray-500">{title}</h3>
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      {additionalInfo && (
        <p className="text-xs mt-2 text-gray-500">{additionalInfo}</p>
      )}
    </div>
  );
};

export default DashboardCard;