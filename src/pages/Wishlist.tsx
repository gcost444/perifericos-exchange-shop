
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApp } from '../contexts/AppContext';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems } = useApp();

  // Mock products data (in a real app, you'd fetch based on wishlist IDs)
  const wishlistProducts = [
    // Sample products for demonstration
  ];

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sua lista de desejos está vazia</h2>
            <p className="text-gray-600 mb-8">Adicione produtos que você gostou à sua lista de desejos!</p>
            <Link to="/products">
              <Button>Explorar Produtos</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Minha Lista de Desejos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wishlist products would be rendered here */}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
