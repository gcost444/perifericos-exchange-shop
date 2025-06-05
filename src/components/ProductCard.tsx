
import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  original_price: number;
  sale_price: number;
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
  const { addToCart, toggleWishlist, isInWishlist } = useApp();

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excelente': return 'bg-green-100 text-green-800';
      case 'Muito Bom': return 'bg-blue-100 text-blue-800';
      case 'Bom': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    toast({
      title: isInWishlist(product.id) ? "Removido da lista" : "Adicionado à lista",
      description: isInWishlist(product.id) 
        ? "Produto removido da lista de desejos" 
        : "Produto adicionado à lista de desejos",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isInWishlist(product.id) 
                ? 'text-red-500 fill-current' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
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
              R$ {product.sale_price.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleAddToCart} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
          <Link to={`/product/${product.id}`}>
            <Button variant="outline" size="sm">
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
