import express from "express";
import Product from "./models/product.model.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

app.post("/products", async (req, res) => {
    const { name, price, description } = req.body;

    const newProduct = await Product.create({ name, price, description });
    res.send(newProduct);
});

app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.send(deletedProduct);
});

export default app;
