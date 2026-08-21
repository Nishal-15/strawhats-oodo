import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Products from "./pages/Products";
import StockLedger from "./pages/StockLedger";
import InventoryAdjustments from "./pages/InventoryAdjustments";

import Customers from "./pages/Customers";
import SalesOrders from "./pages/SalesOrders";

import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";

import WorkCenters from "./pages/WorkCenters";
import BoMs from "./pages/BoMs";
import ManufacturingOrders from "./pages/ManufacturingOrders";
import WorkOrders from "./pages/WorkOrders";

import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* PUBLIC */}
          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          {/* PROTECTED */}
          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/stock-ledger"
              element={<StockLedger />}
            />

            <Route
              path="/inventory-adjustments"
              element={<InventoryAdjustments />}
            />

            <Route
              path="/customers"
              element={<Customers />}
            />

            <Route
              path="/sales-orders"
              element={<SalesOrders />}
            />

            <Route
              path="/suppliers"
              element={<Suppliers />}
            />

            <Route
              path="/purchase-orders"
              element={<PurchaseOrders />}
            />

            <Route
              path="/work-centers"
              element={<WorkCenters />}
            />

            <Route
              path="/boms"
              element={<BoMs />}
            />

            <Route
              path="/manufacturing-orders"
              element={<ManufacturingOrders />}
            />

            <Route
              path="/work-orders"
              element={<WorkOrders />}
            />

          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}