import { Link } from "react-router-dom";

export default function AdminDashboard({
  user,
  logout,
  dashboard,
}) {
  const { summary } = dashboard;

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">
            SHIV FURNITURE WORKS
          </p>

          <h1>Admin Dashboard</h1>
        </div>

        <div className="user-box">
          <span>
            {user.name} · ADMIN
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
        <h2>System Control Center</h2>

        <p className="muted">
          Manage the complete ERP and monitor every
          business operation.
        </p>
      </section>

      <section className="grid">
        <div className="card">
          <span className="module-number">01</span>
          <h3>Total Products</h3>
          <h2>{summary.totalProducts}</h2>
        </div>

        <div className="card">
          <span className="module-number">02</span>
          <h3>Total Stock</h3>
          <h2>{summary.totalOnHand}</h2>
        </div>

        <div className="card">
          <span className="module-number">03</span>
          <h3>Inventory Value</h3>
          <h2>
            ₹{summary.inventoryValue.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <span className="module-number">04</span>
          <h3>Open Sales</h3>
          <h2>{summary.openSalesOrders}</h2>
        </div>

        <div className="card">
          <span className="module-number">05</span>
          <h3>Open Purchases</h3>
          <h2>{summary.openPurchaseOrders}</h2>
        </div>

        <div className="card">
          <span className="module-number">06</span>
          <h3>Manufacturing</h3>
          <h2>
            {summary.activeManufacturingOrders}
          </h2>
        </div>
      </section>

      <section className="grid">

        {/* PRODUCTS */}
        <Link
          className="card module"
          to="/products"
        >
          <span className="module-number">
            01
          </span>

          <h3>Products</h3>

          <p>
            Manage products and inventory
            configuration.
          </p>
        </Link>

        {/* STOCK LEDGER */}
        <Link
          className="card module"
          to="/stock-ledger"
        >
          <span className="module-number">
            02
          </span>

          <h3>Stock Ledger</h3>

          <p>
            View the complete inventory
            movement history.
          </p>
        </Link>

        {/* SALES */}
        <Link
          className="card module"
          to="/customers"
        >
          <span className="module-number">
            03
          </span>

          <h3>Sales</h3>

          <p>
            Manage customers and sales orders.
          </p>
        </Link>

        {/* PURCHASE */}
        <Link
          className="card module"
          to="/suppliers"
        >
          <span className="module-number">
            04
          </span>

          <h3>Purchase</h3>

          <p>
            Manage suppliers and purchase orders.
          </p>
        </Link>

        {/* MANUFACTURING */}
        <Link
          className="card module"
          to="/boms"
        >
          <span className="module-number">
            05
          </span>

          <h3>Manufacturing</h3>

          <p>
            Manage BoM and production operations.
          </p>
        </Link>

        {/* USER MANAGEMENT */}
        <Link
          className="card module"
          to="/users"
        >
          <span className="module-number">
            06
          </span>

          <h3>User Management</h3>

          <p>
            Manage ERP users and their roles.
          </p>
        </Link>

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
    </main>
  );
}