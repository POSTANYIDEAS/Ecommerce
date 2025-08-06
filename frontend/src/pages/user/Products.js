// frontend/src/pages/user/Products.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // Get category from URL params
  const categoryFromUrl = searchParams.get('category');

  const fetchProducts = async (categoryId = '') => {
    try {
      setLoading(true);
      const url = categoryId
        ? `http://localhost:5000/api/products?category=${categoryId}`
        : 'http://localhost:5000/api/products';

      const res = await axios.get(url);
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      fetchProducts(categoryFromUrl);
    } else {
      setSelectedCategory('');
      fetchProducts();
    }
  }, [categoryFromUrl]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const selectedCategoryName = categories.find(cat => cat.id.toString() === selectedCategory)?.name || 'All Products';

  return (
    <div className="products-page">
      {/* Category Filter */}
      <div className="products-header">
        <h1>{selectedCategoryName}</h1>
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="category-buttons">
        <button
          className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('')}
        >
          All Products
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id.toString() ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id.toString())}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <main className="products-grid" aria-label="Products">
        {loading ? (
          <p className="loading-message">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="no-products">No products found in this category.</p>
        ) : (
          products.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-link" aria-label={`View details of ${product.name}`}>
              <ProductCard product={product} />
            </Link>
          ))
        )}
      </main>
    </div>
  );
}