require("dotenv").config();
const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose"); // Add this line

require("./db/db");

const Order = require("./Order");

const app = express();
const port = 9000;

app.use(express.json());

app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/orders", async (req, res) => {
    try {
        const order = new Order({
            customerId: req.body.customerId, // No need for mongoose.Types.ObjectId
            bookId: req.body.bookId,         // No need for mongoose.Types.ObjectId
            initialDate: req.body.initialDate,
            deliveryDate: req.body.deliveryDate
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.get("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/orders/:id", async (req, res) => {
    Order.findByIdAndDelete(req.params.id).then((order) => {
        if (order) {
            axios.get(`http://localhost:5000/customers/${order.customerId}`).then((response) => {
                let orderObject = {
                    CustomerName: response.data.name,
                    CustomerAge: response.data.age,
                    CustomerAddress: response.data.address,
                    BookTitle: order.bookId.title,
                    BookAuthor: order.bookId.author,
                    BookNumberPages: order.bookId.numberPages,
                    BookPublisher: order.bookId.publisher,
                    InitialDate: order.initialDate,
                    DeliveryDate: order.deliveryDate
                };
                axios.post("http://localhost:3004/orders", orderObject).then((response) => {
                    orderObject.BookTitle = response.data.title;
                    res.json(orderObject);
                });
            });
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    }).catch((error) => {
        res.status(500).json({ error: error.message });
    });
});

app.put("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/orders/customer/:customerId", async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.params.customerId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get("/orders/book/:bookId", async (req, res) => {
    try {
        const orders = await Order.find({ bookId: req.params.bookId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port} this is orders service`);
});
