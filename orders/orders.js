require("dotenv").config();
const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose"); // Add this line
const swaggerSetup = require('./swagger');


require("./db/db");

const Order = require("./Order");
const swagger = require("./swagger");

const app = express();
const port = 9000;

app.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customerId
 *         - bookId
 *         - initialDate
 *         - deliveryDate
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the order
 *         customerId:
 *           type: string
 *           description: The ID of the customer
 *         bookId:
 *           type: string
 *           description: The ID of the book
 *         initialDate:
 *           type: string
 *           format: date
 *           description: The date when the order was placed
 *         deliveryDate:
 *           type: string
 *           format: date
 *           description: The expected delivery date
 *       example:
 *         id: 63f16d99b3c5360019bc765a
 *         customerId: 63f16d99b3c5360019bc765b
 *         bookId: 63f16d99b3c5360019bc765c
 *         initialDate: "2024-01-01"
 *         deliveryDate: "2024-01-10"
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

    /**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: The order was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 */

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

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
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

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: The updated order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */

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

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The order was deleted
 *       404:
 *         description: Order not found
 */

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


/**
 * @swagger
 * /orders/customer/{customerId}:
 *   get:
 *     summary: Get all orders for a specific customer
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: A list of orders for the specified customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
app.get("/orders/customer/:customerId", async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.params.customerId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


/**
 * @swagger
 * /orders/book/{bookId}:
 *   get:
 *     summary: Get all orders for a specific book
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: A list of orders for the specified book
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
app.get("/orders/book/:bookId", async (req, res) => {
    try {
        const orders = await Order.find({ bookId: req.params.bookId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


swaggerSetup(app);
app.listen(port, () => {
    console.log(`Server is running on port ${port} this is orders service`);
});
