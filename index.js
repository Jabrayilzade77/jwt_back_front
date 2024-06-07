import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

const TOKEN_KEY = "dnsbs@233ewoqfdewofhidwhissmlkxsd";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const productsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "User" },
});

const ProductsModel = mongoose.model("productsjwt", productsSchema);

app.get("/users", async (req, res) => {
  try {
    const token = req.headers.authorization.slice(7);
    const decoded = jwt.verify(token, TOKEN_KEY);
    if (decoded.role === "Admin") {
      const products = await ProductsModel.find({});
      return res.send(products);
    }

    res.status(401).json({ message: "yu dont have permission" });
  } catch (error) {
    res.status(403).json({ message: "Token is not valid" });
  }
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;
  const product = new ProductsModel({ email, password });
  await product.save();
  res.send(product);
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  const products = await ProductsModel.findByIdAndUpdate(id, {
    email,
    password,
  });
  res.send(products);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const products = await ProductsModel.findByIdAndDelete(id);
  res.send(products);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const product = new ProductsModel({ email, password });
  await product.save();
  res.send(product);
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await ProductsModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "email is not found" });
    }
    if (user.password !== password) {
      return res.status(403).json({ message: "password is wrong" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      TOKEN_KEY
    );

    res.status(200).json({ accessToken: token });
  } catch (error) {
    res.send({ message: "hatali islem" });
  }
});

mongoose
  .connect("mongodb+srv://yusif:yusif@yusif.fup3let.mongodb.net/")
  .then(() => console.log("Connected!"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
