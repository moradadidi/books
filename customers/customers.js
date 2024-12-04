require("dotenv").config();
const express = require("express");
const swaggerSetup = require('./swagger');
require("./db/db");

const Customer = require("./Customer");

const app = express();
const port = 5000;

app.use(express.json());

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
app.get("/customers", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {    
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               address:
 *                 type: string
 */
app.post("/customers", async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the customer to retrieve
 *         required: true
 *         schema:  
 *           type: integer
 *     responses:
 *       200:
 */

app.get("/customers/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: "Customer not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the customer to delete
 *         required: true
 *         schema:  
 *           type: integer
 *      responses:
 *        200:
 */
app.delete("/customers/:id", async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (customer) {
            res.json({ message: "Customer deleted successfully" });
        } else {
            res.status(404).json({ error: "Customer not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the customer to update
 *         required: true
 *         schema:  
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               address:
 *                 type: string
 *     responses:
 *       200:
 */

app.put("/customers/:id", async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: "Customer not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

swaggerSetup(app);


app.listen(port, () => {
    console.log(`Server is running on port ${port} this is costomer service`);
    console.log(`API docs available at http://localhost:${port}/api-docs`);
});