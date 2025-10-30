(async function ()
{
    const token = getToken();
    const payload = decodeToken(token);
    if (!payload || payload.role !== "admin")
    {
        alert("Admin access only!");
        location.href = "login.html";
        return;
    }
    const list = document.getElementById("productList");
    const form = document.getElementById("addProductForm");
    async function loadProducts()
    {
        const products = await apiGet("/products", token);
        list.innerHTML = `
        <table class="table table-striped align-middle">
            <thead><tr><th>Name</th><th>Price</th><th>Image</th><th>Actions</th></tr></thead>
            <tbody>
            ${products.map(p => `
                <tr>
                <td>${p.name}</td>
                <td>$${p.price}</td>
                <td><img src="${p.image}" style="height:50px;"></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editProduct('${p._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p._id}')">Delete</button>
                </td>
                </tr>`).join("")}
            </tbody>
        </table>
        `;
    }

    window.deleteProduct = async function(id)
    {
        if (!confirm("Delete this product?")) 
        {
            return;
        }
        await apiPost(`/admin/delete-product`, { id }, token);
        alert("Deleted!");
        loadProducts();
    };

    window.editProduct = async function(id)
    {
        const price = prompt("Enter new price:");
        if (!price) 
        {
            return;
        }
        await apiPost(`/admin/edit-product`, { id, price }, token);
        alert("Updated!");
        loadProducts();
    };

    form.addEventListener("submit", async (e) =>
    {
        e.preventDefault();
        const data = {
            name: document.getElementById("name").value,
            price: parseFloat(document.getElementById("price").value),
            image: document.getElementById("image").value,
        };
        await apiPost("/admin/add-product", data, token);
        form.reset();
        loadProducts();
    });

    loadProducts();
})();
