require("dotenv").config();
const express = require("express");

require("./db/db");

const Customer = require("./Customer");

const app = express();
const port = 5000;

app.use(express.json());

app.get("/customers", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {    
        res.status(500).json({ error: error.message });
    }
});

app.post("/customers", async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

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

app.listen(port, () => {
    console.log(`Server is running on port ${port} this is costomer service`);
});