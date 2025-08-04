import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function RecentProductsSlider() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products?limit=10&sort=desc')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } }
    ]
  };

  return (
    <Slider {...settings}>
      {products.map(p => (
        <Link key={p.id} to={`/product/${p.id}`} className="px-2">
          <div className="border p-2 rounded shadow">
            <img src={`http://localhost:5000/uploads/${p.image}`} alt={p.name} className="h-32 w-full object-cover rounded" />
            <h3 className="text-sm font-semibold mt-2">{p.name}</h3>
          </div>
        </Link>
      ))}
    </Slider>
  );
}

export default RecentProductsSlider;
