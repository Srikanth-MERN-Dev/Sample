import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FourSquare } from "react-loading-indicators";
import toast, { Toaster } from "react-hot-toast";
import AOS from "aos";
import { API_URL } from '../config';

const ProductMenu = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/products`, { method: "GET" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch products");
        }
      })
      .then((data) => {
        setProducts(data);
        AOS.refresh();
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    try {
      const res = await fetch(
        `${API_URL}/products/search?q=${value}`,
      );
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log("Error:", err);
      setSearch("Product Not Found");
    }
  };

  const buyNow = (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to buy now.");
      navigate("/login");
      return;
    }
    navigate(`/checkout?productId=${productId}`);
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first to add to cart.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success("Added to Cart🛒");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return (
      <div>
        <center>
          <FourSquare
            color="#4ade80"
            size="medium"
            text="Loading..."
            textColor="#000"
          />
        </center>
      </div>
    );
  } else {
    return (
      <div>
        <Toaster />
        <div className="menu-header-section" data-aos="fade-down">
          <div className="menu-header-glow" />
          <h2 className="menu-title">
            <span className="menu-title-icon">🍽️</span> Our Menu
          </h2>
          <p className="menu-subtitle">Discover delicious vegetarian meals made with love</p>
        </div>
        <div className="menu-search-wrapper" data-aos="fade-up" data-aos-delay="200">
          <div className="menu-search-box">
            <span className="menu-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search your favorite dish..."
              value={search}
              onChange={handleSearch}
              className="menu-search-input"
            />
          </div>
        </div>
        {/* {isLoading && <p className="text-center py-3">Loading products...</p>} */}
        {error && (
          <p className="text-center text-danger py-3">Error: {error}</p>
        )}
        {products.length === 0 && !isLoading && (
          <p className="text-center py-3">No products available.</p>
        )}

        <section className="products-menu product-card-grid">
          {products.map((item, index) => (
            <div
              key={item._id || index}
              data-aos="zoom-in"
              data-aos-delay={(index % 4) * 100}
            >
              <div className="card" key={item._id || index}>
                <div className="card-image-wrapper">
                  <img
                    src={`data:image/png;base64, ${item.image}`}
                    className="card-img-top"
                    alt="Food Image"
                  />
                  {item.actualPrice && item.price < item.actualPrice && (
                    <div className="card-discount-badge">
                      {Math.round(((item.actualPrice - item.price) / item.actualPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <h3 className="card-title">{item.name}</h3>
                  <p className="card-text">{item.description}</p>
                  <div className="card-price">
                    {item.actualPrice && (
                      <h5 className="card-text text-decoration-line-through text-secondary">
                        {`₹ ${item.actualPrice}`}
                      </h5>
                    )}
                    <h4 className="card-price-current">{`₹ ${item.price}`}</h4>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-buy-now"
                      onClick={() => buyNow(item._id)}
                    >
                      Buy Now
                    </button>
                    <button
                      className="btn-add-cart"
                      onClick={() => addToCart(item._id)}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }
};

export default ProductMenu;