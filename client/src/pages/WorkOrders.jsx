import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadWorkOrders() {
    const { data } = await api.get("/work-orders");
    setWorkOrders(data.workOrders);
  }

  useEffect(() => {
    loadWorkOrders().catch((err) => {
      setError(
        err.response?.data?.message ||
          "Failed to load work orders"
      );
    });
  }, []);

  async function startWorkOrder(id) {
    setError("");
    setMessage("");

    try {
      await api.patch(`/work-orders/${id}/start`);

      setMessage(
        "Work order started successfully."
      );

      await loadWorkOrders();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to start work order"
      );
    }
  }

  async function completeWorkOrder(id) {
    setError("");
    setMessage("");

    try {
      await api.patch(
        `/work-orders/${id}/complete`
      );

      setMessage(
        "Work order completed successfully."
      );

      await loadWorkOrders();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to complete work order"
      );
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/dashboard">← Dashboard</Link>
          <h1>Work Orders</h1>
        </div>
      </header>

      {error && (
        <p className="error">{error}</p>
      )}

      {message && (
        <p className="success">{message}</p>
      )}

      <section className="card">
        <h2>Production Work Orders</h2>

        {workOrders.length === 0 ? (
          <p className="muted">
            No work orders yet.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Operation</th>
                  <th>Sequence</th>
                  <th>Duration</th>
                  <th>Work Center</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {workOrders.map((workOrder) => (
                  <tr key={workOrder._id}>
                    <td>{workOrder.name}</td>

                    <td>
                      {workOrder.sequence}
                    </td>

                    <td>
                      {workOrder.durationMinutes} min
                    </td>

                    <td>
                      {workOrder.workCenter?.name ||
                        "—"}
                    </td>

                    <td>
                      {workOrder.status}
                    </td>

                    <td>
                      {workOrder.status ===
                        "PENDING" && (
                        <button
                          onClick={() =>
                            startWorkOrder(
                              workOrder._id
                            )
                          }
                        >
                          Start
                        </button>
                      )}

                      {workOrder.status ===
                        "IN_PROGRESS" && (
                        <button
                          onClick={() =>
                            completeWorkOrder(
                              workOrder._id
                            )
                          }
                        >
                          Complete
                        </button>
                      )}

                      {workOrder.status ===
                        "COMPLETED" && (
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
    </main>
  );
}