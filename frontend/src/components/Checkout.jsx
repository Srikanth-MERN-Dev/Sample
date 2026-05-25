import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaShoppingBag,
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaLeaf,
  FaBoxOpen,
  FaSpinner,
  FaImage,
} from "react-icons/fa";
import { API_URL } from '../config';

const Checkout = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productId = searchParams.get("productId");

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${productId}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [productId]);

  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login before placing an order.");
      navigate("/login");
      return;
    }

    if (!address.trim() || !mobileNumber.trim()) {
      toast.error("Please enter your address and mobile number.");
      return;
    }

    setIsLoading(true);
    try {
      const body = { name, address, mobileNumber };
      if (productId) {
        body.productId = productId;
      }

      const res = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      toast.success(data.message);
      if (res.ok) {
        navigate("/orders");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      {/* Background orbs */}
      <div className="checkout-orb checkout-orb-1" />
      <div className="checkout-orb checkout-orb-2" />

      <Toaster />

      <div className="checkout-wrapper">
        {/* ── Header ── */}
        <div className="checkout-header">
          <div className="checkout-header-left">
            <div className="checkout-header-icon">
              <FaShoppingBag />
            </div>
            <div>
              <div className="cart-badge">🛍️ Checkout</div>
              <h2>{productId ? "Buy Now Checkout" : "Checkout"}</h2>
              <p className="cart-lead">
                Fill in your delivery details to place your order.
              </p>
            </div>
          </div>
        </div>

        {/* ── Product preview (Buy Now) ── */}
        {productId && product ? (
          <div className="checkout-product-card">
            <div className="checkout-product-img">
              {product.image ? (
                <img
                  src={`data:image/png;base64, ${product.image}`}
                  alt={product.name}
                />
              ) : (
                <div className="checkout-product-noimg">
                  <FaImage />
                </div>
              )}
            </div>
            <div className="checkout-product-info">
              <h4>{product.name}</h4>
              <p className="checkout-product-price">₹{product.price}</p>
              <div className="checkout-product-meta">
                <span className="checkout-product-qty">
                  <FaBoxOpen /> Qty: 1
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Two-column layout ── */}
        <div className="checkout-grid">
          {/* ── Delivery form ── */}
          <div className="checkout-form-card">
            <div className="checkout-form-accent" />
            <div className="checkout-section-title">
              <FaTruck className="checkout-section-icon" />
              <h3>Delivery Details</h3>
            </div>

            <div className="checkout-fields">
              {/* Name */}
              <div className="checkout-field">
                <div className="checkout-field-icon">
                  <FaUser />
                </div>
                <div className="checkout-field-input">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="checkout-field checkout-field-textarea">
                <div className="checkout-field-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="checkout-field-input">
                  <label>Delivery Address</label>
                  <textarea
                    placeholder="Enter Your Full Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="checkout-field">
                <div className="checkout-field-icon">
                  <FaPhone />
                </div>
                <div className="checkout-field-input">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Enter Your Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Order summary ── */}
          <div className="checkout-summary-card">
            <div className="checkout-summary-accent" />
            <h3 className="checkout-summary-title">Order Summary</h3>

            <div className="checkout-summary-rows">
              {productId && product ? (
                <>
                  <div className="checkout-summary-row">
                    <span>Subtotal (1 item)</span>
                    <strong>₹{product.price}</strong>
                  </div>
                  <div className="checkout-summary-row">
                    <span>Delivery</span>
                    <span className="summary-free">FREE</span>
                  </div>
                  <div className="checkout-summary-row checkout-summary-total">
                    <span>Total</span>
                    <strong>₹{product.price}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="checkout-summary-row">
                    <span>Subtotal</span>
                    <strong>—</strong>
                  </div>
                  <div className="checkout-summary-row">
                    <span>Delivery</span>
                    <span className="summary-free">FREE</span>
                  </div>
                  <div className="checkout-summary-row checkout-summary-total">
                    <span>Total</span>
                    <strong>Cart Total</strong>
                  </div>
                </>
              )}
            </div>

            {/* Perks */}
            <div className="cart-summary-perks">
              <div className="cart-perk">
                <FaTruck className="cart-perk-icon" />
                <span>Free Delivery</span>
              </div>
              <div className="cart-perk">
                <FaShieldAlt className="cart-perk-icon" />
                <span>Secure Payment</span>
              </div>
              <div className="cart-perk">
                <FaLeaf className="cart-perk-icon" />
                <span>100% Veg</span>
              </div>
            </div>

            {/* Place order */}
            <button
              className="checkout-place-btn"
              onClick={placeOrder}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="checkout-btn-loading">
                  <FaSpinner className="checkout-spinner-icon" /> Placing Order…
                </span>
              ) : (
                <>
                  Place Order <FaArrowRight />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;