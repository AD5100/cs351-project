document.getElementById("checkoutForm").addEventListener("submit", async (e) =>
{
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token === null)
    {
        return alert("Please login first.");
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart.length) 
    {
        return alert("Cart is empty!");
    }

    const paymentMethod = document.getElementById("payment").value;
    const data = await apiPost("/orders", { items: cart, paymentMethod }, token);

    if (data._id)
    {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        location.href = "order-summary.html";
    }
    else
    {
        alert(data.message || "Failed to place order");
    }
});
