import React from "react";

function Cart({ cart }) {

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (

    <div className="cart">

      <h2>🛒 Order Cart</h2>

      {cart.length === 0 && <p>No items added</p>}

      {cart.map(item => (

        <div key={item.id} className="cart-item">

          <span>{item.name}</span>

          <span>
            {item.quantity} × ₹{item.price}
          </span>

        </div>

      ))}

      <h3>Total : ₹{total}</h3>

      <button className="order-btn">
        Place Order
      </button>

    </div>
  );
}

export default Cart;