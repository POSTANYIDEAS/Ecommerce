import React from "react";
import "./css/ProductCard.css";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img
        src={`http://localhost:5000/uploads/${product.image}`}
        alt={product.name}
        className="product-image"
      />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>
      <p className="product-description">{product.description.slice(0, 60)}...</p>
    </div>
  );
}

export default ProductCard;