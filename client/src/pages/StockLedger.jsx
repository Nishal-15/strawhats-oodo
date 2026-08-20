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
          <Link to="/">← Dashboard</Link>
          <h1>Stock Ledger</h1>
        </div>
      </header>

      <section className="card">
        <h2>Inventory Movement History</h2>

        {loading && (
          <p className="muted">Loading movements...</p>
        )}

        {error && (
          <p className="error">{error}</p>
        )}

        {!loading && !error && movements.length === 0 && (
          <p className="muted">
            No stock movements found.
          </p>
        )}

        {!loading && !error && movements.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Reference</th>
                  <th>Note</th>
                  <th>Performed By</th>
                </tr>
              </thead>

              <tbody>
                {movements.map((movement) => (
                  <tr key={movement._id}>
                    <td>
                      {new Date(
                        movement.createdAt
                      ).toLocaleString()}
                    </td>

                    <td>
                      {movement.product?.name}
                      <br />
                      <span className="muted">
                        {movement.product?.sku}
                      </span>
                    </td>

                    <td>{movement.type}</td>

                    <td>{movement.quantity}</td>

                    <td>
                      {movement.referenceType}
                      {movement.referenceId && (
                        <>
                          <br />
                          <span className="muted">
                            {movement.referenceId}
                          </span>
                        </>
                      )}
                    </td>

                    <td>{movement.note}</td>

                    <td>
                      {movement.performedBy?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}