async function loadProducts(search="")
{
    const products = await apiGet(`/products${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    const list = document.getElementById("productList");
    list.innerHTML = "";

    if (!products.length)
    {
        list.innerHTML = `<div class="col-12"><div class="alert alert-warning">No products found.</div></div>`;
        return;
    }

    products.forEach(p => {
        list.innerHTML += `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100">
            <img src="${p.image}" alt="${p.name}" class="product-img">
            <div class="card-body d-flex flex-column">
                <h5 class="mb-1">${p.name}</h5>
                <div class="text-muted small mb-2">${(p.description||"").slice(0,80)}${p.description?.length>80?"…":""}</div>
                <div class="d-flex align-items-center justify-content-between mt-auto">
                <span class="fw-bold">$${p.price}</span>
                <button class="btn btn-primary btn-sm" onclick="addToCart('${p._id}','${p.name.replace(/'/g,"&#39;")}',${p.price})">Add</button>
                </div>
            </div>
            </div>
        </div>
        `;
    });
}

function addToCart(id,name,price){
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const match = cart.find(i => i.product===id);
    if (match) 
    {
        match.quantity += 1;
    }
    else 
    {
        cart.push({ product:id, name, price, quantity:1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}
document.getElementById("search").addEventListener("input", e => loadProducts(e.target.value));
loadProducts();
