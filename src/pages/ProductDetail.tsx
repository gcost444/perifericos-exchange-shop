
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  original_price: number;
  sale_price: number;
  condition: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  stock: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o produto.",
          variant: "destructive",
        });
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Produto não encontrado</div>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercent = Math.round(((product.original_price - product.sale_price) / product.original_price) * 100);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excelente': return 'bg-green-100 text-green-800';
      case 'Muito Bom': return 'bg-blue-100 text-blue-800';
      case 'Bom': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast({
      title: "Produto adicionado!",
      description: `${quantity}x ${product.name} adicionado ao carrinho.`,
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl"
            />
            
            {/* Discount Badge */}
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{discountPercent}%
            </div>
            
            {/* Condition Badge */}
            <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(product.condition)}`}>
              {product.condition}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} avaliações)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-800">
                  R$ {product.sale_price.toFixed(2)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  R$ {product.original_price.toFixed(2)}
                </span>
              </div>
              <p className="text-lg text-green-600 font-medium">
                Economia de R$ {(product.original_price - product.sale_price).toFixed(2)}
              </p>
            </div>

            {/* Stock */}
            <div className="text-sm text-gray-600">
              {product.stock > 0 ? (
                <span className="text-green-600">✓ {product.stock} em estoque</span>
              ) : (
                <span className="text-red-600">✗ Fora de estoque</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Quantidade:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={handleAddToCart} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button 
                variant="outline" 
                onClick={handleToggleWishlist}
                className="px-4"
              >
                <Heart 
                  className={`h-4 w-4 ${
                    isInWishlist(product.id) 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-600'
                  }`} 
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
