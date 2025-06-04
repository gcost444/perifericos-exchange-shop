
import React from 'react';
import { Mouse, Keyboard, Headphones, Monitor, Gamepad2, Webcam } from 'lucide-react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    { name: 'Mouses', icon: Mouse, count: 150, color: 'bg-blue-500', filter: 'Mouse' },
    { name: 'Teclados', icon: Keyboard, count: 120, color: 'bg-green-500', filter: 'Teclado' },
    { name: 'Headsets', icon: Headphones, count: 80, color: 'bg-purple-500', filter: 'Headset' },
    { name: 'Monitores', icon: Monitor, count: 45, color: 'bg-orange-500', filter: 'Monitor' },
    { name: 'Controles', icon: Gamepad2, count: 60, color: 'bg-red-500', filter: 'Controle' },
    { name: 'Webcams', icon: Webcam, count: 30, color: 'bg-indigo-500', filter: 'Webcam' },
  ];

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Categorias Populares
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore nossa seleção cuidadosa de periféricos organizados por categoria
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index}
              to={`/products?category=${encodeURIComponent(category.filter)}`}
              className="group cursor-pointer bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} produtos</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
