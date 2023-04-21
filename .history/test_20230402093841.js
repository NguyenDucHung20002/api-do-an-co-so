exports.hello = (req, res) => {
  res.status(200).json({
    success: true,
    content: "hello",
  });
};
