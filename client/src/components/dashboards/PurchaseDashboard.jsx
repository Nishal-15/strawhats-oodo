import { Link } from "react-router-dom";

export default function PurchaseDashboard({ user, logout, dashboard }) {
  const { summary } = dashboard;

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">SHIV FURNITURE WORKS</p>
          <h1>Purchase Dashboard</h1>
        </div>

        <div className="user-box">
          <span>{user.name} · PURCHASE USER</span>

          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="hero">
        <h2>Purchase Operations</h2>

        <p className="muted">
          Manage suppliers, purchase orders and incoming inventory.
        </p>
      </section>

      <section className="grid">
        <div className="card">
          <span className="module-number">01</span>
          <h3>Open Purchase Orders</h3>
          <h2>{summary.openPurchaseOrders}</h2>
          <p className="muted">
            Orders requiring attention
          </p>
        </div>

        <div className="card">
          <span className="module-number">02</span>
          <h3>Purchase Value</h3>
          <h2>
            ₹{summary.openPurchaseOrderValue.toLocaleString()}
          </h2>
          <p className="muted">
            Value of open purchase orders
          </p>
        </div>
      </section>

      <section className="grid">
        <Link
          className="card module"
          to="/suppliers"
        >
          <span className="module-number">01</span>
          <h3>Suppliers</h3>
          <p>
            Manage suppliers and their contact information.
          </p>
        </Link>

        <Link
          className="card module"
          to="/purchase-orders"
        >
          <span className="module-number">02</span>
          <h3>Purchase Orders</h3>
          <p>
            Create and manage purchase orders.
          </p>
        </Link>

        <Link
          className="card module"
          to="/purchase-orders"
        >
          <span className="module-number">03</span>
          <h3>Receipts</h3>
          <p>
            Receive confirmed purchase orders into inventory.
          </p>
        </Link>
      </section>
    </main>
  );
}