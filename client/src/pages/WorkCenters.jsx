import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function WorkCenters() {
  const [workCenters, setWorkCenters] = useState([]);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadWorkCenters() {
    const { data } = await api.get("/work-centers");
    setWorkCenters(data.workCenters);
  }

  useEffect(() => {
    loadWorkCenters().catch((err) => {
      setError(
        err.response?.data?.message ||
          "Failed to load work centers"
      );
    });
  }, []);

  async function createWorkCenter(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/work-centers", {
        name,
        location,
      });

      setName("");
      setLocation("");

      setMessage(
        "Work center created successfully."
      );

      await loadWorkCenters();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create work center"
      );
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/">← Dashboard</Link>
          <h1>Work Centers</h1>
        </div>
      </header>

      <div className="two-column">
        <form
          className="card form-card"
          onSubmit={createWorkCenter}
        >
          <h2>Create Work Center</h2>

          <label>
            Name

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Assembly Line"
              required
            />
          </label>

          <label>
            Location

            <input
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Factory Floor 1"
            />
          </label>

          {error && (
            <p className="error">{error}</p>
          )}

          {message && (
            <p className="success">{message}</p>
          )}

          <button type="submit">
            Create Work Center
          </button>
        </form>

        <section className="card">
          <h2>Work Centers</h2>

          {workCenters.length === 0 ? (
            <p className="muted">
              No work centers yet.
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {workCenters.map(
                    (workCenter) => (
                      <tr key={workCenter._id}>
                        <td>{workCenter.name}</td>
                        <td>
                          {workCenter.location ||
                            "—"}
                        </td>
                        <td>
                          {workCenter.active
                            ? "Active"
                            : "Inactive"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}