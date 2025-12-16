import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, Users, ArrowRight, CheckCircle } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-900 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 text-center">
          <div className="inline-block bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-1 mb-6">
            <span className="text-green-100 text-sm font-semibold tracking-wide uppercase">Proyecto Fin de Grado / Ciclo</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Murcia <span className="text-green-300">Sostenible</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-10 font-light">
            La plataforma integral para estudiantes de hostelería. Diseña, gestiona y documenta tu proyecto de restauración sostenible paso a paso.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="bg-white text-green-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
            >
              Comenzar Proyecto <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Tu compañero digital de proyecto</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Olvídate de documentos dispersos. Esta app centraliza todo el trabajo de tu equipo, desde la idea inicial hasta la memoria final.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de Equipos</h3>
            <p className="text-gray-600 leading-relaxed">
              Define roles, reparte tareas y colabora. Cada miembro tiene su espacio, pero todos contribuyen al mismo objetivo.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
              <ChefHat size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Diseño Gastronómico</h3>
            <p className="text-gray-600 leading-relaxed">
              Crea fichas técnicas profesionales, gestiona alérgenos y diseña tu carta basándote en productos locales de Murcia.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
              <Calculator size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Viabilidad Económica</h3>
            <p className="text-gray-600 leading-relaxed">
              Calculadora de escandallos integrada. Controla costes, márgenes y fija precios de venta reales y rentables.
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Un flujo de trabajo estructurado</h2>
              <div className="space-y-6">
                {[
                  "Selección de Zona y Equipo",
                  "Análisis de Mercado y Concepto",
                  "Diseño de Oferta Gastronómica",
                  "Prototipado Visual (Carta)",
                  "Análisis Financiero (Escandallos)",
                  "Generación de Memoria PDF"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <CheckCircle className="text-green-400 flex-shrink-0" />
                    <span className="text-lg text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
               <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-green-400" />
                  <h3 className="text-xl font-bold">Generación Automática</h3>
               </div>
               <p className="text-gray-400 mb-6">
                 Al finalizar tu trabajo, la aplicación compila toda la información (investigaciones, recetas, justificaciones, equipo) en un documento estructurado listo para imprimir o guardar como PDF.
               </p>
               <div className="p-4 bg-gray-900 rounded border border-gray-700 font-mono text-sm text-green-300">
                  > Generando Índice... OK<br/>
                  > Compilando Fichas Técnicas... OK<br/>
                  > Calculando Rentabilidad... OK<br/>
                  > Memoria Final lista para entrega.
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} C.I.F.P. de Hostelería y Turismo - Región de Murcia</p>
        <p className="mt-2">Desarrollado para fines educativos.</p>
      </div>
    </div>
  );
};