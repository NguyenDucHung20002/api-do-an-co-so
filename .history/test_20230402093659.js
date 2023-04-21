exports.hello = (req, res) => {
  //   console.log(name, email, password);
  res.status(200).json({
    success: true,
    content: "hello",
  });
};
