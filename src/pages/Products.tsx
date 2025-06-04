
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const allProducts = [
    {
      id: 1,
      name: 'Logitech MX Master 3',
      originalPrice: 399.99,
      salePrice: 249.99,
      condition: 'Excelente',
      image: '/placeholder.svg',
      rating: 4.8,
      reviews: 156,
      category: 'Mouse'
    },
    {
      id: 2,
      name: 'Corsair K70 RGB',
      originalPrice: 899.99,
      salePrice: 549.99,
      condition: 'Muito Bom',
      image: '/placeholder.svg',
      rating: 4.9,
      reviews: 203,
      category: 'Teclado'
    },
    {
      id: 3,
      name: 'HyperX Cloud II',
      originalPrice: 299.99,
      salePrice: 179.99,
      condition: 'Bom',
      image: '/placeholder.svg',
      rating: 4.7,
      reviews: 89,
      category: 'Headset'
    },
    {
      id: 4,
      name: 'LG UltraWide 29"',
      originalPrice: 1299.99,
      salePrice: 799.99,
      condition: 'Excelente',
      image: '/placeholder.svg',
      rating: 4.6,
      reviews: 45,
      category: 'Monitor'
    },
    {
      id: 5,
      name: 'Razer DeathAdder V3',
      originalPrice: 199.99,
      salePrice: 129.99,
      condition: 'Muito Bom',
      image: '/placeholder.svg',
      rating: 4.8,
      reviews: 134,
      category: 'Mouse'
    },
    {
      id: 6,
      name: 'SteelSeries Arctis 7',
      originalPrice: 449.99,
      salePrice: 289.99,
      condition: 'Excelente',
      image: '/placeholder.svg',
      rating: 4.7,
      reviews: 78,
      category: 'Headset'
    },
    {
      id: 7,
      name: 'Xbox Controller',
      originalPrice: 249.99,
      salePrice: 159.99,
      condition: 'Bom',
      image: '/placeholder.svg',
      rating: 4.5,
      reviews: 92,
      category: 'Controle'
    },
    {
      id: 8,
      name: 'Logitech C920',
      originalPrice: 299.99,
      salePrice: 189.99,
      condition: 'Muito Bom',
      image: '/placeholder.svg',
      rating: 4.6,
      reviews: 67,
      category: 'Webcam'
    }
  ];

  const categories = ['all', 'Mouse', 'Teclado', 'Headset', 'Monitor', 'Controle', 'Webcam'];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Todos os Produtos</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as Categorias</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
