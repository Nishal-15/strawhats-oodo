import { Link } from "react-router-dom";
import "./LandingPage.css";

const MODULES = [
  {
    id: "sales",
    title: "Sales",
    description:
      "Manage customers, sales orders, confirmations and deliveries.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 5h2l1.6 9.6a2 2 0 0 0 2 1.7h8.1a2 2 0 0 0 2-1.6L20 8H6.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9.5" cy="19.5" r="1.4" fill="currentColor" />
        <circle cx="16.5" cy="19.5" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "purchase",
    title: "Purchasing",
    description:
      "Manage suppliers, purchase orders and incoming inventory.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M4 8.5 12 13l8-4.5M12 13v7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "inventory",
    title: "Inventory",
    description:
      "Track stock levels, adjustments, reservations and movements.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3.5"
          y="4"
          width="17"
          height="4.4"
          rx="0.6"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <rect
          x="3.5"
          y="10.2"
          width="17"
          height="4.4"
          rx="0.6"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <rect
          x="3.5"
          y="16.4"
          width="17"
          height="4.4"
          rx="0.6"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    description: "Manage BoMs, work centers, manufacturing and work orders.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 20V9.5l4.5-3v3.2L12 7.2V4l4.5 3v3.2L20 8v12H4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 20v-4.4h6V20"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const WORKSHOP_STATUS = [
  { label: "Sales", metric: "128 open", note: "Orders & deliveries" },
  { label: "Purchase", metric: "42 pending", note: "Suppliers & receipts" },
  { label: "Inventory", metric: "96% in stock", note: "Stock & movements" },
  { label: "Manufacturing", metric: "17 active", note: "Production & work orders" },
];

const FLOW = [
  { title: "Sales", note: "Customer order" },
  { title: "Inventory", note: "Stock availability" },
  { title: "Manufacturing", note: "Production" },
  { title: "Delivery", note: "Completed order" },
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <div className="brand">
          <p className="eyebrow">Shiv Furniture Works</p>
          <h2>Mini ERP</h2>
        </div>

        <Link className="landing-login" to="/login">
          Log in <span aria-hidden="true">→</span>
        </Link>
      </nav>

      <section className="landing-hero">
        <div className="hero-content">
          <p className="eyebrow">Business management system</p>

          <h1>
            One system.
            <br />
            Every business operation.
          </h1>

          <p className="landing-description">
            Run sales, purchasing, inventory and manufacturing from a
            single operational system built for the workshop floor.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" to="/login">
              Get started <span aria-hidden="true">→</span>
            </Link>

            <a className="secondary-button" href="#modules">
              Explore modules
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <span>Workshop status</span>
            <span className="live-tag">
              <span className="live-dot" aria-hidden="true" /> Live
            </span>
          </div>

          <ul className="panel-list">
            {WORKSHOP_STATUS.map((row) => (
              <li key={row.label}>
                <div className="panel-row-main">
                  <strong>{row.label}</strong>
                  <span className="muted">{row.note}</span>
                </div>
                <span className="panel-metric">{row.metric}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="modules" className="landing-section">
        <div className="section-heading">
          <p className="eyebrow">Core modules</p>
          <h2>Everything connected.</h2>
          <p className="muted">
            Each business function works together through a single
            operational system.
          </p>
        </div>

        <div className="module-grid">
          {MODULES.map((mod) => (
            <div className="landing-card" key={mod.id}>
              <span className="card-icon">{mod.icon}</span>
              <h3>{mod.title}</h3>
              <p>{mod.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-flow">
        <div className="section-heading">
          <p className="eyebrow">Connected operations</p>
          <h2>
            From order to
            <br />
            finished product.
          </h2>
        </div>

        <div className="flow">
          {FLOW.map((step, i) => (
            <div className="flow-item" key={step.title}>
              <div className="flow-step">
                <span className="flow-index">{String(i + 1).padStart(2, "0")}</span>
                <strong>{step.title}</strong>
                <p>{step.note}</p>
              </div>
              {i < FLOW.length - 1 && (
                <div className="flow-tick" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <p className="eyebrow">Shiv Furniture Works</p>
        <h2>Ready to control the business flow?</h2>
        <Link className="primary-button" to="/login">
          Enter Mini ERP <span aria-hidden="true">→</span>
        </Link>
      </section>

      <footer className="landing-footer">
        <span>Shiv Furniture Works</span>
        <span>Mini ERP</span>
      </footer>
    </main>
  );
}