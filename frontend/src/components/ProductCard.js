import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaEye, FaHeart, FaStar } from "react-icons/fa";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const stockQuantity = product.stock_quantity || 0;
  const isOutOfStock = stockQuantity === 0;
  const isLowStock = stockQuantity > 0 && stockQuantity < 10;

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="product-image-container">
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          className="product-image"
        />

        {/* Overlay with quick actions */}
        <div className="product-overlay">
          <div className="quick-actions">
            <Link to={`/product/${product.id}`} className="quick-action-btn" title="View Details">
              <FaEye />
            </Link>
            <button className="quick-action-btn" title="Add to Wishlist">
              <FaHeart />
            </button>
            <button
              className={`quick-action-btn cart-btn ${isOutOfStock ? 'disabled' : ''}`}
              onClick={() => !isOutOfStock && addToCart(product)}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>

        {/* Status badges */}
        {isOutOfStock && <div className="status-badge out-of-stock-badge">Out of Stock</div>}
        {isLowStock && <div className="status-badge low-stock-badge">Only {stockQuantity} left!</div>}
        {!isOutOfStock && !isLowStock && <div className="status-badge in-stock-badge">In Stock</div>}

        {/* Category badge */}
        {product.category_name && (
          <div className="category-badge">{product.category_name}</div>
        )}
      </div>

      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name" title={product.name}>{product.name}</h3>
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < 4 ? 'star-filled' : 'star-empty'} />
            ))}
            <span className="rating-text">(4.0)</span>
          </div>
        </div>

        <p className="product-description" title={product.description}>
          {product.description?.slice(0, 80)}...
        </p>

        <div className="product-footer">
          <div className="price-section">
            <span className="current-price">₹{product.price}</span>
            <span className="original-price">₹{(product.price * 1.2).toFixed(0)}</span>
            <span className="discount">17% OFF</span>
          </div>

          <div className="stock-info">
            <span className={`stock-indicator ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}>
              {isOutOfStock ? 'Out of Stock' : `${stockQuantity} available`}
            </span>
          </div>
        </div>

        <div className="product-actions">
          <Link to={`/product/${product.id}`} className="btn btn-outline">
            View Details
          </Link>
          <button
            className={`btn btn-primary ${isOutOfStock ? 'disabled' : ''}`}
            onClick={() => !isOutOfStock && addToCart(product)}
            disabled={isOutOfStock}
          >
            <FaShoppingCart className="btn-icon" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
