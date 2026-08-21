import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSuppliers() {
    const { data } = await api.get("/suppliers");
    setSuppliers(data.suppliers);
  }

  useEffect(() => {
    loadSuppliers().catch((err) => {
      setError(
        err.response?.data?.message ||
          "Failed to load suppliers"
      );
    });
  }, []);

  function update(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function createSupplier(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/suppliers", form);

      setForm(initialForm);
      setMessage("Supplier created successfully.");

      await loadSuppliers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create supplier"
      );
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/dashboard">← Dashboard</Link>
          <h1>Suppliers</h1>
        </div>
      </header>

      <div className="two-column">
        <form
          className="card form-card"
          onSubmit={createSupplier}
        >
          <h2>Create Supplier</h2>

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
            Create Supplier
          </button>
        </form>

        <section className="card">
          <h2>Suppliers</h2>

          {suppliers.length === 0 ? (
            <p className="muted">
              No suppliers yet.
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
                  {suppliers.map((supplier) => (
                    <tr key={supplier._id}>
                      <td>{supplier.name}</td>
                      <td>{supplier.email}</td>
                      <td>{supplier.phone}</td>
                      <td>
                        {supplier.active
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