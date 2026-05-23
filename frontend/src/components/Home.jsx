import { Link } from "react-router-dom";
import { FaLeaf, FaTruck, FaClock, FaHeart, FaArrowRight, FaStar } from "react-icons/fa";
import bg from "../assets/newbg2.jpeg";


const features = [
  { icon: <FaLeaf />, title: "100% Veg", desc: "Pure vegetarian" },
  { icon: <FaTruck />, title: "Fast Delivery", desc: "At your door" },
  { icon: <FaClock />, title: "On Time", desc: "Guaranteed" },
];

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-bg-glow" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-badge">
            <FaLeaf className="hero-badge-icon" />
            <span>100% Vegetarian</span>
          </div>

          <h1 className="hero-title">
            Fresh <span className="hero-title-accent">Veg</span> Foods
          </h1>

          <p className="hero-subtitle">
            Healthy vegetarian meals delivered fresh to your doorstep.
          </p>

          <div className="hero-actions">
            <Link to="/productmenu" className="hero-btn-primary">
              Order Now <FaArrowRight className="hero-btn-icon" />
            </Link>
            <Link to="/productmenu" className="hero-btn-secondary">
              View Menu
            </Link>
          </div>

          <div className="hero-trust">
            <div className="hero-trust-item">
              <FaStar className="hero-trust-star" />
              <span>4.9 Rating</span>
            </div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item">
              <FaHeart className="hero-trust-heart" />
              <span>10k+ Customers</span>
            </div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item">
              <FaClock className="hero-trust-clock" />
              <span>30 min Delivery</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-visual">
            <div className="hero-image-card hero-image-card-main">
              <img src={bg} alt="Delicious food" />
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