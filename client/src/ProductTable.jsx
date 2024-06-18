import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Laptop');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4Njk2NzM1LCJpYXQiOjE3MTg2OTY0MzUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZiMmIyYWEzLTExODctNDNmYy05YWMzLTA3NDYxY2ZiZWY4NSIsInN1YiI6ImthdmluYnIuMjBtc2NAa29uZ3UuZWR1In0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiI2YjJiMmFhMy0xMTg3LTQzZmMtOWFjMy0wNzQ2MWNmYmVmODUiLCJjbGllbnRTZWNyZXQiOiJuZFpFb0lXa3RLQkJCSWZ4Iiwib3duZXJOYW1lIjoiS2F2aW4iLCJvd25lckVtYWlsIjoia2F2aW5ici4yMG1zY0Brb25ndS5lZHUiLCJyb2xsTm8iOiIyMElTUjAyMiJ9.2rSq_sz-Xq9v7pdhRuDI1z4LI6SL4H3IF0GjuMuIA1c'; // Replace with your actual Bearer token
      const response = await axios.get(
        `http://localhost:3001/api/companies/AMZ/categories/${category}/products`,
        {
          params: {
            top: 10,
            minPrice: 1,
            maxPrice: 10000,
            sort_by: 'rating',
            order: 'desc'
          },
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`
          }
        }
      );
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Top Products in {category}</h1>
      <label>
        Category:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Laptop">Laptop</option>
          <option value="Phone">Phone</option>
          <option value="Tablet">Tablet</option>
          <option value="Headset">Headset</option>
          {/* Add more categories as needed */}
        </select>
      </label>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Price</th>
              <th>Rating</th>
              <th>Discount</th>
              <th>Availability</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.price}</td>
                <td>{product.rating}</td>
                <td>{product.discount}</td>
                <td>{product.availability}</td>
                <td>{product.company}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductTable;
