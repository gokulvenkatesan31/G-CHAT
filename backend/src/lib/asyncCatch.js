const asyncCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      const message = err.message || "Internal Server Error";
      console.error(err);
      res.status(500).json({ message: message });
    });
  };
};
export default asyncCatch;
