import { useCallback, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaClipboardList, FaBoxOpen, FaShieldAlt, FaTruck, FaCheckCircle, FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from "react-icons/fa";

const Adminpanel = () => {
  const [tab, setTab] = useState("orders");

  /* ── Orders state ── */
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const getOrders = useCallback(async () => {
    const res = await fetch("http://localhost:3000/orders/admin/all", {
      method: "GET",
      headers: { "Content-Type": "application/json", authorization: token },
    });
    const data = await res.json();
    setOrders(data);
  }, [token]);

  useEffect(() => {
    (async () => { await getOrders(); })();
  }, [getOrders]);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:3000/orders/admin/status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify({ status }),
    });
    getOrders();
  };

  const statusCounts = orders.reduce((acc, order) => {
    const key = order.status || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const statusClass = (status) =>
    `status-pill status-${status?.toLowerCase().replace(/\s+/g, "-")}`;

  /* ── Products state ── */
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [preview, setPreview] = useState(null);

  const [editName, setEditName] = useState("");
  const editFileInputRef = useRef(null);
  const [editFile, setEditFile] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editActualPrice, setEditActualPrice] = useState("");
  const [editPreview, setEditPreview] = useState(null);
  const [editPopup, setEditPopup] = useState(false);
  const [editId, setEditId] = useState(null);

  const role = localStorage.getItem("role");

  const getProducts = async () => {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    (async()=> {
      getProducts();
    })()
  }, []);

  const addProduct = async () => {
    if (!file) { toast.error("Please select a file before uploading."); return; }
    if (!name) { toast.error("Please fill name before uploading."); return; }
    if (!description) { toast.error("Please write description before uploading."); return; }
    if (!price) { toast.error("Please set price before uploading."); return; }
    if (!actualPrice) { toast.error("Please set actual price before uploading."); return; }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("actualPrice", actualPrice);
    formData.append("image", file);

    const res = await fetch("http://localhost:3000/products", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Product Added Successfully");
      setFile(null); setName(""); setDescription(""); setPrice(""); setActualPrice(""); setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    getProducts();
  };

  const updateProduct = async () => {
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("description", editDescription);
    formData.append("price", editPrice);
    formData.append("actualPrice", editActualPrice);
    if (editFile) formData.append("image", editFile);
    await fetch(`http://localhost:3000/products/${editId}`, {
      method: "PUT",
      body: formData,
    });
    toast.success("Product Updated Successfully");
    setEditPopup(false); setEditFile(null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
    getProducts();
  };

  const handleEdit = (product) => {
    setEditPreview(`data:image/png;base64,${product.image}`);
    setEditFile(null);
    setEditName(product.name);
    setEditDescription(product.description);
    setEditPrice(product.price);
    setEditActualPrice(product.actualPrice);
    setEditId(product._id);
    setEditPopup(true);
  };

  const deleteProduct = async (_id) => {
    const confirmDelete = window.confirm("Confirm to Delete");
    if (!confirmDelete) return;
    await fetch(`http://localhost:3000/products/${_id}`, { method: "DELETE" });
    toast.success("Product Deleted Successfully");
    setProducts((prev) => prev.filter((item) => item._id !== _id));
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setPreview(URL.createObjectURL(selectedFile));
    setFile(selectedFile);
  };

  const handleEditChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      if (editFileInputRef.current) editFileInputRef.current.value = "";
      return;
    }
    setEditPreview(URL.createObjectURL(selectedFile));
    setEditFile(selectedFile);
  };

  /* ── Guest state ── */
  if (!token || role !== "admin") {
    return (
      <div className="admin-page">
        <div className="admin-orb admin-orb-1" />
        <div className="admin-orb admin-orb-2" />
        <div className="admin-guest-card">
          <div className="admin-guest-icon"><FaShieldAlt /></div>
          <h2>Admin Access Required</h2>
          <p>You need admin privileges to access this dashboard. Please sign in with an admin account.</p>
        </div>
      </div>
    );
  }

  /* ── Main admin ── */
  return (
    <div className="admin-page">
      <Toaster />
      <div className="admin-orb admin-orb-1" />
      <div className="admin-orb admin-orb-2" />

      <div className="admin-wrapper">
        {/* ── Header ── */}
        <header className="admin-header">
          <div className="admin-header-left">
            <div className="admin-header-icon"><FaShieldAlt /></div>
            <div>
              <p className="admin-eyebrow">Dashboard</p>
              <h2>Admin Panel</h2>
              <p className="admin-subtitle">Manage orders, products, and delivery status from one place.</p>
            </div>
          </div>
          <div className="admin-summary">
            <div className="admin-summary-card">
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </div>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="admin-summary-card">
                <span>{status}</span>
                <strong>{count}</strong>
              </div>
            ))}
            <div className="admin-summary-card">
              <span>Products</span>
              <strong>{products.length}</strong>
            </div>
          </div>
        </header>

        {/* ── Tab switcher ── */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === "orders" ? "active" : ""}`}
            onClick={() => setTab("orders")}
          >
            <FaClipboardList /> Orders
          </button>
          <button
            className={`admin-tab ${tab === "products" ? "active" : ""}`}
            onClick={() => setTab("products")}
          >
            <FaBoxOpen /> Products
          </button>
          <div
            className="admin-tab-indicator"
            style={{ transform: tab === "products" ? "translateX(100%)" : "translateX(0)" }}
          />
        </div>

        {/* ════════════ ORDERS TAB ════════════ */}
        {tab === "orders" && (
          <div className="admin-grid">
            {orders.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon"><FaClipboardList /></div>
                <h3>No orders yet</h3>
                <p>Orders will appear here once customers start placing them.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="admin-card">
                  <div className="admin-card-header">
                    <div className="admin-card-user">
                      <p><strong>{order.userId?.name || "Unknown user"}</strong></p>
                      <p>{order.address}</p>
                      <p>{order.mobileNumber}</p>
                    </div>
                    <div className="admin-card-meta">
                      <span className="admin-order-id">#{order._id?.slice(-6)}</span>
                      <div className={statusClass(order.status)}>{order.status}</div>
                      <div className="admin-total">₹{order.totalAmount}</div>
                    </div>
                  </div>

                  <div className="admin-card-body">
                    {order.products?.map((item) => (
                      <div key={item._id} className="admin-product-row">
                        <img
                          src={`data:image/png;base64,${item.productId?.image}`}
                          alt={item.productId?.name}
                        />
                        <div className="admin-product-details">
                          <h4>{item.productId?.name}</h4>
                          <p>Price ₹{item.productId?.price}</p>
                          <p>Qty: {item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-actions">
                    <button className="admin-status-btn admin-status-preparing" onClick={() => updateStatus(order._id, "Preparing")}>
                      <FaTruck /> Preparing
                    </button>
                    <button className="admin-status-btn admin-status-ontheway" onClick={() => updateStatus(order._id, "On the Way")}>
                      <FaTruck /> On the Way
                    </button>
                    <button className="admin-status-btn admin-status-delivered" onClick={() => updateStatus(order._id, "Delivered")}>
                      <FaCheckCircle /> Delivered
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ════════════ PRODUCTS TAB ════════════ */}
        {tab === "products" && (
          <>
            {/* ── Add Product Form ── */}
            <form
              onSubmit={(e) => { e.preventDefault(); addProduct(); }}
              className="admin-add-card"
            >
              <div className="admin-add-accent" />
              <div className="admin-add-header">
                <FaPlus className="admin-add-icon" />
                <h3>Add New Product</h3>
              </div>
              <div className="admin-add-body">
                {/* Image upload */}
                <div className="admin-upload-area" onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" onChange={handleChange} hidden />
                  {preview ? (
                    <img src={preview} alt="Preview" className="admin-upload-preview" />
                  ) : (
                    <div className="admin-upload-placeholder">
                      <FaImage />
                      <span>Click to upload image</span>
                      <small>Max 5MB</small>
                    </div>
                  )}
                </div>

                {/* Form fields */}
                <div className="admin-add-fields">
                  <div className="admin-field">
                    <label>Product Name</label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-field">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-field-row">
                    <div className="admin-field">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        placeholder="Selling price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                      />
                    </div>
                    <div className="admin-field">
                      <label>Actual Price (₹)</label>
                      <input
                        type="text"
                        placeholder="Original price"
                        value={actualPrice}
                        onChange={(e) => setActualPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="admin-add-submit">
                    <FaPlus /> Add Product
                  </button>
                </div>
              </div>
            </form>

            {/* ── Product List ── */}
<br/>
<br/>
<center> <h2 className="fw-bold"> Product List </h2>  </center> <br/>
            <div className={`admin-products-grid ${editPopup ? "admin-blur" : ""}`}>
            
              {products.map((item) => (
                <div key={item._id} className="admin-product-card">
                  <img
                    src={`data:image/png;base64,${item.image}`}
                    alt={item.name}
                    className="admin-product-card-img"
                  />
                  <div className="admin-product-card-body">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <div className="admin-product-card-pricing">
                      <span className="admin-price-original">₹{item.actualPrice}</span>
                      <span className="admin-price-selling">₹{item.price}</span>
                    </div>
                    <div className="admin-product-card-actions">
                      <button className="admin-action-btn admin-action-edit" onClick={() => handleEdit(item)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="admin-action-btn admin-action-delete" onClick={() => deleteProduct(item._id)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Edit Popup ── */}
            {editPopup && (
              <div className="admin-popup-overlay" onClick={() => setEditPopup(false)}>
                <form
                  className="admin-popup"
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={(e) => { e.preventDefault(); updateProduct(); }}
                >
                  <button type="button" className="admin-popup-close" onClick={() => setEditPopup(false)}>
                    <FaTimes />
                  </button>
                  <h3>Edit Product</h3>
                  <div className="admin-popup-upload" onClick={() => editFileInputRef.current?.click()}>
                    <input ref={editFileInputRef} type="file" onChange={handleEditChange} hidden />
                    {editPreview ? (
                      <img src={editPreview} alt="Preview" className="admin-upload-preview" />
                    ) : (
                      <div className="admin-upload-placeholder">
                        <FaImage />
                        <span>Change image</span>
                      </div>
                    )}
                  </div>
                  <div className="admin-popup-fields">
                    <div className="admin-field">
                      <label>Name</label>
                      <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                    </div>
                    <div className="admin-field">
                      <label>Description</label>
                      <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />
                    </div>
                    <div className="admin-field-row">
                      <div className="admin-field">
                        <label>Price (₹)</label>
                        <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required min="0" />
                      </div>
                      <div className="admin-field">
                        <label>Actual Price (₹)</label>
                        <input type="text" value={editActualPrice} onChange={(e) => setEditActualPrice(e.target.value)} required />
                      </div>
                    </div>
                    <div className="admin-popup-btns">
                      <button type="submit" className="admin-add-submit">
                        <FaEdit /> Save Changes
                      </button>
                      <button type="button" className="admin-cancel-btn" onClick={() => setEditPopup(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Adminpanel;