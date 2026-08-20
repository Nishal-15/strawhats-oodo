import { Link } from "react-router-dom";

export default function SalesDashboard({ user, logout, dashboard }) {
  const { summary } = dashboard;

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">SHIV FURNITURE WORKS</p>
          <h1>Sales Dashboard</h1>
        </div>

        <div className="user-box">
          <span>{user.name} · SALES USER</span>

          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="hero">
        <h2>Sales Operations</h2>

        <p className="muted">
          Manage customers, sales orders and deliveries.
        </p>
      </section>

      <section className="grid">
        <div className="card">
          <span className="module-number">01</span>
          <h3>Open Sales Orders</h3>
          <h2>{summary.openSalesOrders}</h2>
          <p className="muted">
            Orders requiring attention
          </p>
        </div>

        <div className="card">
          <span className="module-number">02</span>
          <h3>Order Value</h3>
          <h2>
            ₹{summary.openSalesOrderValue.toLocaleString()}
          </h2>
          <p className="muted">
            Value of open orders
          </p>
        </div>
      </section>

      <section className="grid">

        <Link
          className="card module"
          to="/customers"
        >
          <span className="module-number">01</span>
          <h3>Customers</h3>
          <p>
            Manage customers and their contact information.
          </p>
        </Link>

        <Link
          className="card module"
          to="/sales-orders"
        >
          <span className="module-number">02</span>
          <h3>Sales Orders</h3>
          <p>
            Create, confirm and deliver sales orders.
          </p>
        </Link>

        <Link
          className="card module"
          to="/sales-orders"
        >
          <span className="module-number">03</span>
          <h3>Deliveries</h3>
          <p>
            Process confirmed sales orders for delivery.
          </p>
        </Link>

      </section>
    </main>
  );
}