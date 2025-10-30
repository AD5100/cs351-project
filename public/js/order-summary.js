(async function() {
    const token = getToken();
    if (token === null)
    {
        alert("Please login first.");
        location.href = "login.html";
        return;
    }
    const order = await apiGet("/orders/latest", token);
    const container = document.getElementById("orderDetails");
    if (!order || !order.items)
    {
        container.innerHTML = `<div class="alert alert-warning">No recent order found.</div>`;
        return;
    }
    let total = 0;
    const itemsHTML = order.items.map(i => 
    {
        const productName = i.product?.name || i.name || "Unnamed Product";
        const price = i.product?.price || i.price || 0;
        const subtotal = price * i.quantity;
        total += subtotal;
        return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
            ${productName}
            <span>$${subtotal.toFixed(2)}</span>
            </li>`;
    }).join("");

    container.innerHTML = `
        <p><strong>Order ID:</strong> ${order._id}</p>
        <ul class="list-group mb-3">${itemsHTML}</ul>
        <h5>Total: $${total}</h5>
        <p class="text-muted">Payment Method: ${order.paymentMethod}</p>
        <p class="text-muted">Status: ${order.status || "Pending"}</p>
    `;
})();
