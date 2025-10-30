const jwt = require("jsonwebtoken");

function authRequired(req, res, next)
{
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
    {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = header.split(" ")[1];
    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (errors)
    {
        res.status(401).json({ message: "wrong or expired token" });
    }
}
function adminOnly(req, res, next)
{
    if (!req.user || req.user.role !== "admin")
    {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
}

module.exports = { authRequired, adminOnly };
