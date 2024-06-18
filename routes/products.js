const axios = require('axios');
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const router = express.Router();
router.use(cors()); // Enable CORS
router.use(express.json()); // Enable JSON parsing

const BASE_URL = 'http://20.244.56.144/test'; // Adjust this to your external API URL

const generateProductId = (product) => {
    return crypto.createHash('md5').update(JSON.stringify(product)).digest('hex');
};

const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4Njk2NzM1LCJpYXQiOjE3MTg2OTY0MzUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZiMmIyYWEzLTExODctNDNmYy05YWMzLTA3NDYxY2ZiZWY4NSIsInN1YiI6ImthdmluYnIuMjBtc2NAa29uZ3UuZWR1In0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiI2YjJiMmFhMy0xMTg3LTQzZmMtOWFjMy0wNzQ2MWNmYmVmODUiLCJjbGllbnRTZWNyZXQiOiJuZFpFb0lXa3RLQkJCSWZ4Iiwib3duZXJOYW1lIjoiS2F2aW4iLCJvd25lckVtYWlsIjoia2F2aW5ici4yMG1zY0Brb25ndS5lZHUiLCJyb2xsTm8iOiIyMElTUjAyMiJ9.2rSq_sz-Xq9v7pdhRuDI1z4LI6SL4H3IF0GjuMuIA1c'; // Replace with your actual Bearer token

const axiosConfig = {
    headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
    }
};

router.get('/companies/:company/categories/:category/products', async (req, res) => {
    const { company, category } = req.params;
    const { top, minPrice, maxPrice, sort_by, order } = req.query;

    const url = `${BASE_URL}/companies/${company}/categories/${category}/products`;

    try {
        const response = await axios.get(url, {
            params: { top, minPrice, maxPrice, sort_by, order },
            ...axiosConfig
        });

        const products = response.data.map(product => ({
            ...product,
            company,
            id: generateProductId(product)
        }));

        // Sorting products based on sort_by and order criteria
        products.sort((a, b) => {
            if (order === 'asc') return a[sort_by] - b[sort_by];
            return b[sort_by] - a[sort_by];
        });

        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products');
    }
});

router.get('/companies/:company/categories/:category/products/:productid', async (req, res) => {
    const { company, category, productid } = req.params;

    try {
        const response = await axios.get(`${BASE_URL}/companies/${company}/categories/${category}/products`, axiosConfig);
        const product = response.data.find(p => generateProductId(p) === productid);

        if (product) {
            res.json({ ...product, company, id: productid });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error('Error fetching product details:', err);
        res.status(500).send('Error fetching product details');
    }
});

module.exports = router;
