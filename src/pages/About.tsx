
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Truck, Clock, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Sobre a PeriféricosTech</h1>
            <p className="text-xl text-gray-600">
              Sua loja de confiança para periféricos usados com qualidade garantida
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nossa História</h2>
              <p className="text-gray-600 mb-4">
                Fundada em 2020, a PeriféricosTech nasceu da necessidade de tornar a tecnologia mais acessível. 
                Percebemos que muitos gamers e profissionais não conseguiam adquirir periféricos de qualidade devido aos altos preços.
              </p>
              <p className="text-gray-600">
                Criamos um processo rigoroso de seleção e recondicionamento, garantindo que cada produto 
                atenda aos nossos padrões de qualidade antes de chegar às suas mãos.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nossa Missão</h2>
              <p className="text-gray-600 mb-4">
                Democratizar o acesso a periféricos de alta qualidade através da economia circular, 
                oferecendo produtos seminovos com garantia e preços justos.
              </p>
              <p className="text-gray-600">
                Acreditamos que todos merecem ter acesso aos melhores equipamentos, independentemente do orçamento.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Garantia</h3>
              <p className="text-sm text-gray-600">90 dias em todos os produtos</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Entrega</h3>
              <p className="text-sm text-gray-600">Frete grátis acima de R$ 199</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Rapidez</h3>
              <p className="text-sm text-gray-600">Entrega em até 3 dias úteis</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Confiança</h3>
              <p className="text-sm text-gray-600">+50k clientes satisfeitos</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Nosso Processo de Qualidade</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                <h3 className="font-semibold mb-2">Inspeção Técnica</h3>
                <p className="text-sm text-gray-600">Cada produto passa por uma análise técnica completa</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                <h3 className="font-semibold mb-2">Limpeza e Recondicionamento</h3>
                <p className="text-sm text-gray-600">Produtos são limpos e recondicionados quando necessário</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                <h3 className="font-semibold mb-2">Teste Final</h3>
                <p className="text-sm text-gray-600">Testamos todas as funcionalidades antes do envio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
