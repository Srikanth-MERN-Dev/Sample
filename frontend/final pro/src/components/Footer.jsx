import { FaInstagram, FaLeaf } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import { FiFacebook } from "react-icons/fi";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer mx-5">
      <div className="footer-glow-bar" />
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-brand-col">
              <div className="footer-logo-row">
                <div className="footer-logo-icon">
                  <FaLeaf />
                </div>
                <div>
                  <h3 className="footer-brand-name">Healthy Food</h3>
                  <p className="footer-tagline">Fresh & Healthy Since 1998</p>
                </div>
              </div>
              <p className="footer-about-text">
                We serve a lifestyle — delicious, nourishing meals for body and soul.
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

            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/productmenu">Menu</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Contact</h4>
              <div className="footer-contact-list">
                <div className="contact-item">
                  <span className="contact-icon"><MdLocationOn /></span>
                  <div>
                    <p>Kanchipuram</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><MdEmail /></span>
                  <div>
                    <p>HealthyFood1998@gmail.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><MdPhone /></span>
                  <div>
                    <p>+91 44 2726 1234</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
