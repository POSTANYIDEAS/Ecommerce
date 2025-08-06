import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RecentProductsSlider from '../../components/RecentProductsSlider';
import { useCart } from '../../context/CartContext';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // ✅ Access cart context

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        // Fetch basic product info
        const productRes = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(productRes.data);

        // Fetch detailed product info
        const detailsRes = await axios.get(`http://localhost:5000/api/product-details/product/${id}`);
        setProductDetails(detailsRes.data);

      } catch (err) {
        console.error('Error fetching product data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
  <div className="product-main-grid"> {/* was grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 */}
    <div className="product-images space-y-4">
      <div className="main-product-image rounded-lg shadow-lg overflow-hidden aspect-square">
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      {productDetails && productDetails.images && productDetails.images.length > 0 && (
        <div className="additional-images-grid grid grid-cols-4 gap-2">
          {productDetails.images.map((image, index) => (
            <div key={index} className="rounded-md shadow overflow-hidden aspect-square">
              <img
                src={`http://localhost:5000/uploads/${image}`}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="product-info space-y-6">
      <div>
        <h1>{product.name}</h1>
        <div className="price-stock">
          <p>₹{product.price}</p>
          {product.stock_quantity !== undefined && (
            <span className={`stock-status ${
              product.stock_quantity > 10
                ? 'stock-green'
                : product.stock_quantity > 0
                ? 'stock-yellow'
                : 'stock-red'
            }`}>
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
            </span>
          )}
        </div>
      </div>

      {product.description && (
        <div>
          <h3>Description</h3>
          <p className="description">{product.description}</p>
        </div>
      )}

      <div>
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock_quantity === 0}
          className={`add-to-cart-btn ${
            product.stock_quantity === 0 ? 'disabled' : 'enabled'
          }`}
        >
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  </div>

  {productDetails && (
    <div className="detailed-info">
      <h2>Product Details</h2>

      <div className="detailed-info-grid">
        {productDetails.description && (
          <div>
            <h3>Detailed Description</h3>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: productDetails.description }}
            />
          </div>
        )}

        <div className="space-y-6">
          {productDetails.advantages && (
            <div className="advantages">
              <h3>✅ Advantages</h3>
              {productDetails.advantages.split('\r\n').filter(line => line.trim()).map((line, idx) => (
                <p key={idx}>• {line.trim()}</p>
              ))}
            </div>
          )}

          {productDetails.disadvantages && (
            <div className="disadvantages">
              <h3>❌ Disadvantages</h3>
              {productDetails.disadvantages.split('\r\n').filter(line => line.trim()).map((line, idx) => (
                <p key={idx}>• {line.trim()}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )}
  <div className="recent-products-section">
  <h2>You might also like</h2>
  <div className="recent-products-slider-container">
    <div className="recent-products-slider-wrapper">
      <RecentProductsSlider />
    </div>
  </div>
</div>
</div>

  );
}

export default ProductDetails;
