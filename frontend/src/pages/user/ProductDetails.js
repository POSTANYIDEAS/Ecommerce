import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RecentProductsSlider from '../../components/RecentProductsSlider';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          className="w-full rounded-lg shadow"
        />
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-green-600 text-xl mt-2">₹{product.price}</p>
          <p className="mt-4">{product.description}</p>
        </div>
      </div>

      {/* Recently Added Products Slider */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Recently Added Products</h2>
      <RecentProductsSlider />
    </div>
  );
}

export default ProductDetails;
