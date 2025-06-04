
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Periféricos Usados com
              <span className="text-yellow-300"> Qualidade Garantida</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Encontre os melhores periféricos seminovos com até 70% de desconto. 
              Teclados, mouses, headsets e muito mais com garantia de 90 dias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Ver Produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Como Funciona
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-400 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-yellow-800" />
                </div>
                <div>
                  <p className="font-semibold">Entrega Rápida</p>
                  <p className="text-sm text-blue-200">Em até 3 dias úteis</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-400 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-green-800" />
                </div>
                <div>
                  <p className="font-semibold">Garantia</p>
                  <p className="text-sm text-blue-200">90 dias em todos produtos</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-purple-400 p-2 rounded-lg">
                  <Truck className="h-5 w-5 text-purple-800" />
                </div>
                <div>
                  <p className="font-semibold">Frete Grátis</p>
                  <p className="text-sm text-blue-200">Acima de R$ 199</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">2000+</p>
                  <p className="text-sm">Produtos</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-sm">Satisfação</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">50k+</p>
                  <p className="text-sm">Clientes</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">70%</p>
                  <p className="text-sm">Economia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
