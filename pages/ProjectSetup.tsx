import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { DishType } from '../types';
import { Settings, Save, Download, AlertTriangle } from 'lucide-react';

export const ProjectSetup: React.FC = () => {
  const { 
    state, 
    assignTask, 
    updateTask6Roles, 
    updateDishDistribution
  } = useProject();

  // Local state for dish assignments (before saving to context)
  const [dishAssignments, setDishAssignments] = useState<{type: DishType, authorId: string, name: string}[]>([
      { type: DishType.APPETIZER, authorId: '', name: 'Aperitivo Creativo' },
      { type: DishType.STARTER, authorId: '', name: 'Entrante Km0' },
      { type: DishType.MAIN, authorId: '', name: 'Principal Sostenible' },
      { type: DishType.DESSERT, authorId: '', name: 'Postre Murciano' }
  ]);

  const handleDishAssign = (index: number, authorId: string) => {
      const newAssignments = [...dishAssignments];
      newAssignments[index].authorId = authorId;
      setDishAssignments(newAssignments);
  };

  const saveDistribution = () => {
      // 1. Save Dish Placeholders
      // Check if all dishes have authors
      if(dishAssignments.some(d => !d.authorId)) {
          alert("Por favor, asigna un responsable para cada uno de los 4 platos.");
          return;
      }
      updateDishDistribution(dishAssignments);
      alert("¡Distribución guardada! Si ya existían platos, se han actualizado los autores. Ahora descarga el archivo de equipo.");
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `murcia_proyecto_MASTER_${state.teamName.replace(/\s+/g, '_')}_config.json`;
    link.click();
  };

  if(state.team.length === 0) {
      return (
          <div className="p-8 text-center">
              <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-800">Equipo no definido</h2>
              <p className="text-gray-600 mb-4">Primero debes crear el equipo y definir sus miembros en la Tarea 1.</p>
          </div>
      )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="text-green-600"/> Configuración y Reparto Global
        </h2>
        <p className="text-gray-600 mt-2">
          <strong>Solo Coordinador:</strong> Utiliza esta pantalla para distribuir <strong>TODAS</strong> las tareas del proyecto. 
          Al terminar, descarga el "Archivo Maestro" y envíalo a tus compañeros.
        </p>
      </div>

      <div className="space-y-12">
          {/* SECTION 1: TASK 2 */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-blue-900 mb-4">1. Reparto de Análisis (Tarea 2)</h3>
              <p className="text-sm text-gray-500 mb-4">Asigna las 10 micro-tareas de investigación equitativamente.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                  {state.task2.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                          <div className="text-sm">
                              <span className="font-bold text-gray-700">{task.id}. {task.title}</span>
                          </div>
                          <select 
                            className="text-sm border p-1 rounded w-40"
                            value={task.assignedToId || ''}
                            onChange={(e) => assignTask(task.id, e.target.value)}
                          >
                              <option value="">-- Asignar --</option>
                              {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                      </div>
                  ))}
              </div>
          </section>

          {/* SECTION 2: DISHES */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-green-900 mb-4">2. Reparto de Carta (Tarea 3)</h3>
              <p className="text-sm text-gray-500 mb-4">Define quién diseñará cada categoría de plato.</p>
              
              <div className="grid md:grid-cols-4 gap-4">
                  {dishAssignments.map((slot, idx) => (
                      <div key={idx} className="p-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50">
                          <h4 className="font-bold text-green-800 text-sm uppercase mb-2">{slot.type}</h4>
                          <input 
                            className="w-full text-xs p-1 mb-2 border rounded"
                            value={slot.name}
                            onChange={(e) => {
                                const copy = [...dishAssignments];
                                copy[idx].name = e.target.value;
                                setDishAssignments(copy);
                            }}
                            placeholder="Nombre provisional"
                          />
                          <select 
                            className="w-full text-sm border p-1 rounded"
                            value={slot.authorId}
                            onChange={(e) => handleDishAssign(idx, e.target.value)}
                          >
                              <option value="">-- Chef --</option>
                              {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                      </div>
                  ))}
              </div>
          </section>

          {/* SECTION 3: ROLES TASK 6 */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-purple-900 mb-4">3. Roles Finales (Tarea 6)</h3>
              <p className="text-sm text-gray-500 mb-4">Asigna las responsabilidades de producción final.</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-3 bg-purple-50 rounded border border-purple-200">
                      <h4 className="font-bold text-purple-900 text-sm mb-2">Diseñador Gráfico (Digital)</h4>
                      <select 
                        className="w-full text-sm border p-1 rounded"
                        value={state.task6.designerId || ''}
                        onChange={(e) => updateTask6Roles({ designerId: e.target.value })}
                      >
                          <option value="">-- Asignar --</option>
                          {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                  </div>
                  <div className="p-3 bg-orange-50 rounded border border-orange-200">
                      <h4 className="font-bold text-orange-900 text-sm mb-2">Artesano (Físico)</h4>
                      <select 
                        className="w-full text-sm border p-1 rounded"
                        value={state.task6.artisanId || ''}
                        onChange={(e) => updateTask6Roles({ artisanId: e.target.value })}
                      >
                          <option value="">-- Asignar --</option>
                          {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <h4 className="font-bold text-blue-900 text-sm mb-2">Editor Jefe (Memoria)</h4>
                      <select 
                        className="w-full text-sm border p-1 rounded"
                        value={state.task6.editorId || ''}
                        onChange={(e) => updateTask6Roles({ editorId: e.target.value })}
                      >
                          <option value="">-- Asignar --</option>
                          {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                  </div>
              </div>
          </section>

          <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-gray-200 shadow-lg flex justify-between items-center z-20">
              <div className="text-sm text-gray-600">
                  Asegúrate de haber asignado TODO antes de generar el archivo maestro.
              </div>
              <div className="flex gap-4">
                  <button 
                    onClick={saveDistribution}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-bold"
                  >
                      <Save size={18} /> 1. Guardar Configuración
                  </button>
                  <button 
                    onClick={handleExportConfig}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md animate-pulse"
                  >
                      <Download size={18} /> 2. Descargar Archivo Maestro
                  </button>
              </div>
          </div>
          <div className="h-16"></div> {/* Spacer for fixed footer */}
      </div>
    </div>
  );
};