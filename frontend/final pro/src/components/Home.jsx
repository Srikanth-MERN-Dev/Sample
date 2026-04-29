import { Link } from "react-router-dom";
import { FaLeaf, FaTruck, FaClock, FaHeart, FaArrowRight, FaStar, FaUtensils } from "react-icons/fa";

const features = [
  { icon: <FaUtensils />, title: "Freshly Cooked", desc: "Every meal prepared fresh to order" },
  { icon: <FaLeaf />, title: "100% Veg", desc: "Pure vegetarian ingredients" },
  { icon: <FaTruck />, title: "Fast Delivery", desc: "Delivered to your doorstep" },
  { icon: <FaClock />, title: "On Time", desc: "Punctual delivery guaranteed" },
];

const Home = () => {
  return (
    <section className="hero">
      {/* Animated background glow orbs */}
      <div className="hero-bg-glow" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="hero-content">
        {/* Left side — text + CTA */}
        <div className="hero-left">
          <div className="hero-badge">
            <FaLeaf className="hero-badge-icon" />
            <span>100% Vegetarian</span>
          </div>

          <h1 className="hero-title">
            Fresh <span className="hero-title-accent">Veg</span> Foods
          </h1>

          <p className="hero-subtitle">
            Healthy vegetarian meals delivered fresh to your doorstep —
            nourishing the body, delighting the soul.
          </p>

          <div className="hero-actions">
            <Link to="/productmenu" className="hero-btn-primary">
              Order Now <FaArrowRight className="hero-btn-icon" />
            </Link>
            <Link to="/productmenu" className="hero-btn-secondary">
              View Menu
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="hero-trust">
            <div className="hero-trust-item">
              <FaStar className="hero-trust-star" />
              <span>4.9 Rating</span>
            </div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item">
              <FaHeart className="hero-trust-heart" />
              <span>10k+ Happy Customers</span>
            </div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item">
              <FaClock className="hero-trust-clock" />
              <span>30 min Delivery</span>
            </div>
          </div>
        </div>

        {/* Right side — visual card stack */}
        <div className="hero-right">
          <div className="hero-visual">
            <div className="hero-image-card hero-image-card-main">
              <img src="./src/assets/new bg2.jpeg" alt="Delicious vegetarian food" />
              <div className="hero-image-overlay" />
              <div className="hero-floating-badge hero-floating-badge-1">
                <FaLeaf />
                <span>Organic</span>
              </div>
              <div className="hero-floating-badge hero-floating-badge-2">
                <FaHeart />
                <span>Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards strip */}
      <div className="hero-features">
        {features.map((f, i) => (
          <div className="hero-feature-card" key={i}>
            <div className="hero-feature-icon">{f.icon}</div>
            <div className="hero-feature-text">
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;