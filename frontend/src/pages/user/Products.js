// frontend/src/pages/user/Products.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <main className="products-grid" aria-label="All Products">
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map(product => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-link" aria-label={`View details of ${product.name}`}>
            <ProductCard product={product} />
          </Link>
        ))
      )}
    </main>
  );
}