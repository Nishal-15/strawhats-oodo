import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadCustomers() {
    const { data } = await api.get("/customers");
    setCustomers(data.customers);
  }

  useEffect(() => {
    loadCustomers().catch((err) => {
      setError(
        err.response?.data?.message ||
          "Failed to load customers"
      );
    });
  }, []);

  function update(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function createCustomer(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/customers", form);

      setForm(initialForm);
      setMessage("Customer created successfully.");

      await loadCustomers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create customer"
      );
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/dashboard">← Dashboard</Link>
          <h1>Customers</h1>
        </div>
      </header>

      <div className="two-column">
        <form
          className="card form-card"
          onSubmit={createCustomer}
        >
          <h2>Create Customer</h2>

          <label>
            Name
            <input
              value={form.name}
              onChange={(e) =>
                update("name", e.target.value)
              }
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                update("email", e.target.value)
              }
              required
            />
          </label>

          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) =>
                update("phone", e.target.value)
              }
              required
            />
          </label>

          <label>
            Address
            <textarea
              value={form.address}
              onChange={(e) =>
                update("address", e.target.value)
              }
            />
          </label>

          {error && (
            <p className="error">{error}</p>
          )}

          {message && (
            <p className="success">{message}</p>
          )}

          <button type="submit">
            Create Customer
          </button>
        </form>

        <section className="card">
          <h2>Customers</h2>

          {customers.length === 0 ? (
            <p className="muted">
              No customers yet.
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>
                        {customer.active
                          ? "Active"
                          : "Inactive"}
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