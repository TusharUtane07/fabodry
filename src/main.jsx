import { StrictMode } from 'react'; 
import { createRoot } from 'react-dom/client'; 
import './index.css'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import Login from './pages/Login.jsx'; 
import Orders from './pages/Orders.jsx'; 
import AdminAndSystem from './pages/AdminAndSystem.jsx'; 
import AnalyticsAndReporting from './pages/AnalyticsAndReporting.jsx'; 
import B2Borders from './pages/B2Borders.jsx'; 
import CatalogAndProducts from './pages/CatalogAndProducts.jsx'; 
import CustomerManagement from './pages/CustomerManagement.jsx'; 
import ExpenseManagement from './pages/ExpenseManagement.jsx'; 
import FactoryPanel from './pages/FactoryPanel.jsx'; 
import FranchiseManagement from './pages/FranchiseManagement.jsx'; 
import HelpAndSupport from './pages/HelpAndSupport.jsx'; 
import HrAndStaffManagement from './pages/HrAndStaffManagement.jsx'; 
import InventoryManagement from './pages/InventoryManagement.jsx'; 
import LeadsAndEnquiries from './pages/LeadsAndEnquires.jsx'; 
import PaymentsTracking from './pages/PaymentsTracking.jsx'; 
import PickupAndDrop from './pages/PickupAndDrop.jsx'; 
import RoleManagement from './pages/RoleManagement.jsx'; 
import Settlements from './pages/Settlements.jsx'; 
import Home from './pages/Home.jsx'; 
import { CartProvider } from './context/CartContenxt.jsx'; 
import Dashboard from './pages/Dashboard.jsx'; 
import { Toaster } from 'react-hot-toast'; 
import Navbar from './components/Navbar.jsx'; 
import Sidebar from './components/Sidebar.jsx';
import PrintLabelsPage from './components/PrintLabels.jsx';
import PrintReceipt from './components/PrintReceipt.jsx';
import { SelectedAddonsProvider } from './context/AddonContext.jsx';
import EditOrders from './pages/EditOrders.jsx';

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <CartProvider>
      <SelectedAddonsProvider>
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <Sidebar />}
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pos" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/all" element={<Orders />} />
        {/* <Route path="/b2c-orders/all" element={<B2Corders />} />
        <Route path="/b2c-orders" element={<B2Corders />} /> */}
        <Route path="/pickup-drop" element={<PickupAndDrop />} />
        <Route path="/edit-order/:id" element={<EditOrders />} />
        <Route path="/print-labels" element={<PrintLabelsPage />} />
        <Route path="/print-receipt" element={<PrintReceipt />} />
        <Route path="/leads-and-enquires" element={<LeadsAndEnquiries />} />
        <Route path="/customer-management" element={<CustomerManagement />} />
        <Route path="/b2b-orders/all" element={<B2Borders />} />
        <Route path="/b2b-orders/" element={<B2Borders />} />
        <Route path="/settlements" element={<Settlements />} />
        <Route path="/catalogs-and-products" element={<CatalogAndProducts />} />
        <Route path="/expense-management" element={<ExpenseManagement />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="/analytics-and-reporting" element={<AnalyticsAndReporting />} />
        <Route path="/hr-and-staff-management" element={<HrAndStaffManagement />} />
        <Route path="/factory-panel" element={<FactoryPanel />} />
        <Route path="/role-management" element={<RoleManagement />} />
        <Route path="/franchise-management" element={<FranchiseManagement />} />
        <Route path="/help-and-support" element={<HelpAndSupport />} />
        <Route path="/admin-and-system" element={<AdminAndSystem />} />
        <Route path="/payments-tracking" element={<PaymentsTracking />} />
      </Routes>
      
      <Toaster />
      </SelectedAddonsProvider>
    </CartProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AppLayout />
    </Router>
  </StrictMode>
);