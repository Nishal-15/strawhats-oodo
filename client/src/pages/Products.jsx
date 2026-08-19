import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const initialForm = {
  sku: "",
  name: "",
  description: "",
  salesPrice: 0,
  costPrice: 0,
  stockQuantity: 0,
  procurementStrategy: "MTS",
  procurementType: "PURCHASE",
  vendorName: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProducts() {
    const { data } = await api.get("/products");
    setProducts(data.products);
  }

  useEffect(() => {
    loadProducts().catch((err) => setError(err.response?.data?.message || "Failed to load products"));
  }, []);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function createProduct(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/products", {
        ...form,
        salesPrice: Number(form.salesPrice),
        costPrice: Number(form.costPrice),
        stockQuantity: Number(form.stockQuantity),
      });
      setForm(initialForm);
      setMessage("Product created successfully.");
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <Link to="/">← Dashboard</Link>
          <h1>Products</h1>
        </div>
      </header>

      <div className="two-column">
        <form className="card form-card" onSubmit={createProduct}>
          <h2>Create Product</h2>

          <label>SKU<input value={form.sku} onChange={(e) => update("sku", e.target.value)} required /></label>
          <label>Name<input value={form.name} onChange={(e) => update("name", e.target.value)} required /></label>
          <label>Description<textarea value={form.description} onChange={(e) => update("description", e.target.value)} /></label>

          <div className="form-grid">
            <label>Sales Price<input type="number" min="0" step="0.01" value={form.salesPrice} onChange={(e) => update("salesPrice", e.target.value)} /></label>
            <label>Cost Price<input type="number" min="0" step="0.01" value={form.costPrice} onChange={(e) => update("costPrice", e.target.value)} /></label>
            <label>Opening Stock<input type="number" min="0" step="1" value={form.stockQuantity} onChange={(e) => update("stockQuantity", e.target.value)} /></label>
          </div>

          <div className="form-grid">
            <label>
              Strategy
              <select value={form.procurementStrategy} onChange={(e) => update("procurementStrategy", e.target.value)}>
                <option value="MTS">MTS — Make To Stock</option>
                <option value="MTO">MTO — Make To Order</option>
              </select>
            </label>

            <label>
              Procurement
              <select value={form.procurementType} onChange={(e) => update("procurementType", e.target.value)}>
                <option value="PURCHASE">Purchase</option>
                <option value="MANUFACTURE">Manufacture</option>
              </select>
            </label>
          </div>

          {form.procurementType === "PURCHASE" && (
            <label>Vendor<input value={form.vendorName} onChange={(e) => update("vendorName", e.target.value)} /></label>
          )}

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button>Create Product</button>
        </form>

        <section className="card">
          <h2>Product Inventory</h2>
          {products.length === 0 ? (
            <p className="muted">No products yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>SKU</th><th>Product</th><th>On Hand</th><th>Reserved</th><th>Free</th><th>Strategy</th></tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.sku}</td>
                      <td>{product.name}</td>
                      <td>{product.stock.onHand}</td>
                      <td>{product.stock.reserved}</td>
                      <td>{product.freeToUse}</td>
                      <td>{product.procurementStrategy}</td>
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
