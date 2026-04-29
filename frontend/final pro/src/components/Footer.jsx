import { FaInstagram, FaLeaf } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import { FiFacebook } from "react-icons/fi";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      {/* Top glow border */}
      <div className="footer-glow-bar" />

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-col footer-brand-col">
              <div className="footer-logo-row">
                <div className="footer-logo-icon">
                  <FaLeaf />
                </div>
                <div>
                  <h3 className="footer-brand-name">Healthy Food</h3>
                  <p className="footer-tagline">Your Health, Our Priority</p>
                </div>
              </div>
              <p className="footer-about-text">
                Since <span className="green-accent">1998</span>, our journey
                has been driven by one simple belief: food should not only be
                delicious but also nourishing for the body and soul. At{" "}
                <span className="green-accent">Healthy Food</span>, we don't
                just serve meals; we serve a lifestyle.
              </p>
              <div className="footer-social-row">
                <span className="social-icon facebook" role="button" aria-label="Facebook">
                  <FiFacebook />
                </span>
                <span className="social-icon twitter" role="button" aria-label="Twitter">
                  <FiTwitter />
                </span>
                <span className="social-icon instagram" role="button" aria-label="Instagram">
                  <FaInstagram />
                </span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/productmenu">Menu</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/orders">My Orders</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="footer-col">
              <h4 className="footer-heading">Contact Us</h4>
              <div className="footer-contact-list">
                <div className="contact-item">
                  <span className="contact-icon"><MdLocationOn /></span>
                  <div>
                    <span className="contact-label">Address</span>
                    <p>Kanchipuram HealthyFood</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><MdEmail /></span>
                  <div>
                    <span className="contact-label">Email</span>
                    <p>HealthyFood1998@gmail.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><MdPhone /></span>
                  <div>
                    <span className="contact-label">Phone</span>
                    <p>+91 44 2726 1234</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-row">
            <p>&copy; {new Date().getFullYear()} Healthy Food. All rights reserved.</p>
            <p className="footer-bottom-tagline">
              Made with <span className="green-accent">♥</span> for healthy living
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
