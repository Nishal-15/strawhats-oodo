import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function ManufacturingOrders() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const [productResponse, orderResponse] =
      await Promise.all([
        api.get("/products"),
        api.get("/manufacturing"),
      ]);

    setProducts(productResponse.data.products);
    setOrders(
      orderResponse.data.manufacturingOrders
    );
  }

  useEffect(() => {
    loadData().catch((err) => {
      setError(
        err.response?.data?.message ||
          "Failed to load manufacturing data"
      );
    });
  }, []);

  async function createOrder(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!productId) {
      setError("Please select a product.");
      return;
    }

    if (Number(quantity) <= 0) {
      setError(
        "Manufacturing quantity must be greater than zero."
      );
      return;
    }

    try {
      await api.post("/manufacturing", {
        productId,
        quantity: Number(quantity),
      });

      setProductId("");
      setQuantity(1);

      setMessage(
        "Manufacturing order created successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create manufacturing order"
      );
    }
  }

  async function confirmOrder(id) {
    setMessage("");
    setError("");

    try {
      await api.patch(
        `/manufacturing/${id}/confirm`
      );

      setMessage(
        "Manufacturing order confirmed and components reserved."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to confirm manufacturing order"
      );
    }
  }

  async function createWorkOrders(id) {
    setMessage("");
    setError("");

    try {
      await api.post(
        `/manufacturing/${id}/work-orders`
      );

      setMessage(
        "Work orders created successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create work orders"
      );
    }
  }

  async function completeOrder(id) {
    setMessage("");
    setError("");

    try {
      await api.patch(
        `/manufacturing/${id}/complete`
      );

      setMessage(
        "Manufacturing order completed successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to complete manufacturing order"
      );
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/">← Dashboard</Link>
          <h1>Manufacturing Orders</h1>
        </div>
      </header>

      <div className="two-column">
        <form
          className="card form-card"
          onSubmit={createOrder}
        >
          <h2>Create Manufacturing Order</h2>

          <label>
            Finished Product

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
            Production Quantity

            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
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
            Create Manufacturing Order
          </button>
        </form>

        <section className="card">
          <h2>Manufacturing Orders</h2>

          {orders.length === 0 ? (
            <p className="muted">
              No manufacturing orders yet.
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Components</th>
                    <th>Operations</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        {order.product?.name}
                      </td>

                      <td>{order.quantity}</td>

                      <td>
                        {order.components.map(
                          (component) => (
                            <div
                              key={component._id}
                            >
                              {component.product?.name} ×{" "}
                              {component.requiredQuantity}
                            </div>
                          )
                        )}
                      </td>

                      <td>
                        {order.operations.map(
                          (operation) => (
                            <div
                              key={operation._id}
                            >
                              {operation.sequence}.{" "}
                              {operation.name}
                              <br />
                              <span className="muted">
                                {operation.workCenter?.name}
                              </span>
                            </div>
                          )
                        )}
                      </td>

                      <td>{order.status}</td>

                      <td>
                        {order.status === "DRAFT" && (
                          <button
                            onClick={() =>
                              confirmOrder(
                                order._id
                              )
                            }
                          >
                            Confirm
                          </button>
                        )}

                        {order.status === "CONFIRMED" && (
                          <button
                            onClick={() =>
                              createWorkOrders(
                                order._id
                              )
                            }
                          >
                            Create Work Orders
                          </button>
                        )}

                        {order.status === "IN_PROGRESS" && (
                          <button
                            onClick={() =>
                              completeOrder(
                                order._id
                              )
                            }
                          >
                            Complete
                          </button>
                        )}

                        {order.status === "COMPLETED" && (
                          <span className="muted">
                            Completed
                          </span>
                        )}
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