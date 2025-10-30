const THEMES =
[
    { 
        value: "classic",
        label: "Classic Store"
    },
    { 
        value: "dark",
        label: "Modern Tech (Dark)"
    },
    { 
        value: "minimal",
        label: "Minimal White"
    },
    { 
        value: "vibrant",
        label: "Vibrant (Red/Orange)"
    },
];

function applyTheme(theme)
{
    const t = theme || localStorage.getItem("theme") || "classic";
    document.documentElement.setAttribute("data-theme", t === "classic" ? "" : t);
    localStorage.setItem("theme", t);
}

function themeSelectEl()
{
    const current = localStorage.getItem("theme") || "classic";
    const opts = THEMES.map(t => `<option value="${t.value}" ${t.value===current?'selected':''}>${t.label}</option>`).join("");
    return `<select id="themeSelect" class="theme-select">${opts}</select>`;
}

function getToken()
{ 
    return localStorage.getItem("token");
}
function decodeToken(t)
{
    try 
    { 
        return JSON.parse(atob(t.split(".")[1])); 
    }
    catch
    { 
        return null;
    }
}
function getRole()
{
    const t = getToken(); 
    if(t === null) 
    {
        return null;
    }
    const p = decodeToken(t); 
    return p?.role || null;
}
function logout()
{
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    location.href = "login.html";
}
window.logout = logout;

function renderNavbar()
{
    const role = getRole();
    const authed = !!role;
    const left = `<a class="navbar-brand fw-bold" href="index.html">MyStore</a>`;
    let buttons = `${themeSelectEl()}`;
    if (authed && role === "admin")
    {
        buttons += `
        <a href="admin.html" class="btn btn-outline-light">Dashboard</a>
        <a href="admin-inventory.html" class="btn btn-outline-light">Inventory</a>
        <a href="admin-analytics.html" class="btn btn-outline-light">Analytics</a>
        `;
    }
    else if (authed && role === "user")
    {
        buttons += `
        <a href="orders.html" class="btn btn-outline-light">Orders</a>
        <a href="cart.html" class="btn btn-warning">Cart</a>
        `;
    }
    if (authed)
    {
        buttons += `<button class="btn btn-outline-light" onclick="logout()">Logout</button>`;
    }
    else
    {
        buttons += `
        <a href="login.html" class="btn btn-outline-light">Login</a>
        <a href="register.html" class="btn btn-primary">Register</a>
        `;
    }
    const nav = document.getElementById("app-nav");
    if (nav !== null)
    {
        nav.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
            <div class="container d-flex justify-content-between">
            <div>${left}</div>
            <div class="d-flex align-items-center gap-2">${buttons}</div>
            </div>
        </nav>
        `;
        document.getElementById("themeSelect")?.addEventListener("change", (e) =>
        {
            applyTheme(e.target.value);
        });
    }
}


function renderFooter()
{
    const f = document.getElementById("app-footer");
    if (f === null) 
    {
        return;
    }
    f.innerHTML = `
        <footer class="site-footer py-4">
        <div class="container text-center">
            © ${new Date().getFullYear()} MyStore • Built by XYZ
        </div>
        </footer>
    `;
}

applyTheme();
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  renderFooter();
});
