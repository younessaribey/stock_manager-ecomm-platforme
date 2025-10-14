import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaCalendar, 
  FaDownload, 
  FaFilter, 
  FaSearch
} from 'react-icons/fa';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { dashboardAPI } from '../../utils/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('sales');
  const [chartData, setChartData] = useState({});
  const [summaryData, setSummaryData] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        // Fetch real stats from backend
        const response = await dashboardAPI.getStats();
        const stats = response.data;
        setSummaryData(stats);
        // You may want to transform stats into chartData as needed for your charts
        // For now, just clear chartData (implement chart mapping as needed)
        setChartData({});
      } catch (error) {
        setSummaryData({});
        setChartData({});
      }
      setLoading(false);
    };
    fetchStatistics();
  }, [reportType, dateRange]);

  // Render appropriate chart based on report type
  const renderMainChart = () => {
    if (!chartData.main) return null;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: getChartTitle()
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    };
    
    if (reportType === 'sales') {
      return <Line data={chartData.main} options={options} height={300} />;
    } 
    else if (reportType === 'inventory') {
      return <Bar data={chartData.main} options={options} height={300} />;
    }
    else if (reportType === 'customers') {
      return <Line data={chartData.main} options={options} height={300} />;
    }
  };

  // Render secondary chart based on report type
  const renderSecondaryChart = () => {
    if (!chartData.secondary) return null;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' },
        title: {
          display: true,
          text: getSecondaryChartTitle()
        }
      }
    };
    
    return <Doughnut data={chartData.secondary} options={options} height={300} />;
  };

  // Get appropriate chart title based on report type and date range
  const getChartTitle = () => {
    const timeFrame = dateRange === 'week' ? 'Weekly' : dateRange === 'month' ? 'Monthly' : 'Yearly';
    
    if (reportType === 'sales') {
      return `${timeFrame} Revenue`;
    } 
    else if (reportType === 'inventory') {
      return `${timeFrame} Inventory Levels`;
    }
    else if (reportType === 'customers') {
      return `${timeFrame} New Customers`;
    }
    return '';
  };

  // Get appropriate secondary chart title based on report type
  const getSecondaryChartTitle = () => {
    if (reportType === 'sales') {
      return 'Sales by Category';
    } 
    else if (reportType === 'inventory') {
      return 'Inventory Status';
    }
    else if (reportType === 'customers') {
      return 'Customer Activity';
    }
    return '';
  };

  // Get appropriate summary data labels based on report type
  const getSummaryLabels = () => {
    if (reportType === 'sales') {
      return ['Total Revenue', 'Avg. Order Value', 'Order Count', 'Conversion Rate'];
    } 
    else if (reportType === 'inventory') {
      return ['Total Products', 'Avg. Stock Level', 'Low Stock Items', 'Out of Stock'];
    }
    else if (reportType === 'customers') {
      return ['Total Customers', 'New Customers', 'Active Customers', 'Retention Rate'];
    }
    return [];
  };

  // Get appropriate summary data values based on report type
  const getSummaryValues = () => {
    if (reportType === 'sales') {
      return [
        summaryData.totalRevenue,
        summaryData.averageOrderValue,
        summaryData.orderCount,
        summaryData.conversionRate
      ];
    } 
    else if (reportType === 'inventory') {
      return [
        summaryData.totalProducts,
        summaryData.averageStockLevel,
        summaryData.lowStockItems,
        summaryData.outOfStockItems
      ];
    }
    else if (reportType === 'customers') {
      return [
        summaryData.totalCustomers,
        summaryData.newCustomers,
        summaryData.activeCustomers,
        summaryData.customerRetention
      ];
    }
    return [];
  };

  // Get appropriate icon based on report type and index
  const getSummaryIcon = (index) => {
    if (reportType === 'sales') {
      const icons = [
        <FaChartLine className="h-6 w-6 text-indigo-600" />,
        <FaChartBar className="h-6 w-6 text-green-600" />,
        <FaChartPie className="h-6 w-6 text-blue-600" />,
        <FaChartLine className="h-6 w-6 text-purple-600" />
      ];
      return icons[index] || icons[0];
    } 
    else if (reportType === 'inventory') {
      const icons = [
        <FaChartBar className="h-6 w-6 text-green-600" />,
        <FaChartLine className="h-6 w-6 text-indigo-600" />,
        <FaChartPie className="h-6 w-6 text-yellow-600" />,
        <FaChartPie className="h-6 w-6 text-red-600" />
      ];
      return icons[index] || icons[0];
    }
    else if (reportType === 'customers') {
      const icons = [
        <FaChartBar className="h-6 w-6 text-blue-600" />,
        <FaChartLine className="h-6 w-6 text-red-600" />,
        <FaChartPie className="h-6 w-6 text-green-600" />,
        <FaChartLine className="h-6 w-6 text-indigo-600" />
      ];
      return icons[index] || icons[0];
    }
    return <FaChartLine className="h-6 w-6 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Analytics & Reports</h1>
        
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex shadow-sm rounded-md">
            <button
              type="button"
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                dateRange === 'week'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 text-sm font-medium ${
                dateRange === 'month'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setDateRange('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                dateRange === 'year'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Year
            </button>
          </div>
          
          <div className="inline-flex shadow-sm rounded-md">
            <button
              type="button"
              onClick={() => setReportType('sales')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                reportType === 'sales'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Sales
            </button>
            <button
              type="button"
              onClick={() => setReportType('inventory')}
              className={`px-4 py-2 text-sm font-medium ${
                reportType === 'inventory'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Inventory
            </button>
            <button
              type="button"
              onClick={() => setReportType('customers')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                reportType === 'customers'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Customers
            </button>
          </div>
          
          <button
            type="button"
            className="flex items-center px-4 py-2 text-sm font-medium bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50"
          >
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getSummaryLabels().map((label, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100 mr-4">
                {getSummaryIcon(index)}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{getSummaryValues()[index]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="h-[400px]">
            {renderMainChart()}
          </div>
        </div>
        
        {/* Secondary Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-1">
          <div className="h-[400px] flex items-center justify-center">
            {renderSecondaryChart()}
          </div>
        </div>
      </div>
      
      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {reportType === 'sales' ? 'Top Products by Revenue' : 
             reportType === 'inventory' ? 'Inventory Status by Category' :
             'Top Customers by Spending'}
          </h2>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 w-64"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {reportType === 'sales' && (
                  <>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </>
                )}
                
                {reportType === 'inventory' && (
                  <>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Products
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      In Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Low Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Out of Stock
                    </th>
                  </>
                )}
                
                {reportType === 'customers' && (
                  <>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Order Value
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportType === 'sales' && (
                <>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Wireless Headphones</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Electronics
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">143</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$21,442.57</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Standing Desk</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Furniture
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">87</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$30,449.13</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Mechanical Keyboard</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Electronics
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">112</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$11,198.88</td>
                  </tr>
                </>
              )}
              
              {reportType === 'inventory' && (
                <>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Electronics</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">42</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">36</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Furniture</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">9</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Office Supplies</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">28</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">25</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                  </tr>
                </>
              )}
              
              {reportType === 'customers' && (
                <>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">John Smith</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$245.75</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$2,949.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Alice Brown</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$312.50</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$2,500.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Robert Johnson</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$178.33</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$2,675.00</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
