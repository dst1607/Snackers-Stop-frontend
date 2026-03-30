import React, { useEffect, useState } from "react";

function Orders({ apiBase, getStatusClass }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loggedInUser = (() => {
    try {
      const saved = localStorage.getItem("canteenUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    loadOrders();

    const timer = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  async function loadOrders() {
    try {
      if (!loggedInUser?.email) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        email: loggedInUser.email,
        role: loggedInUser.role || "USER"
      });

      const response = await fetch(`${apiBase}/orders?${params.toString()}`);
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function markCompleted(order) {
    if (loggedInUser?.role !== "ADMIN") return;

    try {
      setUpdatingId(order.id);

      const payload = {
        foodName: order.foodName,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: "Completed",
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        paymentMethod: order.paymentMethod,
        orderType: order.orderType,
        pickupSlot: order.pickupSlot,
        notes: order.notes,
        waitingTime: order.waitingTime
      };

      const response = await fetch(`${apiBase}/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      loadOrders();
    } catch (error) {
      console.error("Failed to mark order as completed");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="section-gap">
      <div className="content-card">
        <div className="section-title-row">
          <div>
            <h2>{loggedInUser?.role === "ADMIN" ? "All Live Orders" : "My Orders"}</h2>
            <p>
              {loggedInUser?.role === "ADMIN"
                ? "Track all customer orders and update their status."
                : "Track only your placed orders and see their latest status."}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-box">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-box">No orders found.</div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-top">
                  <div>
                    <h3>{order.foodName}</h3>
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <p><strong>Email:</strong> {order.customerEmail}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                    <p><strong>Payment:</strong> {order.paymentMethod}</p>
                    <p><strong>Type:</strong> {order.orderType}</p>
                    <p><strong>Pickup:</strong> {order.pickupSlot}</p>
                    <p><strong>Waiting Time:</strong> {order.waitingTime} mins</p>
                    {order.notes ? <p><strong>Notes:</strong> {order.notes}</p> : null}
                  </div>

                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>

                {loggedInUser?.role === "ADMIN" && (
                  <div className="action-row wrap-row">
                    <button
                      className="primary-btn"
                      onClick={() => markCompleted(order)}
                      disabled={
                        updatingId === order.id ||
                        String(order.status).toLowerCase() === "completed"
                      }
                    >
                      {String(order.status).toLowerCase() === "completed"
                        ? "Completed"
                        : updatingId === order.id
                        ? "Updating..."
                        : "Mark Completed"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Orders;