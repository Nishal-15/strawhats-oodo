import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

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

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">SHIV FURNITURE WORKS</p>
          <h1>Mini ERP</h1>
        </div>

        <div className="user-box">
          <span>
            {user?.name} · {user?.role}
          </span>

          <button
            className="secondary"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="hero">
        <h2>Control the business flow.</h2>

        <p className="muted">
          Monitor inventory, sales, purchasing and
          manufacturing from one place.
        </p>
      </section>

      {loading && (
        <p className="muted">
          Loading dashboard...
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {dashboard && (
        <>
          <section className="grid">
            <div className="card">
              <span className="module-number">01</span>
              <h3>Products</h3>
              <h2>
                {dashboard.summary.totalProducts}
              </h2>
              <p className="muted">
                Active products
              </p>
            </div>

            <div className="card">
              <span className="module-number">02</span>
              <h3>Stock</h3>
              <h2>
                {dashboard.summary.totalOnHand}
              </h2>
              <p className="muted">
                Total units on hand
              </p>
            </div>

            <div className="card">
              <span className="module-number">03</span>
              <h3>Reserved</h3>
              <h2>
                {dashboard.summary.totalReserved}
              </h2>
              <p className="muted">
                Reserved units
              </p>
            </div>

            <div className="card">
              <span className="module-number">04</span>
              <h3>Free To Use</h3>
              <h2>
                {dashboard.summary.totalFreeToUse}
              </h2>
              <p className="muted">
                Available units
              </p>
            </div>

            <div className="card">
              <span className="module-number">05</span>
              <h3>Inventory Value</h3>
              <h2>
                ₹{dashboard.summary.inventoryValue.toLocaleString()}
              </h2>
              <p className="muted">
                Current stock value
              </p>
            </div>

            <div className="card">
              <span className="module-number">06</span>
              <h3>Manufacturing</h3>
              <h2>
                {dashboard.summary.activeManufacturingOrders}
              </h2>
              <p className="muted">
                Active manufacturing orders
              </p>
            </div>
          </section>

          <section className="grid">
            <Link
              className="card module"
              to="/products"
            >
              <span className="module-number">
                01
              </span>
              <h3>Products</h3>
              <p>
                Manage products and procurement
                configuration.
              </p>
            </Link>

            <div className="card">
              <span className="module-number">
                02
              </span>
              <h3>Sales Orders</h3>
              <h2>
                {dashboard.summary.openSalesOrders}
              </h2>
              <p className="muted">
                Open sales orders
              </p>
            </div>

            <div className="card">
              <span className="module-number">
                03
              </span>
              <h3>Purchase Orders</h3>
              <h2>
                {dashboard.summary.openPurchaseOrders}
              </h2>
              <p className="muted">
                Open purchase orders
              </p>
            </div>

            <div className="card">
              <span className="module-number">
                04
              </span>
              <h3>Low Stock</h3>
              <h2>
                {dashboard.summary.lowStockCount}
              </h2>
              <p className="muted">
                Products requiring attention
              </p>
            </div>
          </section>

          <section className="card">
            <h3>Recent Stock Movements</h3>

            {dashboard.recentMovements.length === 0 ? (
              <p className="muted">
                No recent movements.
              </p>
            ) : (
              dashboard.recentMovements.map(
                (movement) => (
                  <div
                    key={movement._id}
                    className="movement-row"
                  >
                    <div>
                      <strong>
                        {movement.product?.name}
                      </strong>

                      <p className="muted">
                        {movement.type} ·{" "}
                        {movement.note}
                      </p>
                    </div>

                    <strong>
                      {movement.quantity}
                    </strong>
                  </div>
                )
              )
            )}
          </section>
        </>
      )}
    </main>
  );
}