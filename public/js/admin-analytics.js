(async function ()
{
    const token = getToken();
    const payload = decodeToken(token);
    if (!payload || payload.role !== "admin")
    {
        alert("Admins only!");
        location.href = "login.html";
        return;
    }
    const analytics = await apiGet("/admin/analytics", token);
    new Chart(document.getElementById("salesChart"),
    {
        type: "line",
        data:
        {
            labels: analytics.months,
            datasets:
            [
                {
                    label: "Sales ($)",
                    data: analytics.sales,
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37,99,235,0.2)",
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options:
        { 
            responsive: true,
            scales: 
            { 
                y: 
                { 
                    beginAtZero: true
                }
            }
        }
    });
    new Chart(document.getElementById("topProductsChart"),
    {
        type: "bar",
        data:
        {
            labels: analytics.topProducts.map(p => p.name),
            datasets:
            [
                {
                    label: "Units Sold",
                    data: analytics.topProducts.map(p => p.count),
                    backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]
                }
            ]
        },
        options:
        {
            responsive: true,
            plugins:
            { 
                legend:
                {
                    display: false
                }
            }
        }
    });
})();
