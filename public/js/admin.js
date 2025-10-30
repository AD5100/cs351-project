(async function ()
{
    const token = getToken();
    if (token === null)
    { 
        alert("Please log in as admin first.");
        location.href="login.html";
        return;
    }
    const payload = decodeToken(token);
    if (!payload || payload.role !== "admin")
    { 
        alert("Access denied.");
        location.href="index.html";
        return;
    }
    const stats = await apiGet("/admin/stats", token);
    const el = document.getElementById("stats");
    if (stats.totalOrders !== undefined)
    {
        el.innerHTML = `
        <div class="col-md-4">
            <div class="card text-white" style="background: var(--primary);">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div><h5>Total Orders</h5><h3>${stats.totalOrders}</h3></div>
                <i class="bi bi-bag-check" style="font-size:2.4rem;opacity:.85;"></i>
            </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-dark" style="background: #d1fae5;">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div><h5>Total Sales</h5><h3>$${stats.totalSales}</h3></div>
                <i class="bi bi-cash-coin" style="font-size:2.4rem;opacity:.85;"></i>
            </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-dark" style="background: #fef3c7;">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div><h5>Total Products</h5><h3>${stats.totalProducts}</h3></div>
                <i class="bi bi-box-seam" style="font-size:2.4rem;opacity:.85;"></i>
            </div>
            </div>
        </div>
        `;
    }
    else
    {
        el.innerHTML = `<div class="alert alert-danger">${stats.message || "Not authorized."}</div>`;
    }
})();
