(async function() {
    const token = getToken();
    if (token === null)
    {
        alert("Please login first.");
        location.href = "login.html";
        return;
    }
    const orders = await apiGet("/orders", token);
    const container = document.getElementById("ordersContainer");
    if (orders.length === 0)
    {
        container.innerHTML = `<div class="alert alert-info">You have not placed any orders yet.</div>`;
        return;
    }
    container.innerHTML = orders.map(o => `
        <div class="col-md-6">
        <div class="card order-card p-3 h-100" data-id="${o._id}">
            <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Order Total: $${o.totalAmount}</h5>
            <span class="badge bg-secondary">${o.status || "Pending"}</span>
            </div>
            <p class="order-id mt-1">Order ID: ${o._id}</p>
            <p class="text-muted mb-1"><i class="bi bi-wallet2"></i> ${o.paymentMethod}</p>
            <p class="text-muted mb-0"><i class="bi bi-calendar"></i> ${new Date(o.createdAt).toLocaleDateString()}</p>
        </div>
        </div>
    `).join("");
    document.querySelectorAll(".order-card").forEach(card =>
    {
        card.addEventListener("click", async () => {
        const id = card.dataset.id;
        const detail = await apiGet(`/orders/${id}`, token);
        showOrderModal(detail);
        });
    });
    function showOrderModal(order)
    {
        const modalBody = document.getElementById("orderDetailBody");
        let total = 0;
        const itemsHTML = order.items.map(i => {
        const productName = i.product?.name || i.name || "Unnamed Product";
        const price = i.product?.price || i.price || 0;
        const subtotal = price * i.quantity;
        total += subtotal;
        return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
            ${productName} <span>$${subtotal.toFixed(2)} (${i.quantity}×)</span>
            </li>`;
        }).join("");
        modalBody.innerHTML = `
        <p><strong>Order ID:</strong> ${order._id}</p>
        <ul class="list-group mb-3">${itemsHTML}</ul>
        <h5>Total: $${total.toFixed(2)}</h5>
        <p class="text-muted">Payment: ${order.paymentMethod}</p>
        <p class="text-muted">Status: ${order.status}</p>
        `;
        const modal = new bootstrap.Modal(document.getElementById("orderModal"));
        modal.show();
    }
})();
