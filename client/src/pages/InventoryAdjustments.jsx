import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function InventoryAdjustments() {
  const [products, setProducts] = useState([]);
  const [adjustments, setAdjustments] = useState([]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const [productsResponse, movementsResponse] =
      await Promise.all([
        api.get("/products"),
        api.get("/stock-movements"),
      ]);

    setProducts(productsResponse.data.products);
    setAdjustments(
      movementsResponse.data.stockMovements || []
    );
  }

  useEffect(() => {
    loadData().catch((err) => {
      setError(
        err.response?.data?.message ||
          "Failed to load inventory data"
      );
    });
  }, []);

  async function createAdjustment(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!productId) {
      setError("Please select a product.");
      return;
    }

    if (!quantity || Number(quantity) === 0) {
      setError(
        "Adjustment quantity cannot be zero."
      );
      return;
    }

    if (!reason.trim()) {
      setError("Adjustment reason is required.");
      return;
    }

    try {
      await api.post(
        "/inventory-adjustments",
        {
          productId,
          quantity: Number(quantity),
          reason: reason.trim(),
        }
      );

      setProductId("");
      setQuantity("");
      setReason("");

      setMessage(
        "Inventory adjusted successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to adjust inventory"
      );
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/dashboard">← Dashboard</Link>
          <h1>Inventory Adjustments</h1>
        </div>
      </header>

      <div className="two-column">
        <form
          className="card form-card"
          onSubmit={createAdjustment}
        >
          <h2>Adjust Inventory</h2>

          <p className="muted">
            Use a positive quantity to add stock and a
            negative quantity to remove stock.
          </p>

          <label>
            Product

            <select
              value={productId}
              onChange={(e) =>
                setProductId(e.target.value)
              }
              required
            >
              <option value="">
                Select product
              </option>

              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                >
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </label>

          <label>
            Adjustment Quantity

            <input
              type="number"
              step="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder="Example: +10 or -5"
              required
            />
          </label>

          <label>
            Reason

            <input
              type="text"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              placeholder="Stock count correction"
              required
            />
          </label>

          {error && (
            <p className="error">{error}</p>
          )}

          {message && (
            <p className="success">{message}</p>
          )}

          <button type="submit">
            Adjust Inventory
          </button>
        </form>

        <section className="card">
          <h2>Recent Stock Movements</h2>

          {adjustments.length === 0 ? (
            <p className="muted">
              No stock movements yet.
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {adjustments.map((movement) => (
                    <tr key={movement._id}>
                      <td>
                        {movement.product?.name ||
                          "—"}
                      </td>

                      <td>{movement.type}</td>

                      <td>
                        {movement.quantity}
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
      </div>
    </main>
  );
}