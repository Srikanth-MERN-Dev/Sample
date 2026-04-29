import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FourSquare } from "react-loading-indicators";
import toast, { Toaster } from "react-hot-toast";
import AOS from "aos";

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
    fetch("http://localhost:3000/products", { method: "GET" })
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
        `http://localhost:3000/products/search?q=${value}`,
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
      const res = await fetch("http://localhost:3000/cart/add", {
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
        <h2
          className="text-center fw-bold mt-3 text-decoration-underline"
          data-aos="fade-down"
        >
          Menu
        </h2>
        <center>
          <input
          style={{borderRadius: "30px"}}
            type="text"
            placeholder=" 🔍 Search Product......."
            value={search}
            onChange={handleSearch}
            className="search-input me-2 mt-2 w-75 px-5 py-2 "
            data-aos="fade-up"
            data-aos-delay="200"
          />
        </center>
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
              <div className="card">
                <img
                  src={`data:image/png;base64, ${item.image}`}
                  className="card-img-top"
                  alt="Food Image"
                />
                <div className="card-body">
                  <h3 className="card-title">{item.name}</h3>
                  <p className="card-text">{item.description}</p>
                  <div className="card-price">
                    <h5 className="card-text text-decoration-line-through text-secondary">
                      {`₹ ${item.actualPrice}`}
                    </h5>
                    <h4 className="card-text">{`₹ ${item.price}`}</h4>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn btn-success"
                      onClick={() => buyNow(item._id)}
                    >
                      Buy Now
                    </button>
                    <button
                      className="btn btn-outline-success ms-3"
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