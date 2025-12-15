import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, LayoutDashboard, DollarSign, Printer, Users, Microscope, UtensilsCrossed, Palette, Share2, Rocket, Settings } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const Sidebar: React.FC = () => {
  const { state, resetProject } = useProject();

  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Inicio" },
    { to: "/task-1", icon: <Users size={20} />, label: "1. Equipo y Zona" },
    { to: "/setup", icon: <Settings size={20} />, label: "2. Reparto Global" },
    { to: "/sync", icon: <Share2 size={20} />, label: "Sincronización" },
    { to: "/task-2", icon: <Microscope size={20} />, label: "3. Análisis" },
    { to: "/menu", icon: <UtensilsCrossed size={20} />, label: "4. Carta" },
    { to: "/task-4", icon: <Palette size={20} />, label: "5. Prototipos" },
    { to: "/financials", icon: <DollarSign size={20} />, label: "6. Viabilidad" },
    { to: "/task-6", icon: <Rocket size={20} />, label: "7. Producción Final" },
    { to: "/memory", icon: <Printer size={20} />, label: "Memoria Final" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 no-print z-10">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-green-800 flex items-center gap-2">
            <FileText className="text-green-600"/>
            Murcia Sostenible
        </h1>
        <p className="text-xs text-gray-500 mt-2">Gestor de Proyecto</p>
        {state.currentUser && (
            <div className="mt-2 bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-bold truncate">
                Hola, {state.team.find(m => m.id === state.currentUser)?.name || 'Usuario'}
            </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-green-50 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-green-800 uppercase mb-1">Progreso</p>
            <div className="text-xs text-green-700">
                Equipo: {state.teamName ? '✅' : '❌'}<br/>
                Carta: {state.dishes.length}/4<br/>
                Memoria: {state.task6.editorId ? 'En proceso' : 'Pendiente'}<br/>
            </div>
        </div>
        <button 
            onClick={resetProject}
            className="w-full text-xs text-red-500 hover:text-red-700 underline text-center"
        >
            Borrar datos y reiniciar
        </button>
      </div>
    </aside>
  );
};