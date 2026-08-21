import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function StockLedger() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMovements() {
    try {
      const { data } = await api.get("/stock-movements");

      setMovements(data.movements);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load stock movements"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovements();
  }, []);

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/dashboard">← Dashboard</Link>
          <h1>Stock Ledger</h1>
        </div>
      </header>

      <section className="hero">
        <h2>Inventory Movement History</h2>

        <p className="muted">
          Track every stock reservation, receipt,
          consumption, production and adjustment.
        </p>
      </section>

      {loading && (
        <p className="muted">
          Loading stock movements...
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {!loading && !error && (
        <section className="card">
          <h2>Stock Movements</h2>

          {movements.length === 0 ? (
            <p className="muted">
              No stock movements found.
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Reference</th>
                    <th>Performed By</th>
                    <th>Note</th>
                  </tr>
                </thead>

                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement._id}>
                      <td>
                        {movement.createdAt
                          ? new Date(
                              movement.createdAt
                            ).toLocaleString()
                          : "—"}
                      </td>

                      <td>
                        <strong>
                          {movement.product?.name ||
                            "Unknown"}
                        </strong>

                        <br />

                        <span className="muted">
                          {movement.product?.sku ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        {movement.type}
                      </td>

                      <td>
                        {movement.quantity}
                      </td>

                      <td>
                        {movement.referenceType ||
                          "—"}
                      </td>

                      <td>
                        {movement.performedBy?.name ||
                          "—"}
                      </td>

                      <td>
                        {movement.note || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}