import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Users, Award } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state, updateTeamName } = useProject();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Proyecto <span className="text-green-600">Murcia Sostenible</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Bienvenido al gestor digital para tu Trabajo de Fin de Grado/Curso. 
          Aquí conceptualizarás, diseñarás y planificarás tu restaurante sostenible en la Región de Murcia.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                <Leaf />
            </div>
            <h3 className="font-bold text-lg mb-2">1. Sostenibilidad</h3>
            <p className="text-sm text-gray-600">Kilómetro cero, temporada y desperdicio cero son tus pilares.</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                <Users />
            </div>
            <h3 className="font-bold text-lg mb-2">2. Identidad</h3>
            <p className="text-sm text-gray-600">Crea una historia auténtica vinculada a una comarca murciana.</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                <Award />
            </div>
            <h3 className="font-bold text-lg mb-2">3. Viabilidad</h3>
            <p className="text-sm text-gray-600">Diseña escandallos rentables y precios coherentes con el mercado.</p>
        </div>
      </div>

      <div className="flex justify-center">
        <Link 
            to="/task-1" 
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
        >
            Comenzar Tarea 1: Equipo y Zona <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};