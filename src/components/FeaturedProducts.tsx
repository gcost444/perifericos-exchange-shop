
import React from 'react';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const featuredProducts = [
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
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecionamos os melhores periféricos com as melhores condições e preços imperdíveis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Ver Todos os Produtos
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
