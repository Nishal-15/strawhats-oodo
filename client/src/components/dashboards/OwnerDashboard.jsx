export default function OwnerDashboard({
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
          <h1>Business Dashboard</h1>
        </div>

        <div className="user-box">
          <span>{user.name} · BUSINESS OWNER</span>

          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="hero">
        <h2>Business Overview</h2>

        <p className="muted">
          Monitor the overall performance of sales, purchasing,
          inventory and manufacturing.
        </p>
      </section>

      <section className="grid">
        <div className="card">
          <span className="module-number">01</span>
          <h3>Inventory Value</h3>
          <h2>
            ₹{summary.inventoryValue.toLocaleString()}
          </h2>
          <p className="muted">
            Current inventory valuation
          </p>
        </div>

        <div className="card">
          <span className="module-number">02</span>
          <h3>Open Sales</h3>
          <h2>{summary.openSalesOrders}</h2>
          <p className="muted">
            Active sales orders
          </p>
        </div>

        <div className="card">
          <span className="module-number">03</span>
          <h3>Sales Value</h3>
          <h2>
            ₹{summary.openSalesOrderValue.toLocaleString()}
          </h2>
          <p className="muted">
            Value of open sales
          </p>
        </div>

        <div className="card">
          <span className="module-number">04</span>
          <h3>Open Purchases</h3>
          <h2>{summary.openPurchaseOrders}</h2>
          <p className="muted">
            Active purchase orders
          </p>
        </div>

        <div className="card">
          <span className="module-number">05</span>
          <h3>Purchase Value</h3>
          <h2>
            ₹{summary.openPurchaseOrderValue.toLocaleString()}
          </h2>
          <p className="muted">
            Value of open purchases
          </p>
        </div>

        <div className="card">
          <span className="module-number">06</span>
          <h3>Manufacturing</h3>
          <h2>{summary.activeManufacturingOrders}</h2>
          <p className="muted">
            Active manufacturing orders
          </p>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <span className="module-number">07</span>
          <h3>Total Stock</h3>
          <h2>{summary.totalOnHand}</h2>
          <p className="muted">
            Physical stock across products
          </p>
        </div>

        <div className="card">
          <span className="module-number">08</span>
          <h3>Reserved Stock</h3>
          <h2>{summary.totalReserved}</h2>
          <p className="muted">
            Stock committed to operations
          </p>
        </div>

        <div className="card">
          <span className="module-number">09</span>
          <h3>Low Stock</h3>
          <h2>{summary.lowStockCount}</h2>
          <p className="muted">
            Products requiring attention
          </p>
        </div>
      </section>

      <section className="card">
        <h3>Recent Business Activity</h3>

        {dashboard.recentMovements.length === 0 ? (
          <p className="muted">
            No recent activity.
          </p>
        ) : (
          dashboard.recentMovements.map((movement) => (
            <div
              key={movement._id}
              className="movement-row"
            >
              <div>
                <strong>
                  {movement.product?.name}
                </strong>

                <p className="muted">
                  {movement.type} · {movement.note}
                </p>
              </div>

              <strong>{movement.quantity}</strong>
            </div>
          ))
        )}
      </section>
    </main>
  );
}