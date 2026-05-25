import { useEffect, useCallback } from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart, FaMinus, FaPlus, FaArrowRight, FaLeaf, FaTruck, FaShieldAlt, FaLock, FaTimes } from "react-icons/fa";
import { API_URL } from '../config';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getCart = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { authorization: token },
      });
      const data = await res.json();
      setCart(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    }
  }, [token]);

  useEffect(() => {
    (async () => { await getCart(); })();
  }, [getCart]);

  const updateQty = async (productId, type) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify({ productId, type }),
    });
    getCart();
  };

  const total = cart.reduce((acc, item) => {
    const price = item?.productId?.price ?? 0;
    const qty = item?.qty ?? 0;
    return acc + price * qty;
  }, 0);

  const totalItems = cart.reduce((acc, item) => acc + (item?.qty ?? 0), 0);

  const removeItem = async (id) => {
    const token = localStorage.getItem("token");
    if (!id) return;
    await fetch(`${API_URL}/cart/remove/${id}`, {
      method: "DELETE",
      headers: { authorization: token },
    });
    getCart();
  };

  /* ── Guest state ── */
  if (!token) {
    return (
      <div className="cart-page">
        <div className="cart-orb cart-orb-1" />
        <div className="cart-orb cart-orb-2" />
        <div className="cart-guest-card">
          <div className="cart-guest-icon">
            <FaShoppingCart />
          </div>
          <h2>Your Cart Awaits</h2>
          <p>Sign in to view your cart, add delicious items, and place your order.</p>
          <Link to="/login" className="cart-guest-btn">
            <FaLock /> Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  /* ── Main cart ── */
  return (
    <div className="cart-page">
      {/* Background orbs */}
      <div className="cart-orb cart-orb-1" />
      <div className="cart-orb cart-orb-2" />

      <div className="cart-wrapper">
        {/* ── Header ── */}
        <div className="cart-header">
          <div className="cart-header-left">
            <div className="cart-header-icon">
              <FaShoppingCart />
            </div>
            <div>
              <div className="cart-badge">🛒 Your Cart</div>
              <h2>Shopping Basket</h2>
              <p className="cart-lead">
                {cart.length > 0
                  ? `${totalItems} item${totalItems !== 1 ? "s" : ""} ready for checkout`
                  : "Add some delicious items to get started"}
              </p>
            </div>
          </div>
          <div className="cart-overview-card">
            <span>Items</span>
            <strong>{cart.length}</strong>
          </div>
        </div>

        {/* ── Empty state ── */}
        {cart.length === 0 ? (
          <div className="cart-empty-card">
            <div className="cart-empty-icon">
              <FaLeaf />
            </div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet. Explore our menu and find something delicious!</p>
            <Link to="/productmenu" className="cart-empty-btn">
              Browse Menu <FaArrowRight />
            </Link>
          </div>
        ) : (
          <>
            {/* ── Cart items ── */}
            <div className="cart-list">
              {cart.map((item, index) => {
                const product = item?.productId || {};
                const productId = product._id || item?.productId;
                const qty = item?.qty ?? 0;
                const lineTotal = (product.price ?? 0) * qty;

                return (
                  <div key={productId || index} className="cart-item-card">
                    <div className="cart-item-image">
                      <img
                        src={
                          product.image
                            ? `data:image/png;base64, ${product.image}`
                            : "https://via.placeholder.com/320x320.png?text=No+Image"
                        }
                        alt={product.name || "Unknown product"}
                      />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <h3>{product.name || "Unknown product"}</h3>
                        <button
                          className="cart-item-remove"
                          onClick={() => removeItem(productId)}
                          disabled={!productId}
                          title="Remove item"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <p className="cart-item-desc">
                        {product.description || "A tasty item waiting for you."}
                      </p>
                      <div className="cart-item-bottom">
                        <div className="qty-controls">
                          <button
                            onClick={() => updateQty(productId, "dec")}
                            className="qty-btn"
                            disabled={!productId || qty <= 1}
                            aria-label="Decrease quantity"
                          >
                            <FaMinus />
                          </button>
                          <span className="qty-value">{qty}</span>
                          <button
                            onClick={() => updateQty(productId, "inc")}
                            className="qty-btn"
                            disabled={!productId}
                            aria-label="Increase quantity"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <div className="cart-item-pricing">
                          <span className="cart-item-unit-price">₹{product.price ?? 0} × {qty}</span>
                          <span className="cart-item-line-total">₹{lineTotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Summary ── */}
            <div className="cart-summary-card">
              <div className="cart-summary-accent" />
              <h3 className="cart-summary-title">Order Summary</h3>
              <div className="cart-summary-rows">
                <div className="summary-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{total}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="summary-free">FREE</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <strong>₹{total}</strong>
                </div>
              </div>
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
              <button
                className="cart-checkout-btn"
                onClick={() => navigate("/checkout")}
                disabled={cart.length === 0}
              >
                Place Order <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;