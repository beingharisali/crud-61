const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Database connected Successfully`);
  })
  .catch((err) => {
    console.log(err);
  });

const productSchema = new mongoose.Schema({
  title: String,
  desc: String,
  price: Number,
  rating: Number,
  reviews: String,
  productImage: String,
});
const ProductModel = mongoose.model("product", productSchema);
const port = process.env.PORT;

app.use(express.json());

app.post("/products", (req, res) => {
  const productData = new ProductModel({
    title: req.body.title,
    desc: req.body.desc,
    price: req.body.price,
    rating: req.body.rating,
    reviews: req.body.reviews,
    productImage: req.body.productImage,
  });
  productData.save();
  res.send(productData);
});
app.get("/products", async (req, res) => {
  const productData = await ProductModel.find({});
  res.send(productData);
});
app.delete("/products/:id", async (req, res) => {
  console.log(req.params.id);
  const product = await ProductModel.findByIdAndDelete(req.params.id);
  res.send(`Product with id ${req.params.id} has been deleted successfully`);
});
app.patch("/products/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const product = await ProductModel.findByIdAndUpdate(id, body, { new: true });
  res.send(product);
});

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
