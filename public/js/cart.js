function loadCart()
{
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const tbody = document.querySelector("tbody");
    let total = 0;
    tbody.innerHTML = "";
    if (!cart.length)
    {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Your cart is empty.</td></tr>`;
    }
    cart.forEach((item, idx) =>
    {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        tbody.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>${item.quantity}</td>
            <td>$${subtotal}</td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="removeItem(${idx})">Remove</button></td>
        </tr>
        `;
    });
    document.getElementById("cartTotal").innerText = `Total: $${total}`;
}

function removeItem(i)
{
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.splice(i,1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}
loadCart();
