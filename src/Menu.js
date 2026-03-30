import React from "react";

function Menu({
  loading,
  categories,
  category,
  setCategory,
  search,
  setSearch,
  featuredFoods,
  filteredFoods,
  recommendedFoods,
  comboSuggestions,
  cartAssistant,
  addToCart
}) {
  function renderCards(items, sectionKey) {
    return (
      <div className="menu-grid">
        {items.map((food) => (
          <div className="menu-card" key={`${sectionKey}-${food.id}`}>
            <img
              src={food.displayImage}
              alt={food.name}
              className="food-image small"
            />

            <div className="menu-card-body">
              <div className="title-row">
                <span className="food-category-tag">{food.category}</span>
                <span className="rating-badge">⭐ {food.rating}</span>
              </div>

              <h3>{food.name}</h3>
              <p>Freshly prepared and ideal for fast campus pickup.</p>

              <div className="price-row">
                <span className="price">₹{food.price}</span>
                <span className="prep-time">{food.prepTime} min</span>
              </div>

              <div className="wrap-row">
                <button
                  className="primary-btn full-width-btn"
                  onClick={() => addToCart(food)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="section-gap">
        <div className="content-card">
          <div className="section-title-row">
            <div>
              <h2>Popular Picks</h2>
              <p>Fast-selling items students usually prefer during breaks.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-box">Loading menu...</div>
          ) : (
            renderCards(featuredFoods, "featured")
          )}
        </div>
      </section>

      <section className="section-gap">
        <div className="content-card">
          <div className="section-title-row">
            <div>
              <h2>Recommended For You</h2>
              <p>Smart suggestions based on your order history and preferences.</p>
            </div>
          </div>

          {recommendedFoods.length === 0 ? (
            <div className="empty-box">No recommendations yet. Place an order to unlock smarter suggestions.</div>
          ) : (
            renderCards(recommendedFoods, "recommended")
          )}
        </div>
      </section>

      <section className="section-gap">
        <div className="content-card">
          <div className="section-title-row">
            <div>
              <h2>Smart Combo Suggestions</h2>
              <p>Handpicked combos that go well with what you’re ordering.</p>
            </div>
          </div>

          {comboSuggestions.length === 0 ? (
            <div className="empty-box">Add an item to cart and combo suggestions will appear here.</div>
          ) : (
            renderCards(comboSuggestions, "combo")
          )}
        </div>
      </section>

      <section className="section-gap">
        <div className="content-card">
          <div className="section-title-row">
            <div>
              <h2>Explore Menu</h2>
              <p>Search food, filter categories, and add items to cart.</p>
            </div>
          </div>

          <div className="smart-assistant-box">
            <h3>{cartAssistant.title}</h3>
            <p>{cartAssistant.message}</p>
          </div>

          <div className="search-row">
            <input
              type="text"
              className="search-input"
              placeholder="Search food item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-row">
            {categories.map((item) => (
              <button
                key={item}
                className={`category-chip ${category === item ? "active" : ""}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="empty-box">Loading menu...</div>
          ) : filteredFoods.length === 0 ? (
            <div className="empty-box">No matching food items found.</div>
          ) : (
            renderCards(filteredFoods, "menu")
          )}
        </div>
      </section>
    </>
  );
}

export default Menu;