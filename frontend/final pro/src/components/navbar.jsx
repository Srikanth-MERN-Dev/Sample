import Nav from "react-bootstrap/Nav";
import { Link, useLocation } from "react-router-dom";
import { SiGnuprivacyguard } from "react-icons/si";
import { MdRestaurantMenu } from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import { ImCart } from "react-icons/im";
import { FaHome, FaUserPlus } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import AOS from "aos";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useState } from "react";
import { BsBagHeartFill } from "react-icons/bs";
import { RiAdminFill } from "react-icons/ri";

const NavBar = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      (async () => {
        setRole(decoded.role);
      })();
    }
  }, []);

  const isActive = (path) =>
    location.pathname === path ? "nav-link1 active-link" : "nav-link1";

  return (
    <>
      <nav
        className="navbar navbar-expand-lg sticky-top"
        data-aos="fade-down"
        data-aos-delay="200"
      >
        <div className="navbar-container container-fluid d-flex">
          {/* Brand */}
          <Nav.Link as={Link} to="/" className="nav-brand-link" style={{ textDecoration: "none" }}>
            <div className="nav-brand d-flex align-items-center">
              <div className="nav-logo-wrapper">
                <img
                  src="./src/assets/new logo1.jpeg"
                  alt="Healthy Food Logo"
                  className="nav-logo-img"
                />
                <div className="nav-logo-ring" />
              </div>
              <div className="nav-brand-text">
                <span className="nav-brand-name">Healthy Food</span>
                <span className="nav-brand-tagline">Your Health, Our Priority</span>
              </div>
            </div>
          </Nav.Link>

          {/* Hamburger */}
          <label
            className="hamburger navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <input type="checkbox" />
            <svg viewBox="0 0 32 32">
              <path
                className="line line-top-bottom"
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              />
              <path className="line" d="M7 16 27 16" />
            </svg>
          </label>

          {/* Links */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <Nav
              className="ms-auto d-flex flex-row gap-1 align-items-center my-2 my-lg-0"
              navbarScroll
            >
              <div className="d-flex flex-row flex-wrap align-items-center">
                <Nav.Link as={Link} to="/" className={isActive("/")}>
                  <FaHome /> Home
                </Nav.Link>

                <Nav.Link as={Link} to="/login" className={isActive("/login")}>
                  <SiGnuprivacyguard /> Login
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/productmenu"
                  className={isActive("/productmenu")}
                >
                  <MdRestaurantMenu /> Menu
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className={isActive("/profile")}
                >
                  <CgProfile /> Profile
                </Nav.Link>

                <Nav.Link as={Link} to="/cart" className={isActive("/cart")}>
                  <ImCart /> Cart
                </Nav.Link>

                {role === "admin" && (
                  <Nav.Link
                    as={Link}
                    to="/adminpanel"
                    className={isActive("/adminpanel")}
                  >
                    <RiAdminFill /> Admin Panel
                  </Nav.Link>
                )}

                <Nav.Link
                  as={Link}
                  to="/orders"
                  className={isActive("/orders")}
                >
                  <BsBagHeartFill /> My Orders
                </Nav.Link>
              </div>
            </Nav>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
