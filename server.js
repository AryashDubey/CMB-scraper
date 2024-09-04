const express = require('express');
const searchProduct = require('./scraper');

const app = express();
const PORT = process.env.PORT || 8080;

// Endpoint to scrape product data
app.get('/scrape', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send({ error: 'Query parameter `q` is required' });
    }

    try {
        const products = await searchProduct(query);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while scraping the product data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
