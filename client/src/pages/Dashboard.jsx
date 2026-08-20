import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

import AdminDashboard from "../components/dashboards/AdminDashboard";
import SalesDashboard from "../components/dashboards/SalesDashboard";
import PurchaseDashboard from "../components/dashboards/PurchaseDashboard";
import ManufacturingDashboard from "../components/dashboards/ManufacturingDashboard";
import InventoryDashboard from "../components/dashboards/InventoryDashboard";
import OwnerDashboard from "../components/dashboards/OwnerDashboard";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data } = await api.get("/dashboard/summary");
        setDashboard(data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
          "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="page">
        <p className="muted">Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <p className="error">{error}</p>
      </main>
    );
  }

  const commonProps = {
    user,
    logout,
    dashboard,
  };

  switch (user?.role) {
    case "ADMIN":
      return <AdminDashboard {...commonProps} />;

    case "SALES_USER":
      return <SalesDashboard {...commonProps} />;

    case "PURCHASE_USER":
      return <PurchaseDashboard {...commonProps} />;

    case "MANUFACTURE_USER":
      return <ManufacturingDashboard {...commonProps} />;

    case "INVENTORY_MANAGER":
      return <InventoryDashboard {...commonProps} />;

    case "BUSINESS_OWNER":
      return <OwnerDashboard {...commonProps} />;

    default:
      return (
        <main className="page">
          <p className="error">
            Unknown user role.
          </p>

          <button
            className="secondary"
            onClick={logout}
          >
            Logout
          </button>
        </main>
      );
  }
}