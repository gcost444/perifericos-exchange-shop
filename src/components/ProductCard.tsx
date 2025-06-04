
import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  condition: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPercent = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excelente': return 'bg-green-100 text-green-800';
      case 'Muito Bom': return 'bg-blue-100 text-blue-800';
      case 'Bom': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          -{discountPercent}%
        </div>
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
        
        {/* Condition Badge */}
        <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product.condition)}`}>
          {product.condition}
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews} avaliações)
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-800">
              R$ {product.salePrice.toFixed(2)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-green-600 font-medium">
            Economia de R$ {(product.originalPrice - product.salePrice).toFixed(2)}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
          <Button variant="outline" size="sm">
            Ver Detalhes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
