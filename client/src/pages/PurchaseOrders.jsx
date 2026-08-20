import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const emptyItem = {
  productId: "",
  quantity: 1,
};

export default function PurchaseOrders() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([{ ...emptyItem }]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const [
      supplierResponse,
      productResponse,
      orderResponse,
    ] = await Promise.all([
      api.get("/suppliers"),
      api.get("/products"),
      api.get("/purchase-orders"),
    ]);

    setSuppliers(supplierResponse.data.suppliers);
    setProducts(productResponse.data.products);
    setOrders(orderResponse.data.purchaseOrders);
  }

  useEffect(() => {
    loadData().catch((err) => {
      setError(
        err.response?.data?.message ||
          "Failed to load purchase data"
      );
    });
  }, []);

  function updateItem(index, field, value) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      { ...emptyItem },
    ]);
  }

  function removeItem(index) {
    if (items.length === 1) return;

    setItems((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  }

  async function createOrder(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!supplierId) {
      setError("Please select a supplier.");
      return;
    }

    for (const item of items) {
      if (!item.productId) {
        setError(
          "Please select a product for every item."
        );
        return;
      }

      if (Number(item.quantity) <= 0) {
        setError(
          "Quantity must be greater than 0."
        );
        return;
      }
    }

    try {
      await api.post("/purchase-orders", {
        supplierId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      });

      setSupplierId("");
      setItems([{ ...emptyItem }]);

      setMessage(
        "Purchase order created successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create purchase order"
      );
    }
  }

  async function confirmOrder(id) {
    setMessage("");
    setError("");

    try {
      await api.patch(
        `/purchase-orders/${id}/confirm`
      );

      setMessage(
        "Purchase order confirmed successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to confirm purchase order"
      );
    }
  }

  async function receiveOrder(id) {
    setMessage("");
    setError("");

    try {
      await api.patch(
        `/purchase-orders/${id}/receive`
      );

      setMessage(
        "Purchase order received and inventory updated."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to receive purchase order"
      );
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/">← Dashboard</Link>
          <h1>Purchase Orders</h1>
        </div>
      </header>

      <div className="two-column">
        <form
          className="card form-card"
          onSubmit={createOrder}
        >
          <h2>Create Purchase Order</h2>

          <label>
            Supplier

            <select
              value={supplierId}
              onChange={(e) =>
                setSupplierId(e.target.value)
              }
              required
            >
              <option value="">
                Select supplier
              </option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier._id}
                  value={supplier._id}
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </label>

          <h3>Order Items</h3>

          {items.map((item, index) => (
            <div
              key={index}
              className="card"
              style={{ marginBottom: "12px" }}
            >
              <label>
                Product

                <select
                  value={item.productId}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "productId",
                      e.target.value
                    )
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
                      {product.name} — ₹
                      {product.costPrice}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Quantity

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                  required
                />
              </label>

              {items.length > 1 && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    removeItem(index)
                  }
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="secondary"
            onClick={addItem}
          >
            + Add Product
          </button>

          {error && (
            <p className="error">{error}</p>
          )}

          {message && (
            <p className="success">{message}</p>
          )}

          <button type="submit">
            Create Purchase Order
          </button>
        </form>

        <section className="card">
          <h2>Purchase Orders</h2>

          {orders.length === 0 ? (
            <p className="muted">
              No purchase orders yet.
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        {order.supplier?.name}
                      </td>

                      <td>
                        {order.items.map(
                          (item, index) => (
                            <div key={index}>
                              {item.product?.name} ×{" "}
                              {item.quantity}
                            </div>
                          )
                        )}
                      </td>

                      <td>
                        ₹
                        {order.totalAmount.toLocaleString()}
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
                              receiveOrder(
                                order._id
                              )
                            }
                          >
                            Receive
                          </button>
                        )}

                        {order.status === "RECEIVED" && (
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