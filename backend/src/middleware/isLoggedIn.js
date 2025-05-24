import jwt from "jsonwebtoken";
const isLoggedIn = (req, res, next) => {
  if (req.cookies && req.cookies.token) {
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.userId = decoded.id;
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default isLoggedIn;
