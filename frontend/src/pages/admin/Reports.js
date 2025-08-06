import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import './Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState({
    dailySales: [],
    monthlySales: [],
    userPurchases: [],
    productSales: [],
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('sales');

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Determine days for API call
      let days = 7;
      switch (dateRange) {
        case '7days':
          days = 7;
          break;
        case '30days':
          days = 30;
          break;
        case 'thisMonth':
          days = 30; // Approximate for this month
          break;
        default:
          days = 7;
      }

      // Fetch real data from backend
      const [
        dailySalesRes,
        monthlySalesRes,
        topUsersRes,
        productSalesRes,
        summaryRes
      ] = await Promise.all([
        axios.get(`http://localhost:5000/api/reports/daily-sales?days=${days}`),
        axios.get('http://localhost:5000/api/reports/monthly-sales'),
        axios.get('http://localhost:5000/api/reports/top-users?limit=10'),
        axios.get('http://localhost:5000/api/reports/product-sales?limit=6'),
        axios.get('http://localhost:5000/api/reports/summary')
      ]);

      // Process daily sales data
      const dailySales = dailySalesRes.data.map(item => ({
        date: format(new Date(item.date), 'MMM dd'),
        sales: parseFloat(item.total_sales || 0),
        orders: parseInt(item.order_count || 0),
        users: parseInt(item.unique_users || 0)
      })).reverse(); // Reverse to show chronological order

      // Process monthly sales data
      const monthlySales = monthlySalesRes.data.map(item => ({
        month: format(new Date(item.month + '-01'), 'MMM yyyy'),
        sales: parseFloat(item.total_sales || 0),
        orders: parseInt(item.order_count || 0),
        users: parseInt(item.unique_users || 0)
      })).reverse();

      // Process user purchases data
      const userPurchases = topUsersRes.data.map(user => ({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        totalSpent: parseFloat(user.total_spent || 0),
        orderCount: parseInt(user.order_count || 0),
        avgOrderValue: parseFloat(user.avg_order_value || 0),
        lastOrderDate: user.last_order_date
      }));

      // Process product sales data
      const productSales = productSalesRes.data.map(product => ({
        id: product.id,
        name: product.name,
        sales: parseFloat(product.total_revenue || 0),
        quantity: parseInt(product.quantity_sold || 0),
        price: parseFloat(product.price || 0)
      }));

      // Get summary data
      const summary = summaryRes.data;

      setReportData({
        dailySales,
        monthlySales,
        userPurchases,
        productSales,
        totalRevenue: parseFloat(summary.totalRevenue || 0),
        totalOrders: parseInt(summary.totalOrders || 0),
        totalUsers: parseInt(summary.totalUsers || 0),
        todayRevenue: parseFloat(summary.todayRevenue || 0),
        todayOrders: parseInt(summary.todayOrders || 0),
        thisMonthRevenue: parseFloat(summary.thisMonthRevenue || 0),
        avgOrderValue: parseFloat(summary.avgOrderValue || 0)
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };



  const downloadPDF = async () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Add title and header
      doc.setFontSize(24);
      doc.setTextColor(40, 40, 40);
      doc.text('📊 Sales & Analytics Report', 20, yPosition);
      yPosition += 15;

      // Add generation info
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${format(new Date(), 'PPP')} at ${format(new Date(), 'p')}`, 20, yPosition);
      doc.text(`Report Period: ${dateRange === '7days' ? 'Last 7 Days' : dateRange === '30days' ? 'Last 30 Days' : 'This Month'}`, 20, yPosition + 10);
      yPosition += 30;

      // Add summary statistics
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('📈 Summary Statistics', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      const summaryData = [
        ['Total Revenue', `$${reportData.totalRevenue.toFixed(2)}`],
        ['Total Orders', reportData.totalOrders.toString()],
        ['Total Users', reportData.totalUsers.toString()],
        ['Today\'s Revenue', `$${(reportData.todayRevenue || 0).toFixed(2)}`],
        ['Today\'s Orders', (reportData.todayOrders || 0).toString()],
        ['This Month Revenue', `$${(reportData.thisMonthRevenue || 0).toFixed(2)}`],
        ['Average Order Value', `$${(reportData.avgOrderValue || 0).toFixed(2)}`]
      ];

      doc.autoTable({
        head: [['Metric', 'Value']],
        body: summaryData,
        startY: yPosition,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 11 }
      });

      yPosition = doc.lastAutoTable.finalY + 20;

      // Add daily sales breakdown
      if (reportData.dailySales.length > 0) {
        doc.setFontSize(16);
        doc.text('📅 Daily Sales Breakdown', 20, yPosition);
        yPosition += 10;

        const dailySalesData = reportData.dailySales.map(item => [
          item.date,
          `$${item.sales.toFixed(2)}`,
          item.orders.toString(),
          item.users.toString(),
          item.orders > 0 ? `$${(item.sales / item.orders).toFixed(2)}` : '$0.00'
        ]);

        doc.autoTable({
          head: [['Date', 'Revenue', 'Orders', 'Users', 'Avg Order']],
          body: dailySalesData,
          startY: yPosition,
          theme: 'grid',
          headStyles: { fillColor: [16, 185, 129] },
          styles: { fontSize: 10 }
        });

        yPosition = doc.lastAutoTable.finalY + 20;
      }

      // Add new page for user data
      doc.addPage();
      yPosition = 20;

      // Add top purchasing users
      if (reportData.userPurchases.length > 0) {
        doc.setFontSize(16);
        doc.text('👥 Top Purchasing Users', 20, yPosition);
        yPosition += 10;

        const userPurchasesData = reportData.userPurchases.slice(0, 15).map((user, index) => [
          (index + 1).toString(),
          user.userName,
          user.userEmail || 'N/A',
          `$${user.totalSpent.toFixed(2)}`,
          user.orderCount.toString(),
          `$${user.avgOrderValue.toFixed(2)}`,
          user.lastOrderDate ? format(new Date(user.lastOrderDate), 'MMM dd, yyyy') : 'N/A'
        ]);

        doc.autoTable({
          head: [['#', 'Name', 'Email', 'Total Spent', 'Orders', 'Avg Order', 'Last Order']],
          body: userPurchasesData,
          startY: yPosition,
          theme: 'striped',
          headStyles: { fillColor: [139, 92, 246] },
          styles: { fontSize: 9 },
          columnStyles: {
            1: { cellWidth: 35 },
            2: { cellWidth: 45 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 25 },
            6: { cellWidth: 30 }
          }
        });

        yPosition = doc.lastAutoTable.finalY + 20;
      }

      // Add product sales data
      if (reportData.productSales.length > 0) {
        doc.setFontSize(16);
        doc.text('🛍️ Product Sales Performance', 20, yPosition);
        yPosition += 10;

        const productSalesData = reportData.productSales.map((product, index) => [
          (index + 1).toString(),
          product.name,
          `$${product.price.toFixed(2)}`,
          product.quantity.toString(),
          `$${product.sales.toFixed(2)}`
        ]);

        doc.autoTable({
          head: [['#', 'Product Name', 'Price', 'Qty Sold', 'Total Revenue']],
          body: productSalesData,
          startY: yPosition,
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11] },
          styles: { fontSize: 10 }
        });
      }

      // Add footer with additional info
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 10);
        doc.text('Generated by e-Shop Admin Dashboard', doc.internal.pageSize.width - 80, doc.internal.pageSize.height - 10);
      }

      // Save the PDF
      doc.save(`sales-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <main className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading reports...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <main className="main-content">
        <div className="reports-header">
          <h1>📈 Reports & Analytics</h1>
          <div className="reports-controls">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="date-range-select"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
            </select>
            <button onClick={downloadPDF} className="download-btn">
              📄 Download PDF
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card revenue">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total Revenue</h3>
              <p>${reportData.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="summary-card orders">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <h3>Total Orders</h3>
              <p>{reportData.totalOrders}</p>
            </div>
          </div>
          <div className="summary-card users">
            <div className="card-icon">👥</div>
            <div className="card-content">
              <h3>Total Users</h3>
              <p>{reportData.totalUsers}</p>
            </div>
          </div>
          <div className="summary-card today-revenue">
            <div className="card-icon">🌟</div>
            <div className="card-content">
              <h3>Today's Revenue</h3>
              <p>${(reportData.todayRevenue || 0).toFixed(2)}</p>
            </div>
          </div>
          <div className="summary-card today-orders">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <h3>Today's Orders</h3>
              <p>{reportData.todayOrders || 0}</p>
            </div>
          </div>
          <div className="summary-card avg-order">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Avg Order Value</h3>
              <p>${(reportData.avgOrderValue || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Daily Sales Chart */}
          <div className="chart-container">
            <h3>Daily Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reportData.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `$${value.toFixed(2)}` : value,
                  name === 'sales' ? 'Sales' : name === 'orders' ? 'Orders' : 'Users'
                ]} />
                <Legend />
                <Area type="monotone" dataKey="sales" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Sales Chart */}
          <div className="chart-container">
            <h3>Monthly Sales Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `$${value.toFixed(2)}` : value,
                  name === 'sales' ? 'Sales' : name === 'orders' ? 'Orders' : 'Users'
                ]} />
                <Legend />
                <Bar dataKey="sales" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Users Chart */}
          <div className="chart-container">
            <h3>Top Purchasing Users</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.userPurchases.slice(0, 5)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="userName" type="category" width={100} />
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Total Spent']} />
                <Bar dataKey="totalSpent" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Product Sales Chart */}
          <div className="chart-container">
            <h3>Product Sales Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.productSales}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {reportData.productSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Tables */}
        <div className="data-tables">
          {/* Top Users Table */}
          <div className="data-table">
            <h3>Top Purchasing Users</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Total Spent</th>
                  <th>Order Count</th>
                  <th>Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {reportData.userPurchases.slice(0, 10).map((user, index) => (
                  <tr key={user.userId}>
                    <td>{user.userName}</td>
                    <td>${user.totalSpent.toFixed(2)}</td>
                    <td>{user.orderCount}</td>
                    <td>${(user.totalSpent / user.orderCount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Daily Sales Table */}
          <div className="data-table">
            <h3>Daily Sales Breakdown</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sales</th>
                  <th>Orders</th>
                  <th>Users</th>
                  <th>Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {reportData.dailySales.map((day, index) => (
                  <tr key={index}>
                    <td>{day.date}</td>
                    <td>${day.sales.toFixed(2)}</td>
                    <td>{day.orders}</td>
                    <td>{day.users}</td>
                    <td>${day.orders > 0 ? (day.sales / day.orders).toFixed(2) : '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
