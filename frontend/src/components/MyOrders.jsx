import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt,
  FaRupeeSign,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaUser,
  FaBoxOpen,
  FaArrowRight,
  FaImage,
  FaLeaf,
} from "react-icons/fa";
import { API_URL } from '../config';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "GET",
        headers: {
          authorization: token,
        },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API_URL}/orders/${orderId}/cancel`,
        {
          method: "DELETE",
          headers: {
            authorization: token,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Order cancelled successfully");
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          color: "warning",
          accent: "#fbbf24",
          bgColor: "rgba(251, 191, 36, 0.1)",
          borderColor: "#fbbf24",
          icon: <FaClock />,
          text: "Order is being prepared",
          label: "Preparing",
        };
      case "Preparing":
        return {
          color: "warning",
          accent: "#fbbf24",
          bgColor: "rgba(251, 191, 36, 0.1)",
          borderColor: "#fbbf24",
          icon: <FaClock />,
          text: "Order is being prepared",
          label: "Preparing",
        };
      case "On the Way":
        return {
          color: "info",
          accent: "#3b82f6",
          bgColor: "rgba(59, 130, 246, 0.1)",
          borderColor: "#3b82f6",
          icon: <FaTruck />,
          text: "Order is on the way",
          label: "On the Way",
        };
      case "Cancelled":
        return {
          color: "danger",
          accent: "#f87171",
          bgColor: "rgba(248, 113, 113, 0.1)",
          borderColor: "#f87171",
          icon: <FaTimes />,
          text: "Order has been cancelled",
          label: "Cancelled",
        };
      case "Delivered":
        return {
          color: "success",
          accent: "#4ade80",
          bgColor: "rgba(74, 222, 128, 0.1)",
          borderColor: "#4ade80",
          icon: <FaCheckCircle />,
          text: "Order delivered successfully",
          label: "Delivered",
        };
      default:
        return {
          color: "secondary",
          accent: "#94a3b8",
          bgColor: "rgba(148, 163, 184, 0.1)",
          borderColor: "#94a3b8",
          icon: <FaShoppingBag />,
          text: "Order status unknown",
          label: "Unknown",
        };
    }
  };

  /* Loading */
  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-orb orders-orb-1" />
        <div className="orders-orb orders-orb-2" />
        <div className="orders-loading">
          <div className="orders-spinner" />
          <h3 className="orders-loading-title">Loading your orders…</h3>
          <p className="orders-loading-sub">Please wait while we fetch your order history</p>
        </div>
      </div>
    );
  }

  /* Main */
  return (
    <div className="orders-page">
      {/* Background orbs */}
      <div className="orders-orb orders-orb-1" />
      <div className="orders-orb orders-orb-2" />

      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

      <div className="orders-wrapper">
        {/* Header */}
        <div className="orders-header">
          <div className="orders-header-left">
            <div className="orders-header-icon">
              <FaShoppingBag />
            </div>
            <div>
              <div className="cart-badge">📦 My Orders</div>
              <h2>Order History</h2>
              <p className="cart-lead">
                {orders.length > 0
                  ? `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`
                  : "Track your delicious orders"}
              </p>
            </div>
          </div>
          <Link to="/productmenu" className="orders-browse-btn">
            Browse Menu <FaArrowRight />
          </Link>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="orders-empty-card">
            <div className="orders-empty-icon">
              <FaLeaf />
            </div>
            <h3>No orders yet</h3>
            <p>Start your delicious journey by ordering from our menu!</p>
            <Link to="/productmenu" className="orders-empty-btn">
              Order Now <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <div
                  key={order._id}
                  className="orders-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Accent bar */}
                  <div
                    className="orders-card-accent"
                    style={{ background: statusConfig.accent }}
                  />

                  {/* Card header */}
                  <div className="orders-card-head">
                    <div className="orders-card-id">
                      <span className="orders-label">Order ID</span>
                      <span className="orders-id-badge">
                        #{order._id.slice(-8)}
                      </span>
                    </div>
                    <div className="orders-card-status">
                      <span className={`orders-status-pill orders-status-${statusConfig.color}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </div>
                    {order.status === "Pending" && (
                      <button
                        className="orders-cancel-btn"
                        onClick={() => cancelOrder(order._id)}
                      >
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="orders-card-body">
                    {/* Delivery info */}
                    <div className="orders-delivery">
                      <div className="orders-section-head">
                        <FaMapMarkerAlt className="orders-section-icon" />
                        <h4>Delivery Details</h4>
                      </div>
                      <div className="orders-detail-items">
                        <div className="orders-detail-item">
                          <div className="orders-detail-icon">
                            <FaUser />
                          </div>
                          <div className="orders-detail-content">
                            <span>Name</span>
                            <p>{order.name}</p>
                          </div>
                        </div>
                        <div className="orders-detail-item">
                          <div className="orders-detail-icon">
                            <FaMapMarkerAlt />
                          </div>
                          <div className="orders-detail-content">
                            <span>Address</span>
                            <p>{order.address}</p>
                          </div>
                        </div>
                        <div className="orders-detail-item">
                          <div className="orders-detail-icon">
                            <FaPhone />
                          </div>
                          <div className="orders-detail-content">
                            <span>Phone</span>
                            <p>{order.mobileNumber}</p>
                          </div>
                        </div>
                        <div className="orders-detail-item">
                          <div className="orders-detail-icon">
                            <FaCalendarAlt />
                          </div>
                          <div className="orders-detail-content">
                            <span>Ordered on</span>
                            <p>
                              {new Date(order.createdAt).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="orders-products">
                      <div className="orders-section-head">
                        <FaBoxOpen className="orders-section-icon" />
                        <h4>Order Items</h4>
                      </div>
                      <div className="orders-product-list">
                        {order.products &&
                          order.products.map((item, idx) => (
                            <div
                              key={item.productId?._id || idx}
                              className="orders-product-row"
                            >
                              <div className="orders-product-img">
                                {item.productId?.image ? (
                                  <img
                                    src={`data:image/png;base64,${item.productId.image}`}
                                    alt={item.productId?.name || "Product"}
                                  />
                                ) : (
                                  <div className="orders-product-noimg">
                                    <FaImage />
                                  </div>
                                )}
                              </div>
                              <div className="orders-product-info">
                                <h5>{item.productId?.name || "Product"}</h5>
                                <div className="orders-product-meta">
                                  <span>
                                    <FaRupeeSign /> {item.productId?.price || "N/A"}
                                  </span>
                                  <span>Qty: {item.qty}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Total */}
                      <div className="orders-total-row">
                        <span>Total Amount</span>
                        <strong>
                          <FaRupeeSign /> {order.totalAmount}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Status banner */}
                  <div
                    className="orders-status-banner"
                    style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.accent }}
                  >
                    <span className="orders-status-banner-icon">
                      {statusConfig.icon}
                    </span>
                    <span>{statusConfig.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;