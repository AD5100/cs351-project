const loginForm = document.getElementById("loginForm");
if (loginForm !== null)
{
    loginForm.addEventListener("submit", async (e) =>
        {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const data = await apiPost("/auth/login", { email, password });
            if (data.token)
            {
                localStorage.setItem("token", data.token);
                alert("Login successful!");
                location.href = "index.html";
            }
            else
            {
                alert(data.message || "Login failed");
            }
        }
    );
}
const registerForm = document.getElementById("registerForm");
if (registerForm !== null)
{
    registerForm.addEventListener("submit", async (e) =>
        {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const data = await apiPost("/auth/register", { name, email, password });
            if (data.user)
            {
                alert("Account created! Please login.");
                location.href = "login.html";
            }
            else
            {
                alert(data.message || "Registration failed");
            }
        }
    );
}
