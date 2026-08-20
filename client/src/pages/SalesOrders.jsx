import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const emptyItem = {
  productId: "",
  quantity: 1,
};

export default function SalesOrders() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([emptyItem]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const [
      customerResponse,
      productResponse,
      orderResponse,
    ] = await Promise.all([
      api.get("/customers"),
      api.get("/products"),
      api.get("/sales-orders"),
    ]);

    setCustomers(customerResponse.data.customers);
    setProducts(productResponse.data.products);
    setOrders(orderResponse.data.salesOrders);
  }

  useEffect(() => {
    loadData().catch((err) => {
      setError(
        err.response?.data?.message ||
          "Failed to load sales data"
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
      {
        ...emptyItem,
      },
    ]);
  }

  function removeItem(index) {
    if (items.length === 1) {
      return;
    }

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

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    for (const item of items) {
      if (!item.productId) {
        setError("Please select a product for every item.");
        return;
      }

      if (Number(item.quantity) <= 0) {
        setError("Quantity must be greater than 0.");
        return;
      }
    }

    try {
      await api.post("/sales-orders", {
        customerId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      });

      setCustomerId("");
      setItems([{ ...emptyItem }]);

      setMessage("Sales order created successfully.");

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create sales order"
      );
    }
  }

  async function confirmOrder(id) {
    setMessage("");
    setError("");

    try {
      await api.patch(
        `/sales-orders/${id}/confirm`
      );

      setMessage(
        "Sales order confirmed and stock reserved."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to confirm sales order"
      );
    }
  }

  async function deliverOrder(id) {
    setMessage("");
    setError("");

    try {
      await api.patch(
        `/sales-orders/${id}/deliver`
      );

      setMessage(
        "Sales order delivered successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to deliver sales order"
      );
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/">← Dashboard</Link>
          <h1>Sales Orders</h1>
        </div>
      </header>

      <div className="two-column">
        <form
          className="card form-card"
          onSubmit={createOrder}
        >
          <h2>Create Sales Order</h2>

          <label>
            Customer

            <select
              value={customerId}
              onChange={(e) =>
                setCustomerId(e.target.value)
              }
              required
            >
              <option value="">
                Select customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer._id}
                  value={customer._id}
                >
                  {customer.name}
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
                      {product.salesPrice}
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
            Create Sales Order
          </button>
        </form>

        <section className="card">
          <h2>Sales Orders</h2>

          {orders.length === 0 ? (
            <p className="muted">
              No sales orders yet.
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
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
                        {order.customer?.name}
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
                              deliverOrder(
                                order._id
                              )
                            }
                          >
                            Deliver
                          </button>
                        )}

                        {order.status === "DELIVERED" && (
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