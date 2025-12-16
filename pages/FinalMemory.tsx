import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Printer, AlertTriangle } from 'lucide-react';
import { ALLERGENS } from '../constants';
import { DishType } from '../types';

export const FinalMemory: React.FC = () => {
  const { state } = useProject();

  const handlePrint = () => {
    window.print();
  };

  const AuthorBlock: React.FC<{ children: React.ReactNode, authorIds: string[], label?: string }> = ({ children, authorIds, label }) => {
      const authors = state.team.filter(m => authorIds.includes(m.id)).map(m => m.name).join(', ');
      
      return (
          <div className="relative group border-l-4 border-transparent hover:border-gray-200 pl-4 transition-all h-full">
              {children}
              {authors && (
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded no-print">
                    {label || 'Autor(es)'}: {authors}
                </div>
              )}
          </div>
      );
  };

  const PendingBlock: React.FC<{ assigneeIds: string[], taskName: string }> = ({ assigneeIds, taskName }) => {
      const assignees = state.team.filter(m => assigneeIds.includes(m.id)).map(m => m.name).join(', ');
      return (
          <div className="border-2 border-dashed border-red-300 bg-red-50 p-6 rounded-lg my-4 text-center break-inside-avoid">
              <AlertTriangle className="mx-auto text-red-400 mb-2" size={32} />
              <h4 className="font-bold text-red-800 uppercase text-sm">Sección Pendiente de Entrega</h4>
              <p className="text-red-600 text-sm font-medium">{taskName}</p>
              <p className="text-xs text-red-500 mt-2">Responsables: {assignees || 'Sin Asignar'}</p>
          </div>
      );
  };

  const editorNames = state.team.filter(m => state.task6.editorIds.includes(m.id)).map(m => m.name).join(', ');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8 no-print">
        <h2 className="text-3xl font-bold text-gray-900">Memoria Final del Proyecto</h2>
        <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"
        >
            <Printer size={18} /> Imprimir PDF Oficial
        </button>
      </div>

      <div className="bg-white p-12 shadow-lg print:shadow-none print:p-0 min-h-screen">
        {/* === PORTADA === */}
        <div className="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-16">
            <div className="flex items-center gap-4">
                {state.schoolLogo && (
                    <img src={state.schoolLogo} alt="Logo Centro" className="h-16 w-auto object-contain" />
                )}
                {!state.schoolLogo && <div className="h-16 w-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Sin Logo</div>}
            </div>
            <div className="text-right">
                <h2 className="text-lg font-bold text-gray-900">{state.schoolName}</h2>
                <p className="text-sm text-gray-600">Curso {state.academicYear}</p>
            </div>
        </div>

        <div className="text-center mb-16 border-b-2 border-green-600 pb-8 break-after-page">
            <h1 className="text-5xl font-extrabold text-green-900 mb-4">{state.concept.name || "NOMBRE DEL RESTAURANTE"}</h1>
            <p className="text-2xl text-gray-600 italic mb-6">"{state.concept.slogan || "Tu eslogan aquí"}"</p>
            
            {state.groupPhoto && (
                <div className="my-8 flex justify-center">
                    <img src={state.groupPhoto} alt="Equipo" className="max-w-md max-h-64 object-cover rounded shadow-lg" />
                </div>
            )}

            <div className="text-sm text-gray-500 mt-8">
                <p className="uppercase tracking-widest font-bold mb-2">Proyecto Murcia Sostenible</p>
                <p className="text-lg font-bold text-gray-900">{state.teamName || "Nombre del Equipo"}</p>
                <div className="mt-4 flex flex-col gap-1">
                    {state.team.map(m => (
                        <span key={m.id}>{m.name} {m.isCoordinator && '(Coord)'}</span>
                    ))}
                </div>
                <p className="mt-6 text-green-700 font-bold">Zona: {state.selectedZone?.name}</p>
                <p className="mt-4">{new Date().toLocaleDateString()}</p>
                <p className="text-xs text-gray-400 mt-2">Editores: {editorNames || '...'}</p>
            </div>
        </div>

        {/* === ÍNDICE === */}
        <div className="break-after-page">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-300 pb-2">Índice</h2>
            <ul className="space-y-4 text-lg">
                {[
                    "Capítulo 1: El Concepto",
                    "Capítulo 2: La Investigación (Anexos)",
                    "Capítulo 3: Nuestra Carta Gastronómica",
                    "Capítulo 4: Fichas Técnicas (Anexos)",
                    "Capítulo 5: Diseño y Prototipos Finales",
                    "Capítulo 6: Viabilidad Económica"
                ].map((chapter, i) => (
                    <li key={i} className="flex justify-between border-b border-gray-100 pb-1">
                        <span>{chapter}</span>
                        <span className="text-gray-400">........................</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* === CAPÍTULO 1 === */}
        <section className="mb-12 break-after-page">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-4 border-blue-500 pb-2">Capítulo 1: El Concepto</h2>
             <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">Identidad</h3>
                    <p className="mb-2"><span className="font-bold">Nombre:</span> {state.concept.name}</p>
                    <p className="mb-2"><span className="font-bold">Eslogan:</span> {state.concept.slogan}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">Público Objetivo</h3>
                    <p className="text-gray-700 italic">"{state.concept.targetAudience}"</p>
                </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                 <h3 className="font-bold text-lg mb-2 text-green-900">Vinculación: {state.selectedZone?.name}</h3>
                 <p className="text-gray-700">{state.zoneJustification}</p>
            </div>
        </section>

        {/* === CAPÍTULO 2 === */}
        <section className="mb-12 break-after-page">
             <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-4 border-blue-500 pb-2">Capítulo 2: La Investigación</h2>
             <div className="space-y-6">
                {state.task2.tasks.map((task) => {
                    const hasContent = task.content && task.content.length > 5;
                    const assigneeIds = task.assignedToId ? [task.assignedToId] : [];
                    
                    if (!hasContent) return <PendingBlock key={task.id} assigneeIds={assigneeIds} taskName={task.title} />;
                    
                    return (
                        <AuthorBlock key={task.id} authorIds={assigneeIds}>
                            <div className="border-b pb-4 mb-4">
                                <h4 className="font-bold">{task.title}</h4>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.content}</p>
                            </div>
                        </AuthorBlock>
                    );
                })}
             </div>
        </section>

        {/* === CAPÍTULO 3 === */}
        <section className="mb-12 break-after-page">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-4 border-blue-500 pb-2">Capítulo 3: La Carta</h2>
            <div className="border-4 border-double border-gray-800 p-8 max-w-3xl mx-auto bg-white">
                <h3 className="text-4xl font-serif text-center font-bold mb-8">{state.concept.name}</h3>
                {state.dishes.length === 0 && <div className="text-center text-red-500 font-bold">CARTA VACÍA</div>}
                
                {Object.values(DishType).map(type => {
                    const dishes = state.dishes.filter(d => d.type === type);
                    if (dishes.length === 0) return null;
                    return (
                        <div key={type} className="mb-8">
                            <h4 className="text-center text-sm font-bold uppercase text-green-800 border-b border-gray-300 pb-1 mb-4 mx-12">{type}</h4>
                            <ul className="space-y-4">
                                {dishes.map(dish => (
                                    <li key={dish.id} className="text-center">
                                        <div className="font-bold text-lg text-gray-800">{dish.name}</div>
                                        <div className="text-sm text-gray-500 italic px-8">{dish.description}</div>
                                        <div className="text-sm font-bold mt-1">{dish.price}€</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                })}
            </div>
        </section>

        {/* === CAPÍTULO 4 === */}
        <section className="mb-12 break-after-page">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-4 border-blue-500 pb-2">Capítulo 4: Fichas Técnicas</h2>
            {state.dishes.length === 0 && <p className="text-gray-400">No hay platos creados.</p>}
            <div className="grid grid-cols-1 gap-8">
                {state.dishes.map(dish => (
                     <AuthorBlock key={dish.id} authorIds={[dish.author]} label="Chef del Plato">
                         <div className="border p-4 rounded break-inside-avoid shadow-sm">
                            <div className="flex justify-between border-b pb-2 mb-2">
                                <h3 className="font-bold text-xl">{dish.name}</h3>
                                <span className="text-sm bg-gray-100 px-2 rounded">{dish.type}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold text-sm">Ingredientes:</h4>
                                    <ul className="text-sm list-disc pl-4">
                                        {dish.ingredients.map((ing, i) => <li key={i}>{ing.name} ({ing.quantity} {ing.unit})</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Elaboración:</h4>
                                    <p className="text-xs">{dish.elaboration}</p>
                                </div>
                            </div>
                         </div>
                     </AuthorBlock>
                ))}
            </div>
        </section>

        {/* === CAPÍTULO 5 === */}
        <section className="mb-12 break-after-page">
             <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-4 border-blue-500 pb-2">Capítulo 5: Diseño y Prototipos Finales</h2>
             <div className="grid md:grid-cols-2 gap-6">
                
                {/* Digital Menu */}
                <AuthorBlock authorIds={state.task6.designerIds} label="Diseñadores Gráficos">
                    <div className="border p-4 rounded h-full">
                        <h3 className="font-bold mb-2 text-purple-900">Carta Digital (Misión 6.A)</h3>
                        {state.menuPrototype.digitalLink ? (
                            <p className="text-sm text-blue-600 break-all">{state.menuPrototype.digitalLink}</p>
                        ) : (
                            <PendingBlock assigneeIds={state.task6.designerIds} taskName="Misión 6.A: Diseño Digital" />
                        )}
                    </div>
                </AuthorBlock>

                {/* Physical Menu */}
                <AuthorBlock authorIds={state.task6.artisanIds} label="Artesanos">
                    <div className="border p-4 rounded h-full">
                         <h3 className="font-bold mb-2 text-orange-900">Carta Física (Misión 6.B)</h3>
                         {state.menuPrototype.physicalPhoto ? (
                             <>
                                <img src={state.menuPrototype.physicalPhoto} className="w-full h-auto mb-2" />
                                <p className="text-sm">{state.menuPrototype.physicalDescription}</p>
                             </>
                         ) : (
                             <PendingBlock assigneeIds={state.task6.artisanIds} taskName="Misión 6.B: Maqueta Física" />
                         )}
                    </div>
                </AuthorBlock>
             </div>
        </section>

        {/* === CAPÍTULO 6 === */}
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-4 border-blue-500 pb-2">Capítulo 6: Viabilidad Económica</h2>
            <div className="space-y-12">
                {state.dishes.map((dish) => (
                    <div key={dish.id} className="break-inside-avoid break-after-page">
                        <AuthorBlock authorIds={[dish.author]} label="Gestor del Escandallo">
                             {/* Simplified Escandallo View for Memory */}
                             <div className="border-2 border-black bg-white mb-6 p-4">
                                <h3 className="text-lg font-bold uppercase mb-2">Escandallo: {dish.name}</h3>
                                <div className="text-xs grid grid-cols-2 gap-4">
                                    <div>
                                        <p><strong>Coste MP:</strong> {dish.financials?.totalCost?.toFixed(2)}€</p>
                                        <p><strong>Coste Ración:</strong> {dish.financials?.costPerServing?.toFixed(2)}€</p>
                                    </div>
                                    <div>
                                        <p><strong>Food Cost:</strong> {dish.financials?.foodCostPercent?.toFixed(2)}%</p>
                                        <p className="text-lg font-bold"><strong>PVP:</strong> {dish.price?.toFixed(2)}€</p>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-xs italic">{dish.priceJustification || "Sin justificación de precio."}</p>
                                </div>
                             </div>
                        </AuthorBlock>
                    </div>
                ))}
            </div>
        </section>
        
        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-20 pt-8 border-t">
            Generado con Murcia Sostenible App - Editores: {editorNames || 'N/A'}
        </div>
      </div>
    </div>
  );
};