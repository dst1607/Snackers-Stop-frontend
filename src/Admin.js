import React, { useEffect, useState } from "react";

function Admin({ apiBase, onFoodSaved }) {
  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: ""
  });

  useEffect(() => {
    loadFoods();
  }, []);

  async function loadFoods() {
    try {
      const response = await fetch(`${apiBase}/foods`);
      const data = await response.json();
      setFoods(Array.isArray(data) ? data : []);
    } catch (error) {
      setFoods([]);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      imageUrl: form.imageUrl
    };

    const url = editingId ? `${apiBase}/foods/${editingId}` : `${apiBase}/foods`;
    const method = editingId ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      setForm({
        name: "",
        price: "",
        category: "",
        imageUrl: ""
      });
      setEditingId(null);
      loadFoods();
      onFoodSaved();
    } catch (error) {
      console.error("Failed to save food item");
    }
  }

  function handleEdit(food) {
    setEditingId(food.id);
    setForm({
      name: food.name || "",
      price: food.price || "",
      category: food.category || "",
      imageUrl: food.imageUrl || ""
    });
  }

  async function handleDelete(id) {
    try {
      await fetch(`${apiBase}/foods/${id}`, {
        method: "DELETE"
      });
      loadFoods();
      onFoodSaved();
    } catch (error) {
      console.error("Failed to delete food item");
    }
  }

  return (
    <section className="section-gap">
      <div className="content-card">
        <div className="section-title-row">
          <div>
            <h2>Admin Dashboard</h2>
            <p>Only admin can manage food items and system menu data.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-form-grid">
          <input
            type="text"
            name="name"
            placeholder="Food name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
          />

          <div className="action-row">
            <button className="primary-btn" type="submit">
              {editingId ? "Update Item" : "Add Item"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    name: "",
                    price: "",
                    category: "",
                    imageUrl: ""
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="orders-grid top-space">
          {foods.map((food) => (
            <div className="order-card" key={food.id}>
              <h3>{food.name}</h3>
              <p><strong>Price:</strong> ₹{food.price}</p>
              <p><strong>Category:</strong> {food.category}</p>

              <div className="action-row wrap-row">
                <button className="secondary-btn" onClick={() => handleEdit(food)}>
                  Edit
                </button>
                <button className="danger-btn" onClick={() => handleDelete(food.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Admin;