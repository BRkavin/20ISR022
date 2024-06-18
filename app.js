const express = require('express');
const mongoose = require('mongoose');
const app = express();

const url = 'mongodb://localhost/Products';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;

con.on('open', () => {
    console.log('connected to MongoDB...');
});

app.use(express.json());

// Include the new products routes
const productsRouter = require('./routes/products');
app.use('/api', productsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
