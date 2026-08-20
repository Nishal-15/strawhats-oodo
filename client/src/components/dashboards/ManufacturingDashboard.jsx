import { Link } from "react-router-dom";

export default function ManufacturingDashboard({
  user,
  logout,
  dashboard,
}) {
  const { summary } = dashboard;

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">SHIV FURNITURE WORKS</p>
          <h1>Manufacturing Dashboard</h1>
        </div>

        <div className="user-box">
          <span>{user.name} · MANUFACTURE USER</span>

          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="hero">
        <h2>Production Operations</h2>

        <p className="muted">
          Manage BoMs, manufacturing orders and production work.
        </p>
      </section>

      <section className="grid">
        <div className="card">
          <span className="module-number">01</span>
          <h3>Active Manufacturing</h3>
          <h2>{summary.activeManufacturingOrders}</h2>
          <p className="muted">
            Manufacturing orders in progress
          </p>
        </div>

        <div className="card">
          <span className="module-number">02</span>
          <h3>Total Products</h3>
          <h2>{summary.totalProducts}</h2>
          <p className="muted">
            Products available for production
          </p>
        </div>
      </section>

      <section className="grid">

        <Link
          className="card module"
          to="/boms"
        >
          <span className="module-number">01</span>
          <h3>BoM</h3>
          <p>
            Create and manage Bills of Materials.
          </p>
        </Link>

        <Link
          className="card module"
          to="/manufacturing-orders"
        >
          <span className="module-number">02</span>
          <h3>Manufacturing Orders</h3>
          <p>
            Create, confirm and complete production orders.
          </p>
        </Link>

        <Link
          className="card module"
          to="/work-orders"
        >
          <span className="module-number">03</span>
          <h3>Work Orders</h3>
          <p>
            Start and complete production operations.
          </p>
        </Link>

        <Link
          className="card module"
          to="/work-centers"
        >
          <span className="module-number">04</span>
          <h3>Work Centers</h3>
          <p>
            Manage production work centers.
          </p>
        </Link>

      </section>
    </main>
  );
}