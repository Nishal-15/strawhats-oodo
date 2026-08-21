import { Link } from "react-router-dom";

export default function InventoryDashboard({
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
          <h1>Inventory Dashboard</h1>
        </div>

        <div className="user-box">
          <span>
            {user.name} · INVENTORY MANAGER
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
        <h2>Inventory Control</h2>

        <p className="muted">
          Monitor stock levels, inventory value and
          stock movements.
        </p>
      </section>

      <section className="grid">
        <div className="card">
          <span className="module-number">01</span>
          <h3>Total Products</h3>
          <h2>{summary.totalProducts}</h2>
          <p className="muted">
            Products in inventory
          </p>
        </div>

        <div className="card">
          <span className="module-number">02</span>
          <h3>On Hand</h3>
          <h2>{summary.totalOnHand}</h2>
          <p className="muted">
            Total physical stock
          </p>
        </div>

        <div className="card">
          <span className="module-number">03</span>
          <h3>Reserved</h3>
          <h2>{summary.totalReserved}</h2>
          <p className="muted">
            Stock reserved for operations
          </p>
        </div>

        <div className="card">
          <span className="module-number">04</span>
          <h3>Free To Use</h3>
          <h2>{summary.totalFreeToUse}</h2>
          <p className="muted">
            Available stock
          </p>
        </div>

        <div className="card">
          <span className="module-number">05</span>
          <h3>Inventory Value</h3>
          <h2>
            ₹{summary.inventoryValue.toLocaleString()}
          </h2>
          <p className="muted">
            Current stock value
          </p>
        </div>

        <div className="card">
          <span className="module-number">06</span>
          <h3>Low Stock</h3>
          <h2>{summary.lowStockCount}</h2>
          <p className="muted">
            Products requiring attention
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
            Create and manage products and stock
            configuration.
          </p>
        </Link>

        <Link
          className="card module"
          to="/stock-ledger"
        >
          <span className="module-number">
            02
          </span>

          <h3>Stock Ledger</h3>

          <p>
            View the complete inventory movement
            history.
          </p>
        </Link>

        <Link
          className="card module"
          to="/inventory-adjustments"
        >
          <span className="module-number">
            03
          </span>

          <h3>Stock Adjustment</h3>

          <p>
            Correct physical stock differences and
            damaged stock.
          </p>
        </Link>
      </section>
    </main>
  );
}