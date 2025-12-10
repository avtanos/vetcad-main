import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../model/ProductTypes';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-lg shadow-md bg-white p-4 flex flex-col items-center max-w-xs cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform"
    >
      <img
        src={product.img_url}
        alt={product.name_ru}
        className="w-32 h-32 object-cover rounded mb-3 border"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder-product.png';
        }}
      />
      <h2 className="text-lg font-bold mb-1 text-center">{product.name_ru}</h2>
      <p className="text-slate-600 text-sm mb-2 text-center line-clamp-2">
        {product.description}
      </p>
      {product.user && (
        <div className="text-xs text-slate-400">Продавец ID: {product.user}</div>
      )}
    </div>
  );
};
