import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Palette, Hammer, BookOpen, Lock } from 'lucide-react';

export const Task6_FinalAssembly: React.FC = () => {
  const { state, updateTask6Roles } = useProject();
  const [activeTab, setActiveTab] = useState<'instructions' | 'roles'>('instructions');

  const isCoordinator = state.currentUser ? state.team.find(m => m.id === state.currentUser)?.isCoordinator : true;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center no-print gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 6: Diseño Final y Ensamblaje</h2>
            <p className="text-gray-600 mt-2">Fase 5 - Producción Final | Entrega: Marzo</p>
        </div>
        <div className="flex gap-2">
             <button 
                onClick={() => setActiveTab('instructions')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'instructions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                Instrucciones
            </button>
            <button 
                onClick={() => setActiveTab('roles')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'roles' ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                Misiones
            </button>
        </div>
      </div>

      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 prose max-w-none text-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Guía de la Tarea 6</h3>
            <p>Es el momento de pulir el proyecto hasta el último detalle. Con los precios definidos, vais a crear la versión definitiva.</p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-purple-50 p-4 rounded border border-purple-200">
                    <h4 className="font-bold text-purple-900 flex items-center gap-2"><Palette size={18}/> Misión 6.A: Diseñador</h4>
                    <p className="text-sm">Actualizar la carta virtual (Canva) con los precios definitivos. Generar el QR final.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded border border-orange-200">
                    <h4 className="font-bold text-orange-900 flex items-center gap-2"><Hammer size={18}/> Misión 6.B: Artesano</h4>
                    <p className="text-sm">Construir la maqueta física definitiva integrando el feedback y el QR.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <h4 className="font-bold text-blue-900 flex items-center gap-2"><BookOpen size={18}/> Misión 6.C: Editor</h4>
                    <p className="text-sm">Ensamblar la Memoria Final (PDF), añadiendo conclusiones y revisando todo.</p>
                </div>
            </div>
            
            <div className="mt-8">
                 <button onClick={() => setActiveTab('roles')} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">
                    Ir al Reparto de Misiones
                 </button>
            </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="space-y-8">
             <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Asignación de Roles Finales</h3>
                <p className="text-gray-600 mb-6">
                    {isCoordinator 
                    ? "Puedes asignar roles aquí o en la Configuración Inicial."
                    : "Solo lectura. Tu rol ha sido asignado por el Coordinador."}
                </p>

                <div className="grid gap-6">
                    {/* Role A */}
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded border border-purple-100">
                        <div>
                            <h4 className="font-bold text-purple-900">Misión 6.A: El Diseñador Gráfico FINAL</h4>
                            <p className="text-xs text-purple-700">Carta Virtual Final y QR.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isCoordinator && <Lock size={16} className="text-gray-400" />}
                            <select 
                                className="p-2 rounded border border-purple-300 disabled:bg-gray-100 disabled:text-gray-500"
                                value={state.task6.designerId || ''}
                                onChange={(e) => updateTask6Roles({ designerId: e.target.value })}
                                disabled={!isCoordinator}
                            >
                                <option value="">-- Seleccionar --</option>
                                {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Role B */}
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded border border-orange-100">
                        <div>
                            <h4 className="font-bold text-orange-900">Misión 6.B: El Artesano FINAL</h4>
                            <p className="text-xs text-orange-700">Maqueta Física Final.</p>
                        </div>
                         <div className="flex items-center gap-2">
                            {!isCoordinator && <Lock size={16} className="text-gray-400" />}
                            <select 
                                className="p-2 rounded border border-orange-300 disabled:bg-gray-100 disabled:text-gray-500"
                                value={state.task6.artisanId || ''}
                                onChange={(e) => updateTask6Roles({ artisanId: e.target.value })}
                                disabled={!isCoordinator}
                            >
                                <option value="">-- Seleccionar --</option>
                                {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Role C */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded border border-blue-100">
                        <div>
                            <h4 className="font-bold text-blue-900">Misión 6.C: El Editor Jefe</h4>
                            <p className="text-xs text-blue-700">Ensamblaje Memoria y Entrega.</p>
                        </div>
                         <div className="flex items-center gap-2">
                            {!isCoordinator && <Lock size={16} className="text-gray-400" />}
                            <select 
                                className="p-2 rounded border border-blue-300 disabled:bg-gray-100 disabled:text-gray-500"
                                value={state.task6.editorId || ''}
                                onChange={(e) => updateTask6Roles({ editorId: e.target.value })}
                                disabled={!isCoordinator}
                            >
                                <option value="">-- Seleccionar --</option>
                                {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
             </div>

             <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
                 <p>Una vez asignados los roles, cada miembro debe trabajar en su área (actualizar prototipos en Tarea 4, etc.) y exportar su contribución en la página de <strong>Sincronización</strong>.</p>
             </div>
        </div>
      )}
    </div>
  );
};