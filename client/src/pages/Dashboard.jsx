import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">SHIV FURNITURE WORKS</p>
          <h1>Mini ERP</h1>
        </div>
        <div className="user-box">
          <span>{user.name} · {user.role}</span>
          <button className="secondary" onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="hero">
        <h2>Control the business flow.</h2>
        <p className="muted">
          Products are the foundation. Next we connect BoM, sales, purchase,
          manufacturing, procurement and the stock ledger.
        </p>
      </section>

      <section className="grid">
        <Link className="card module" to="/products">
          <span className="module-number">01</span>
          <h3>Products</h3>
          <p>Create products and configure MTS/MTO procurement.</p>
        </Link>
        <div className="card module disabled"><span className="module-number">02</span><h3>BoM</h3><p>Next milestone.</p></div>
        <div className="card module disabled"><span className="module-number">03</span><h3>Sales</h3><p>Coming after inventory foundation.</p></div>
        <div className="card module disabled"><span className="module-number">04</span><h3>Purchase</h3><p>Coming after sales/procurement.</p></div>
        <div className="card module disabled"><span className="module-number">05</span><h3>Manufacturing</h3><p>BoM-driven production.</p></div>
        <div className="card module disabled"><span className="module-number">06</span><h3>Stock Ledger</h3><p>Single traceable inventory history.</p></div>
      </section>
    </main>
  );
}
