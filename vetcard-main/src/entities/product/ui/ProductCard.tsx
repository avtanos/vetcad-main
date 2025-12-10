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
      className="rounded-lg shadow-md bg-white overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.02] transform flex flex-col h-full"
    >
      {/* Изображение товара */}
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
        <img
          src={product.img_url}
          alt={product.name_ru}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.png';
          }}
        />
        {!product.is_active && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Недоступен
          </div>
        )}
        {product.stock_quantity !== undefined && product.stock_quantity === 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Нет в наличии
          </div>
        )}
      </div>
      
      {/* Информация о товаре */}
      <div className="p-4 flex flex-col flex-grow">
        {product.subcategory && (
          <div className="text-xs text-teal-600 mb-1 font-medium">
            {product.subcategory.name_ru}
          </div>
        )}
        <h2 className="text-lg font-bold mb-2 text-slate-800 line-clamp-2 min-h-[3rem]">
          {product.name_ru}
        </h2>
        <p className="text-slate-600 text-sm mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        {/* Цена и количество */}
        <div className="mt-auto pt-3 border-t border-slate-200">
          {product.price ? (
            <div className="text-xl font-bold text-green-600 mb-2">
              {product.price} сом
            </div>
          ) : (
            <div className="text-sm text-slate-500 mb-2">Цена не указана</div>
          )}
          {product.stock_quantity !== undefined && (
            <div className="text-xs text-slate-500">
              {product.stock_quantity > 0 ? (
                <span className="text-green-600">✓ В наличии: {product.stock_quantity} шт.</span>
              ) : (
                <span className="text-red-600">✗ Нет в наличии</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
