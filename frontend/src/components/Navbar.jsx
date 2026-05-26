import { Link, useLocation } from "react-router-dom";
import { SiGnuprivacyguard } from "react-icons/si";
import { MdRestaurantMenu } from "react-icons/md";
import { ImCart } from "react-icons/im";
import { FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import { BsBagHeartFill } from "react-icons/bs";
import { RiAdminFill } from "react-icons/ri";
import logo from "../assets/newlogo1.jpeg";

const navItems = [
  { path: "/", label: "Home", icon: FaHome },
  { path: "/productmenu", label: "Menu", icon: MdRestaurantMenu },
  { path: "/orders", label: "Orders", icon: BsBagHeartFill },
  { path: "/cart", label: "Cart", icon: ImCart },
  { path: "/profile", label: "Profile", icon: CgProfile },
  { path: "/login", label: "Login", icon: SiGnuprivacyguard },
];

const Navbar = () => {
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRole(decoded.role);
        } catch (error) {
          console.error("Token decode error:", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }
    };

    checkUserRole();
  }, [location.pathname]);

  // Listen for token changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRole(decoded.role);
        } catch (error) {
          console.error("Token decode error:", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  const displayItems =
    role === "admin"
      ? [...navItems, { path: "/adminpanel", label: "Admin", icon: RiAdminFill }]
      : navItems;

  return (
    <>
      {/* Fixed Navbar */}
      <nav className={`navbar-v2 ${scrolled ? "navbar-v2-scrolled" : ""}`}>
        <div className="navbar-v2-container">
          {/* Logo - Single Instance */}
          <Link to="/" className="navbar-v2-brand-link">
            <div className="navbar-v2-brand">
              <div className="navbar-v2-logo-wrapper">
                <img
                  src={logo}
                  alt="Healthy Food Logo"
                  className="navbar-v2-logo"
                />
                <div className="navbar-v2-logo-glow" />
              </div>

              {/* Brand Text - Hidden on Small Screens */}
              <div className="navbar-v2-brand-text">
                <span className="navbar-v2-brand-name">Healthy Food</span>
                <span className="navbar-v2-brand-tagline">Fresh & Healthy</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="navbar-v2-desktop-menu">
            {displayItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-v2-link ${isActive(item.path) ? "active" : ""}`}
              >
                <item.icon className="navbar-v2-icon" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button - Visible on Mobile */}
          <button
            ref={buttonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`navbar-v2-hamburger ${mobileMenuOpen ? "open" : ""}`}
            aria-label="Toggle menu"
          >
            <span className="navbar-v2-hamburger-line" />
            <span className="navbar-v2-hamburger-line" />
            <span className="navbar-v2-hamburger-line" />
          </button>
        </div>
      </nav>

      {/* Backdrop Overlay - Mobile Only */}
      {mobileMenuOpen && (
        <div
          className="navbar-v2-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Slide Down Animation */}
      <div
        ref={menuRef}
        className={`navbar-v2-mobile-menu ${mobileMenuOpen ? "open" : ""}`}
      >
        <div className="navbar-v2-mobile-menu-content">
          {displayItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-v2-mobile-link ${isActive(item.path) ? "active" : ""}`}
              style={{
                transitionDelay: mobileMenuOpen ? `${index * 30}ms` : "0ms",
              }}
            >
              <item.icon className="navbar-v2-mobile-icon" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Spacer to prevent content overlap */}
      <div style={{ height: "64px" }} />
    </>
  );
};

export default Navbar;
