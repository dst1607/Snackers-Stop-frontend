import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Menu from "./Menu";
import Orders from "./Orders";
import Admin from "./Admin";
import Login from "./Login";
import Signup from "./Signup";

import vegFrankieImg from "./assets/menu/veg-frankie.jpg";
import eggFrankieImg from "./assets/menu/egg-frankie.jpg";
import chickenFrankieImg from "./assets/menu/chicken-frankie.jpg";

import teaImg from "./assets/menu/tea.jpg";
import coffeeImg from "./assets/menu/coffee.jpg";
import limeJuiceImg from "./assets/menu/lime-juice.jpg";

import vegBiryaniImg from "./assets/menu/veg-biryani.jpg";
import chickenBiryaniImg from "./assets/menu/chicken-biryani.jpg";
import eggBiryaniImg from "./assets/menu/egg-biryani.jpg";

import vegMaggiImg from "./assets/menu/veg-maggie.jpg";
import eggMaggiImg from "./assets/menu/egg-maggi.jpg";

import vegSandwichImg from "./assets/menu/veg-sandwich.jpg";
import eggSandwichImg from "./assets/menu/egg-sandwich.jpg";
import chickenSandwichImg from "./assets/menu/chicken-sandwich.jpg";

import vegBurgerImg from "./assets/menu/veg-burger.jpg";
import chickenBurgerImg from "./assets/menu/chicken-burger.jpg";

import vegParotaImg from "./assets/menu/veg-parota.jpg";
import chickenParotaImg from "./assets/menu/chicken-parota.jpg";

import bondaImg from "./assets/menu/bonda.jpg";
import idliImg from "./assets/menu/idli.jpg";
import dosaImg from "./assets/menu/dosa.jpg";
import vadaImg from "./assets/menu/vada.jpg";
import masalaDosaImg from "./assets/menu/masala-dosa.jpg";

import vegMealsImg from "./assets/menu/veg meals.jpg";
import nonVegMealsImg from "./assets/menu/nonveg-meals.jpg";

import eggFriedRiceImg from "./assets/menu/egg-fried rice.jpg";
import vegFriedRiceImg from "./assets/menu/veg-fried rice.jpg";
import chickenFriedRiceImg from "./assets/menu/chicken-fried rice.jpg";

import vegNoodlesImg from "./assets/menu/veg-noodles.jpg";
import eggNoodlesImg from "./assets/menu/egg-noodles.jpg";
import chickenNoodlesImg from "./assets/menu/chicken-noodles.jpg";

import chocolateShakeImg from "./assets/menu/chocolate-shake.jpg";
import vanillaShakeImg from "./assets/menu/vanilla-shake.jpg";

import mosambiJuiceImg from "./assets/menu/mosambi-juice.jpg";
import grapeJuiceImg from "./assets/menu/grape-juice.jpg";
import papayaJuiceImg from "./assets/menu/papaya-juice.jpg";

import mixFruitSaladImg from "./assets/menu/mix-fruit-salad.jpg";
import defaultFoodImg from "./assets/menu/default-food.jpg";

const API_BASE = "http://localhost:8080";
const ORDER_HISTORY_KEY = "canteenOrderHistory";

const UPI_QR_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png";

const exactImageMap = {
  "Veg Frankie": vegFrankieImg,
  "Egg Frankie": eggFrankieImg,
  "Chicken Frankie": chickenFrankieImg,

  Tea: teaImg,
  Coffee: coffeeImg,
  "Lime Juice": limeJuiceImg,

  "Veg Biryani": vegBiryaniImg,
  "Chicken Biryani": chickenBiryaniImg,
  "Egg Biryani": eggBiryaniImg,

  "Veg Maggi": vegMaggiImg,
  "Egg Maggi": eggMaggiImg,

  "Veg Sandwich": vegSandwichImg,
  "Egg Sandwich": eggSandwichImg,
  "Chicken Sandwich": chickenSandwichImg,

  "Veg Burger": vegBurgerImg,
  "Chicken Burger": chickenBurgerImg,

  "Veg Parota": vegParotaImg,
  "Chicken Parota": chickenParotaImg,

  Bonda: bondaImg,
  Idli: idliImg,
  Dosa: dosaImg,
  Vada: vadaImg,
  "Masala Dosa": masalaDosaImg,

  "Veg Meals": vegMealsImg,
  "Non-Veg Meals": nonVegMealsImg,

  "Egg Fried Rice": eggFriedRiceImg,
  "Veg Fried Rice": vegFriedRiceImg,
  "Chicken Fried Rice": chickenFriedRiceImg,

  "Veg Noodles": vegNoodlesImg,
  "Egg Noodles": eggNoodlesImg,
  "Chicken Noodles": chickenNoodlesImg,

  "Chocolate Shake": chocolateShakeImg,
  "Vanilla Shake": vanillaShakeImg,

  "Mosambi Juice": mosambiJuiceImg,
  "Grape Juice": grapeJuiceImg,
  "Papaya Juice": papayaJuiceImg,

  "Mix Fruit Salad": mixFruitSaladImg
};

const heroSlides = [
  {
    title: "Skip the queue. Pre-order your meal.",
    subtitle:
      "A clean and stylish college canteen system for faster ordering, smart pickup, and better student experience."
  },
  {
    title: "Quick checkout with payment and pickup slot.",
    subtitle:
      "Choose your payment method, order type, pickup slot, and see the estimated waiting time before placing the order."
  },
  {
    title: "Students order fast. Admin manages easily.",
    subtitle:
      "A simple canteen platform with menu browsing, cart handling, order tracking, and admin menu management."
  }
];

function getImageByFoodName(food) {
  const exactName = (food?.name || "").trim();
  return exactImageMap[exactName] || defaultFoodImg;
}

function getStatusClass(status) {
  const value = (status || "Pending").toLowerCase();

  if (value.includes("ready")) return "status-badge ready";
  if (value.includes("complete")) return "status-badge completed";
  if (value.includes("cancel")) return "status-badge cancelled";
  if (value.includes("prepar")) return "status-badge preparing";
  return "status-badge pending";
}

function getStoredOrderHistory() {
  try {
    const raw = localStorage.getItem(ORDER_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrderHistory(history) {
  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history));
}

function App() {
  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState("menu");
  const [authPage, setAuthPage] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const saved = localStorage.getItem("canteenUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  const [checkoutForm, setCheckoutForm] = useState({
    customerName: loggedInUser?.fullName || "",
    paymentMethod: "UPI",
    orderType: "Takeaway",
    pickupSlot: "12:30 PM - 12:45 PM",
    notes: ""
  });

  useEffect(() => {
    if (loggedInUser) {
      loadFoods();
      setCheckoutForm((prev) => ({
        ...prev,
        customerName: loggedInUser.fullName || ""
      }));
    }
  }, [loggedInUser]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  async function loadFoods() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/foods`);
      if (!response.ok) throw new Error("Failed to fetch foods");

      const data = await response.json();
      setFoods(Array.isArray(data) ? data : []);
    } catch (error) {
      setFoods([]);
      setMessage("Unable to load food items from backend.");
    } finally {
      setLoading(false);
    }
  }

  const foodsWithImages = useMemo(() => {
    return foods.map((food, index) => ({
      ...food,
      displayImage: getImageByFoodName(food),
      rating: (4.1 + ((index % 7) * 0.1)).toFixed(1),
      prepTime: 8 + (index % 5) * 3
    }));
  }, [foods]);

  const categories = useMemo(() => {
    const allCategories = foodsWithImages
      .map((food) => food.category)
      .filter(Boolean);

    return ["All", ...new Set(allCategories)];
  }, [foodsWithImages]);

  const featuredFoods = useMemo(() => foodsWithImages.slice(0, 4), [foodsWithImages]);

  const filteredFoods = useMemo(() => {
    return foodsWithImages.filter((food) => {
      const categoryOk = category === "All" || food.category === category;
      const searchOk = (food.name || "").toLowerCase().includes(search.toLowerCase());
      return categoryOk && searchOk;
    });
  }, [foodsWithImages, category, search]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const packingFee = cart.length > 0 ? 8 : 0;
  const platformFee = cart.length > 0 ? 5 : 0;
  const gst = cart.length > 0 ? Math.round(subtotal * 0.05) : 0;
  const totalAmount = subtotal + packingFee + platformFee + gst;
  const waitingTime = totalItems > 0 ? 10 + totalItems * 4 : 0;

  const orderHistory = useMemo(() => getStoredOrderHistory(), [loggedInUser, page, message]);

  const recommendedFoods = useMemo(() => {
    if (!foodsWithImages.length) return [];

    const lowerHistory = orderHistory.map((item) => String(item.foodName || "").toLowerCase());
    const categoryCounts = {};

    foodsWithImages.forEach((food) => {
      const name = String(food.name || "").toLowerCase();
      const categoryName = food.category || "Other";

      if (lowerHistory.some((orderedName) => orderedName === name)) {
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 2;
      }

      if (lowerHistory.some((orderedName) => orderedName.includes(categoryName.toLowerCase()))) {
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
      }
    });

    const cartCategories = cart.map((item) => item.category);
    cartCategories.forEach((cat) => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 3;
    });

    const topCategory =
      Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const cartIds = new Set(cart.map((item) => item.id));
    const orderedNames = new Set(lowerHistory);

    let recommendations = foodsWithImages.filter((food) => {
      if (cartIds.has(food.id)) return false;
      if (orderedNames.has(String(food.name || "").toLowerCase())) return false;
      if (topCategory) return food.category === topCategory;
      return true;
    });

    if (!recommendations.length) {
      recommendations = foodsWithImages.filter((food) => !cartIds.has(food.id));
    }

    return recommendations.slice(0, 4);
  }, [foodsWithImages, cart, orderHistory]);

  const comboSuggestions = useMemo(() => {
    if (!foodsWithImages.length) return [];

    const cartNames = cart.map((item) => item.name.toLowerCase());
    const cartIds = new Set(cart.map((item) => item.id));

    let combos = [];

    const pickFoods = (keywords, limit = 2) =>
      foodsWithImages
        .filter((food) => {
          const text = `${food.name} ${food.category}`.toLowerCase();
          return keywords.some((key) => text.includes(key)) && !cartIds.has(food.id);
        })
        .slice(0, limit);

    if (cartNames.some((name) => name.includes("frankie"))) {
      combos = [...pickFoods(["juice", "tea", "coffee"], 2)];
    } else if (cartNames.some((name) => name.includes("biryani"))) {
      combos = [...pickFoods(["juice", "shake"], 2)];
    } else if (cartNames.some((name) => name.includes("burger"))) {
      combos = [...pickFoods(["shake", "juice", "coffee"], 2)];
    } else if (cartNames.some((name) => name.includes("noodles") || name.includes("maggi"))) {
      combos = [...pickFoods(["tea", "coffee", "juice"], 2)];
    } else if (
      cartNames.some(
        (name) =>
          name.includes("dosa") || name.includes("idli") || name.includes("vada")
      )
    ) {
      combos = [...pickFoods(["tea", "coffee"], 2)];
    } else if (cart.length > 0) {
      combos = foodsWithImages.filter((food) => !cartIds.has(food.id)).slice(0, 2);
    }

    return combos;
  }, [foodsWithImages, cart]);

  const cartAssistant = useMemo(() => {
    if (!cart.length) {
      return {
        title: "Smart Cart Assistant",
        message: "Add your first item and I’ll suggest combos and smart add-ons."
      };
    }

    if (totalAmount < 100) {
      return {
        title: "Smart Cart Assistant",
        message: "Add 1 more side or drink to make your order feel more complete."
      };
    }

    if (
      cart.some((item) => item.name.toLowerCase().includes("biryani")) &&
      !cart.some(
        (item) =>
          item.name.toLowerCase().includes("juice") ||
          item.name.toLowerCase().includes("shake")
      )
    ) {
      return {
        title: "Smart Cart Assistant",
        message: "Biryani goes well with a juice or shake. Try adding one to your cart."
      };
    }

    if (
      cart.some((item) => item.name.toLowerCase().includes("frankie")) &&
      !cart.some(
        (item) =>
          item.category === "Beverages" || item.category === "Juices"
      )
    ) {
      return {
        title: "Smart Cart Assistant",
        message: "A Frankie combo looks incomplete without a drink. Add Tea, Coffee, or Lime Juice."
      };
    }

    if (cart.length >= 3) {
      return {
        title: "Smart Cart Assistant",
        message: "Nice combo. Your cart already looks well balanced."
      };
    }

    return {
      title: "Smart Cart Assistant",
      message: "You’re building a good order. Add a drink or dessert for a better combo."
    };
  }, [cart, totalAmount]);

  function handleLogin(user) {
    setLoggedInUser(user);
    setAuthPage("login");
  }

  function logout() {
    localStorage.removeItem("canteenUser");
    setLoggedInUser(null);
    setCart([]);
    setPage("menu");
    setMessage("");
    setShowCheckout(false);
    setCheckoutForm({
      customerName: "",
      paymentMethod: "UPI",
      orderType: "Takeaway",
      pickupSlot: "12:30 PM - 12:45 PM",
      notes: ""
    });
  }

  function addToCart(food) {
    setMessage("");

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === food.id);

      if (existing) {
        return prevCart.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...food, quantity: 1 }];
    });
  }

  function updateQuantity(id, change) {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeCartItem(id) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }

  function handleCheckoutChange(event) {
    const { name, value } = event.target;
    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function placeOrder() {
    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    if (!checkoutForm.customerName.trim()) {
      setMessage("Please enter student name before placing the order.");
      return;
    }

    try {
      for (const item of cart) {
        const payload = {
          foodName: item.name,
          quantity: Number(item.quantity),
          totalPrice: Number(item.price) * Number(item.quantity),
          status: "Pending",
          customerName: checkoutForm.customerName,
          customerEmail: loggedInUser?.email || "",
          paymentMethod: checkoutForm.paymentMethod,
          orderType: checkoutForm.orderType,
          pickupSlot: checkoutForm.pickupSlot,
          notes: checkoutForm.notes,
          waitingTime: waitingTime
        };

        const response = await fetch(`${API_BASE}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to place order");
      }

      const existingHistory = getStoredOrderHistory();
      const newHistory = [
        ...existingHistory,
        ...cart.map((item) => ({
          foodName: item.name,
          category: item.category,
          quantity: item.quantity,
          orderedAt: new Date().toISOString()
        }))
      ];
      saveOrderHistory(newHistory);

      setMessage(
        `Order placed successfully. Estimated waiting time: ${waitingTime} mins.`
      );
      setCart([]);
      setShowCheckout(false);
      setPage("orders");

      setCheckoutForm((prev) => ({
        ...prev,
        customerName: loggedInUser?.fullName || "",
        paymentMethod: "UPI",
        orderType: "Takeaway",
        pickupSlot: "12:30 PM - 12:45 PM",
        notes: ""
      }));
    } catch (error) {
      setMessage("Failed to place order. Check backend connection.");
    }
  }

  if (!loggedInUser) {
    return authPage === "login" ? (
      <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthPage("signup")} />
    ) : (
      <Signup
        onSignupSuccess={() => setAuthPage("login")}
        onSwitchToLogin={() => setAuthPage("login")}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="hero-banner">
        <div>
          <p className="eyebrow">SNACKERS STOP</p>
          <h1>{heroSlides[heroIndex].title}</h1>
          <p className="hero-subtitle">{heroSlides[heroIndex].subtitle}</p>
        </div>

        <div className="hero-stats">
          <div className="stat-chip">
            <span>{foods.length}</span>
            <small>Food Items</small>
          </div>
          <div className="stat-chip">
            <span>{totalItems}</span>
            <small>Cart Items</small>
          </div>
          <div className="stat-chip">
            <span>{waitingTime || "--"}</span>
            <small>Wait (mins)</small>
          </div>
        </div>
      </header>

      <nav className="top-nav">
        <button
          className={`nav-btn ${page === "menu" ? "active" : ""}`}
          onClick={() => setPage("menu")}
        >
          Menu
        </button>

        <button
          className={`nav-btn ${page === "orders" ? "active" : ""}`}
          onClick={() => setPage("orders")}
        >
          Orders
        </button>

        {loggedInUser?.role === "ADMIN" && (
          <button
            className={`nav-btn ${page === "admin" ? "active" : ""}`}
            onClick={() => setPage("admin")}
          >
            Dashboard
          </button>
        )}

        <button className="cart-pill" onClick={() => setShowCheckout(true)}>
          Cart <span>{totalItems}</span>
        </button>

        <button className="nav-btn" onClick={logout}>
          Logout
        </button>
      </nav>

      {message && <div className="message-banner">{message}</div>}

      {page === "menu" && (
        <>
          <Menu
            loading={loading}
            categories={categories}
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
            featuredFoods={featuredFoods}
            filteredFoods={filteredFoods}
            recommendedFoods={recommendedFoods}
            comboSuggestions={comboSuggestions}
            cartAssistant={cartAssistant}
            addToCart={addToCart}
          />

          <section className="section-gap cart-section">
            <div className="section-title-row">
              <div>
                <h2>Order Cart</h2>
                <p>Review items, waiting time, and continue to checkout.</p>
              </div>
            </div>

            <div className="smart-assistant-box">
              <h3>{cartAssistant.title}</h3>
              <p>{cartAssistant.message}</p>
            </div>

            {cart.length === 0 ? (
              <div className="empty-box">No items in cart.</div>
            ) : (
              <div className="cart-layout">
                <div className="cart-list-card">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img
                        src={item.displayImage || getImageByFoodName(item)}
                        alt={item.name}
                        className="cart-thumb"
                      />

                      <div className="cart-main">
                        <h4>{item.name}</h4>
                        <p>₹{item.price} each</p>
                      </div>

                      <div className="qty-box">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>

                      <div className="cart-side">
                        <strong>₹{item.price * item.quantity}</strong>
                        <br />
                        <button
                          className="text-btn danger-text"
                          onClick={() => removeCartItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-card">
                  <h3>Bill Details</h3>

                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="summary-line">
                    <span>Packing Fee</span>
                    <span>₹{packingFee}</span>
                  </div>

                  <div className="summary-line">
                    <span>Platform Fee</span>
                    <span>₹{platformFee}</span>
                  </div>

                  <div className="summary-line">
                    <span>GST</span>
                    <span>₹{gst}</span>
                  </div>

                  <div className="summary-line total-line">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>

                  <div className="wait-box">
                    Estimated waiting time: <strong>{waitingTime} mins</strong>
                  </div>

                  <button
                    className="primary-btn full-width-btn large-btn"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {page === "orders" && (
        <Orders apiBase={API_BASE} getStatusClass={getStatusClass} />
      )}

      {page === "admin" && loggedInUser?.role === "ADMIN" && (
        <Admin apiBase={API_BASE} onFoodSaved={loadFoods} />
      )}

      {showCheckout && (
        <div className="modal-backdrop" onClick={() => setShowCheckout(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Checkout</h2>
              <button className="icon-btn" onClick={() => setShowCheckout(false)}>
                ✕
              </button>
            </div>

            <div className="checkout-grid">
              <div>
                <label>Student Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={checkoutForm.customerName}
                  onChange={handleCheckoutChange}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={checkoutForm.paymentMethod}
                  onChange={handleCheckoutChange}
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div>
                <label>Order Type</label>
                <select
                  name="orderType"
                  value={checkoutForm.orderType}
                  onChange={handleCheckoutChange}
                >
                  <option value="Takeaway">Takeaway</option>
                  <option value="Dine-In">Dine-In</option>
                </select>
              </div>

              <div>
                <label>Pickup Slot</label>
                <select
                  name="pickupSlot"
                  value={checkoutForm.pickupSlot}
                  onChange={handleCheckoutChange}
                >
                  <option value="12:30 PM - 12:45 PM">12:30 PM - 12:45 PM</option>
                  <option value="12:45 PM - 01:00 PM">12:45 PM - 01:00 PM</option>
                  <option value="01:00 PM - 01:15 PM">01:00 PM - 01:15 PM</option>
                  <option value="01:15 PM - 01:30 PM">01:15 PM - 01:30 PM</option>
                </select>
              </div>
            </div>

            <div className="field-block">
              <label>Notes</label>
              <textarea
                rows="3"
                name="notes"
                value={checkoutForm.notes}
                onChange={handleCheckoutChange}
                placeholder="Less spicy, no onion, extra sauce, etc."
              />
            </div>

            {checkoutForm.paymentMethod === "UPI" && (
              <div className="checkout-summary-box">
                <div className="summary-line">
                  <span>UPI Payment</span>
                  <span>Scan QR below</span>
                </div>

                <div style={{ textAlign: "center", marginTop: "14px" }}>
                  <img
                    src={UPI_QR_IMAGE}
                    alt="UPI QR"
                    style={{
                      width: "170px",
                      height: "170px",
                      objectFit: "contain",
                      borderRadius: "12px",
                      background: "#fff",
                      padding: "10px"
                    }}
                  />
                  <p style={{ marginTop: "10px", color: "#cbd5e1" }}>
                    Scan and pay using any UPI app.
                  </p>
                </div>
              </div>
            )}

            <div className="checkout-summary-box">
              <div className="summary-line">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="summary-line">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>

              <div className="summary-line">
                <span>Waiting Time</span>
                <span>{waitingTime} mins</span>
              </div>

              <div className="summary-line">
                <span>Payment</span>
                <span>{checkoutForm.paymentMethod}</span>
              </div>

              <div className="summary-line">
                <span>Pickup</span>
                <span>{checkoutForm.pickupSlot}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() => setShowCheckout(false)}
              >
                Back
              </button>
              <button className="primary-btn" onClick={placeOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;