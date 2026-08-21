import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const emptyComponent = {
  productId: "",
  quantity: 1,
};

const emptyOperation = {
  name: "",
  durationMinutes: 30,
  sequence: 1,
};

export default function BoMs() {
  const [products, setProducts] = useState([]);
  const [boms, setBoms] = useState([]);
  const [workCenters, setWorkCenters] = useState([]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [components, setComponents] = useState([
    { ...emptyComponent },
  ]);

  const [operations, setOperations] = useState([
    { ...emptyOperation },
  ]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
  const [
    productResponse,
    bomResponse,
    workCenterResponse,
  ] = await Promise.all([
    api.get("/products"),
    api.get("/boms"),
    api.get("/work-centers"),
  ]);

  setProducts(productResponse.data.products);
  setBoms(bomResponse.data.boms);
  setWorkCenters(workCenterResponse.data.workCenters);
}

async function assignWorkCenter(operationId, workCenterId) {
  setMessage("");
  setError("");

  if (!workCenterId) return;

  try {
    await api.patch(
      "/boms/operations/work-centers",
      {
        operations: [
          {
            operationId,
            workCenterId,
          },
        ],
      }
    );

    setMessage(
      "Work center assigned successfully."
    );

    await loadData();
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Failed to assign work center"
    );
  }
}

  useEffect(() => {
    loadData().catch((err) => {
      setError(
        err.response?.data?.message ||
          "Failed to load BoMs"
      );
    });
  }, []);

  function updateComponent(index, field, value) {
    setComponents((current) =>
      current.map((component, componentIndex) =>
        componentIndex === index
          ? {
              ...component,
              [field]: value,
            }
          : component
      )
    );
  }

  function addComponent() {
    setComponents((current) => [
      ...current,
      { ...emptyComponent },
    ]);
  }

  function removeComponent(index) {
    if (components.length === 1) return;

    setComponents((current) =>
      current.filter(
        (_, componentIndex) =>
          componentIndex !== index
      )
    );
  }

  function updateOperation(index, field, value) {
    setOperations((current) =>
      current.map((operation, operationIndex) =>
        operationIndex === index
          ? {
              ...operation,
              [field]: value,
            }
          : operation
      )
    );
  }

  function addOperation() {
    setOperations((current) => [
      ...current,
      {
        ...emptyOperation,
        sequence: current.length + 1,
      },
    ]);
  }

  function removeOperation(index) {
    if (operations.length === 1) return;

    setOperations((current) =>
      current
        .filter(
          (_, operationIndex) =>
            operationIndex !== index
        )
        .map((operation, operationIndex) => ({
          ...operation,
          sequence: operationIndex + 1,
        }))
    );
  }

  async function createBoM(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!productId) {
      setError("Please select a finished product.");
      return;
    }

    for (const component of components) {
      if (!component.productId) {
        setError(
          "Please select a product for every component."
        );
        return;
      }

      if (Number(component.quantity) <= 0) {
        setError(
          "Component quantity must be greater than 0."
        );
        return;
      }
    }

    for (const operation of operations) {
      if (!operation.name.trim()) {
        setError(
          "Every operation requires a name."
        );
        return;
      }

      if (Number(operation.durationMinutes) <= 0) {
        setError(
          "Operation duration must be greater than 0."
        );
        return;
      }
    }

    try {
      await api.post("/boms", {
        productId,
        quantity: Number(quantity),

        components: components.map((component) => ({
          productId: component.productId,
          quantity: Number(component.quantity),
        })),

        operations: operations.map((operation) => ({
          name: operation.name.trim(),
          durationMinutes:
            Number(operation.durationMinutes),
          sequence: Number(operation.sequence),
        })),
      });

      setProductId("");
      setQuantity(1);

      setComponents([
        { ...emptyComponent },
      ]);

      setOperations([
        { ...emptyOperation },
      ]);

      setMessage("BoM created successfully.");

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create BoM"
      );
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/dashboard">← Dashboard</Link>
          <h1>Bill of Materials</h1>
        </div>
      </header>

      <div className="two-column">
        <form
          className="card form-card"
          onSubmit={createBoM}
        >
          <h2>Create BoM</h2>

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
                Select finished product
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

          <h3>Components</h3>

          {components.map((component, index) => (
            <div
              key={index}
              className="card"
              style={{ marginBottom: "12px" }}
            >
              <label>
                Component Product

                <select
                  value={component.productId}
                  onChange={(e) =>
                    updateComponent(
                      index,
                      "productId",
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Select component
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
                Quantity

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={component.quantity}
                  onChange={(e) =>
                    updateComponent(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                  required
                />
              </label>

              {components.length > 1 && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    removeComponent(index)
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
            onClick={addComponent}
          >
            + Add Component
          </button>

          <h3>Operations</h3>

          {operations.map((operation, index) => (
            <div
              key={index}
              className="card"
              style={{ marginBottom: "12px" }}
            >
              <label>
                Operation Name

                <input
                  value={operation.name}
                  onChange={(e) =>
                    updateOperation(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Assembly"
                  required
                />
              </label>

              <label>
                Duration (minutes)

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={operation.durationMinutes}
                  onChange={(e) =>
                    updateOperation(
                      index,
                      "durationMinutes",
                      e.target.value
                    )
                  }
                  required
                />
              </label>

              <label>
                Sequence

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={operation.sequence}
                  onChange={(e) =>
                    updateOperation(
                      index,
                      "sequence",
                      e.target.value
                    )
                  }
                  required
                />
              </label>

              {operations.length > 1 && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    removeOperation(index)
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
            onClick={addOperation}
          >
            + Add Operation
          </button>

          {error && (
            <p className="error">{error}</p>
          )}

          {message && (
            <p className="success">{message}</p>
          )}

          <button type="submit">
            Create BoM
          </button>
        </form>

        <section className="card">
          <h2>Existing BoMs</h2>

          {boms.length === 0 ? (
            <p className="muted">
              No BoMs yet.
            </p>
          ) : (
            <div>
              {boms.map((bom) => (
                <div
                  key={bom._id}
                  className="card"
                  style={{ marginBottom: "16px" }}
                >
                  <h3>
                    {bom.product?.name}
                  </h3>

                  <p className="muted">
                    SKU: {bom.product?.sku}
                  </p>

                  <p>
                    Production quantity:{" "}
                    <strong>{bom.quantity}</strong>
                  </p>

                  <h4>Components</h4>

                  {bom.components.map(
                    (component) => (
                      <p key={component._id}>
                        {component.product?.name} ×{" "}
                        {component.quantity}
                      </p>
                    )
                  )}

                  <h4>Operations</h4>

{bom.operations.map((operation) => (
  <div
    key={operation._id}
    className="card"
    style={{ marginBottom: "10px" }}
  >
    <p>
      <strong>
        {operation.sequence}. {operation.name}
      </strong>
    </p>

    <p className="muted">
      Duration: {operation.durationMinutes} minutes
    </p>

    <label>
      Work Center

      <select
        value={operation.workCenter?._id || ""}
        onChange={(e) =>
          assignWorkCenter(
            operation._id,
            e.target.value
          )
        }
      >
        <option value="">
          Select work center
        </option>

        {workCenters.map((workCenter) => (
          <option
            key={workCenter._id}
            value={workCenter._id}
          >
            {workCenter.name}
          </option>
        ))}
      </select>
    </label>
  </div>
))}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}