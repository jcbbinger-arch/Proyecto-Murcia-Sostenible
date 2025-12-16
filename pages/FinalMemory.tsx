
import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Printer, AlertTriangle, User } from 'lucide-react';
import { DishType } from '../types';

export const FinalMemory: React.FC = () => {
  const { state } = useProject();

  const handlePrint = () => {
    window.print();
  };

  // Define distinct styles for up to 5 members to visually distinguish contributions
  const MEMBER_STYLES = [
      { bg: 'bg-blue-50', border: 'border-blue-600', badge: 'bg-blue-100 text-blue-900', text: 'text-blue-900' },
      { bg: 'bg-green-50', border: 'border-green-600', badge: 'bg-green-100 text-green-900', text: 'text-green-900' },
      { bg: 'bg-orange-50', border: 'border-orange-600', badge: 'bg-orange-100 text-orange-900', text: 'text-orange-900' },
      { bg: 'bg-purple-50', border: 'border-purple-600', badge: 'bg-purple-100 text-purple-900', text: 'text-purple-900' },
      { bg: 'bg-pink-50', border: 'border-pink-600', badge: 'bg-pink-100 text-pink-900', text: 'text-pink-900' },
  ];

  const AuthorBlock: React.FC<{ children: React.ReactNode, authorIds: string[], label?: string }> = ({ children, authorIds, label }) => {
      // Find the index of the first author in the team list to assign a consistent color
      const firstAuthorId = authorIds[0];
      const memberIndex = state.team.findIndex(m => m.id === firstAuthorId);
      
      // Fallback style if member not found or generic
      const style = memberIndex >= 0 
        ? MEMBER_STYLES[memberIndex % MEMBER_STYLES.length] 
        : { bg: 'bg-gray-50', border: 'border-gray-400', badge: 'bg-gray-200 text-gray-800', text: 'text-gray-900' };

      const authorNames = state.team
        .filter(m => authorIds.includes(m.id))
        .map(m => m.name)
        .join(', ');

      return (
          <div className={`mb-8 break-inside-avoid rounded-r-xl border-l-8 p-6 shadow-sm print:shadow-none ${style.bg} ${style.border}`}>
              <div className="flex justify-between items-center mb-4 border-b border-black/10 pb-2">
                  <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-widest opacity-60 ${style.text}`}>
                          {label || 'Contribución Realizada Por:'}
                      </span>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wide border border-black/5 flex items-center gap-2 ${style.badge}`}>
                      <User size={14} /> {authorNames || 'Sin Asignar'}
                  </div>
              </div>
              <div className="text-gray-800">
                {children}
              </div>
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
              <p className="text-xs text-red-500 mt-2">Responsables: <span className="font-bold">{assignees || 'Sin Asignar'}</span></p>
          </div>
      );
  };

  const editorNames = state.team.filter(m => state.task6.editorIds.includes(m.id)).map(m => m.name).join(', ');

  return (
    <div className="p-8 max-w-5xl mx-auto print:max-w-none print:w-full print:p-0 print:m-0">
      <div className="flex justify-between items-center mb-8 no-print">
        <h2 className="text-3xl font-bold text-gray-900">Memoria Final del Proyecto</h2>
        <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"
        >
            <Printer size={18} /> Imprimir PDF Oficial
        </button>
      </div>

      <div className="bg-white p-12 shadow-lg print:shadow-none print:p-8 min-h-screen print:w-full">
        {/* === PORTADA === */}
        <div className="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-16">
            <div className="flex items-center gap-4">
                {state.schoolLogo && (
                    <img src={state.schoolLogo} alt="Logo Centro" className="h-20 w-auto object-contain" />
                )}
                {!state.schoolLogo && <div className="h-16 w-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Sin Logo</div>}
            </div>
            <div className="text-right">
                <h2 className="text-xl font-bold text-gray-900">{state.schoolName}</h2>
                <p className="text-gray-600 font-medium">Curso {state.academicYear}</p>
            </div>
        </div>

        <div className="text-center mb-16 border-b-2 border-green-600 pb-12 break-after-page">
            <h1 className="text-6xl font-black text-green-900 mb-6 tracking-tight">{state.concept.name || "NOMBRE DEL RESTAURANTE"}</h1>
            <p className="text-3xl text-gray-600 italic font-serif mb-12">"{state.concept.slogan || "Tu eslogan aquí"}"</p>
            
            {state.groupPhoto && (
                <div className="my-12 flex justify-center">
                    <img src={state.groupPhoto} alt="Equipo" className="max-w-2xl w-full h-auto object-cover rounded shadow-lg border-4 border-white" />
                </div>
            )}

            <div className="text-base text-gray-500 mt-12 space-y-2">
                <p className="uppercase tracking-[0.2em] font-bold text-green-800 mb-4">Proyecto Murcia Sostenible</p>
                <p className="text-2xl font-bold text-gray-900">{state.teamName || "Nombre del Equipo"}</p>
                
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {state.team.map((m, idx) => {
                        const style = MEMBER_STYLES[idx % MEMBER_STYLES.length];
                        return (
                            <span key={m.id} className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${style.bg} ${style.border} ${style.text}`}>
                                {m.name} {m.isCoordinator && '(Coord)'}
                            </span>
                        );
                    })}
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100 w-1/2 mx-auto">
                    <p className="text-green-700 font-bold text-lg">Zona: {state.selectedZone?.name}</p>
                    <p className="mt-2">{new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400 mt-2">Editores: {editorNames || '...'}</p>
                </div>
            </div>
        </div>

        {/* === ÍNDICE === */}
        <div className="break-after-page px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 border-b-2 border-gray-200 pb-4">Índice del Proyecto</h2>
            <ul className="space-y-6 text-xl text-gray-700">
                {[
                    "Capítulo 1: El Concepto",
                    "Capítulo 2: La Investigación (Anexos)",
                    "Capítulo 3: Nuestra Carta Gastronómica",
                    "Capítulo 4: Fichas Técnicas (Anexos)",
                    "Capítulo 5: Diseño y Prototipos Finales",
                    "Capítulo 6: Viabilidad Económica"
                ].map((chapter, i) => (
                    <li key={i} className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="font-medium">{chapter}</span>
                        <span className="text-gray-300">................................................</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* === CAPÍTULO 1 === */}
        <section className="mb-16 break-after-page">
            <h2 className="text-4xl font-bold text-blue-900 mb-8 border-b-4 border-blue-500 pb-4">Capítulo 1: El Concepto</h2>
             <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">Identidad Corporativa</h3>
                    <p className="mb-4 text-lg"><span className="font-bold text-gray-500 block text-xs uppercase">Nombre Comercial</span> {state.concept.name}</p>
                    <p className="mb-2 text-lg"><span className="font-bold text-gray-500 block text-xs uppercase">Eslogan</span> {state.concept.slogan}</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">Público Objetivo</h3>
                    <p className="text-gray-700 italic text-lg leading-relaxed">"{state.concept.targetAudience}"</p>
                </div>
            </div>
            <div className="bg-green-50 p-8 rounded-xl border-l-8 border-green-500">
                 <h3 className="font-bold text-xl mb-4 text-green-900">Vinculación Territorial: {state.selectedZone?.name}</h3>
                 <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{state.zoneJustification}</p>
            </div>
        </section>

        {/* === CAPÍTULO 2 === */}
        <section className="mb-16 break-after-page">
             <h2 className="text-4xl font-bold text-blue-900 mb-8 border-b-4 border-blue-500 pb-4">Capítulo 2: La Investigación</h2>
             <div className="space-y-8">
                {state.task2.tasks.map((task) => {
                    const hasContent = task.content && task.content.length > 5;
                    const assigneeIds = task.assignedToId ? [task.assignedToId] : [];
                    
                    if (!hasContent) return <PendingBlock key={task.id} assigneeIds={assigneeIds} taskName={task.title} />;
                    
                    return (
                        <AuthorBlock key={task.id} authorIds={assigneeIds} label={`Investigación: ${task.title}`}>
                            <div className="prose max-w-none">
                                <h4 className="font-bold text-xl text-gray-900 mb-3">{task.title}</h4>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{task.content}</p>
                            </div>
                        </AuthorBlock>
                    );
                })}
             </div>
        </section>

        {/* === CAPÍTULO 3 === */}
        <section className="mb-16 break-after-page">
            <h2 className="text-4xl font-bold text-blue-900 mb-8 border-b-4 border-blue-500 pb-4">Capítulo 3: La Carta</h2>
            <div className="border-[6px] double border-gray-800 p-12 max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none">
                <div className="text-center border-b-2 border-gray-200 pb-8 mb-8">
                     <h3 className="text-5xl font-serif font-black text-gray-900 mb-2">{state.concept.name}</h3>
                     <p className="text-gray-500 uppercase tracking-widest text-sm">Menú de Temporada</p>
                </div>
               
                {state.dishes.length === 0 && <div className="text-center text-red-500 font-bold p-10 bg-red-50 rounded">CARTA VACÍA</div>}
                
                {Object.values(DishType).map(type => {
                    const dishes = state.dishes.filter(d => d.type === type);
                    if (dishes.length === 0) return null;
                    return (
                        <div key={type} className="mb-10 break-inside-avoid">
                            <h4 className="text-center text-sm font-bold uppercase text-white bg-gray-900 py-1 mb-6 mx-auto w-48 rounded-sm">{type}</h4>
                            <ul className="space-y-6">
                                {dishes.map(dish => (
                                    <li key={dish.id} className="text-center relative group">
                                        <div className="font-bold text-xl text-gray-900 mb-1">{dish.name}</div>
                                        <div className="text-sm text-gray-600 italic px-12 leading-relaxed">{dish.description}</div>
                                        <div className="text-lg font-bold mt-2 text-gray-800">{dish.price}€</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                })}
            </div>
        </section>

        {/* === CAPÍTULO 4 === */}
        <section className="mb-16 break-after-page">
            <h2 className="text-4xl font-bold text-blue-900 mb-8 border-b-4 border-blue-500 pb-4">Capítulo 4: Fichas Técnicas</h2>
            {state.dishes.length === 0 && <p className="text-gray-400">No hay platos creados.</p>}
            <div className="space-y-8">
                {state.dishes.map(dish => (
                     <AuthorBlock key={dish.id} authorIds={[dish.author]} label={`Chef Creador: ${dish.name}`}>
                         <div className="bg-white p-2 rounded">
                            <div className="flex justify-between border-b-2 border-gray-200 pb-4 mb-4">
                                <div>
                                    <h3 className="font-black text-2xl text-gray-900">{dish.name}</h3>
                                    <span className="text-sm font-bold text-white bg-gray-500 px-3 py-1 rounded-full uppercase mt-2 inline-block">{dish.type}</span>
                                </div>
                                <div className="text-right">
                                     <span className="block text-3xl font-bold text-gray-900">{dish.price}€</span>
                                     <span className="text-xs text-gray-400 uppercase">PVP</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-sm uppercase text-gray-500 mb-2 border-b">Ingredientes</h4>
                                    <ul className="text-sm list-disc pl-5 space-y-1">
                                        {dish.ingredients.map((ing, i) => <li key={i}><span className="font-bold">{ing.quantity} {ing.unit}</span> {ing.name}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase text-gray-500 mb-2 border-b">Elaboración</h4>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{dish.elaboration}</p>
                                </div>
                            </div>
                             <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="font-bold text-sm uppercase text-gray-500 mb-1">Justificación Sostenible</h4>
                                <p className="text-sm italic text-gray-600">{dish.sustainabilityJustification || 'No especificada.'}</p>
                            </div>
                         </div>
                     </AuthorBlock>
                ))}
            </div>
        </section>

        {/* === CAPÍTULO 5 === */}
        <section className="mb-16 break-after-page">
             <h2 className="text-4xl font-bold text-blue-900 mb-8 border-b-4 border-blue-500 pb-4">Capítulo 5: Diseño y Prototipos</h2>
             <div className="grid grid-cols-1 gap-8">
                
                {/* Digital Menu */}
                <AuthorBlock authorIds={state.task6.designerIds} label="Diseño Gráfico y Digital">
                    <div className="h-full">
                        <h3 className="font-bold text-xl mb-4 text-purple-900">Carta Digital (Misión 6.A)</h3>
                        <div className="bg-purple-50 p-6 rounded border border-purple-100">
                             <p className="text-sm text-gray-600 mb-2">Enlace al diseño:</p>
                             {state.menuPrototype.digitalLink ? (
                                <a href={state.menuPrototype.digitalLink} target="_blank" className="text-lg font-bold text-blue-600 underline break-all block">{state.menuPrototype.digitalLink}</a>
                            ) : (
                                <span className="text-red-500 font-bold">No se ha proporcionado el enlace.</span>
                            )}
                        </div>
                    </div>
                </AuthorBlock>

                {/* Physical Menu */}
                <AuthorBlock authorIds={state.task6.artisanIds} label="Artesanía y Maquetación">
                    <div className="h-full">
                         <h3 className="font-bold text-xl mb-4 text-orange-900">Carta Física (Misión 6.B)</h3>
                         {state.menuPrototype.physicalPhoto ? (
                             <div className="grid md:grid-cols-2 gap-6">
                                <img src={state.menuPrototype.physicalPhoto} className="w-full h-64 object-cover rounded shadow-md border border-gray-200" />
                                <div className="bg-orange-50 p-6 rounded border border-orange-100">
                                    <h4 className="font-bold text-sm uppercase text-orange-800 mb-2">Descripción del Formato</h4>
                                    <p className="text-gray-800">{state.menuPrototype.physicalDescription}</p>
                                </div>
                             </div>
                         ) : (
                             <PendingBlock assigneeIds={state.task6.artisanIds} taskName="Misión 6.B: Maqueta Física" />
                         )}
                    </div>
                </AuthorBlock>
             </div>
        </section>

        {/* === CAPÍTULO 6 === */}
        <section className="mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-8 border-b-4 border-blue-500 pb-4">Capítulo 6: Viabilidad Económica</h2>
            <div className="space-y-12">
                {state.dishes.map((dish) => (
                    <div key={dish.id} className="break-inside-avoid">
                        <AuthorBlock authorIds={[dish.author]} label={`Responsable Financiero: ${dish.name}`}>
                             {/* Simplified Escandallo View for Memory */}
                             <div className="border-4 border-black bg-white p-6 shadow-sm">
                                <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
                                     <h3 className="text-xl font-black uppercase">Escandallo: {dish.name}</h3>
                                     <span className="font-mono text-xs">REF-{dish.id.substring(0,4)}</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-8 text-sm">
                                    <div className="space-y-2">
                                        <div className="flex justify-between border-b border-gray-200 pb-1">
                                            <span>Coste Materia Prima:</span>
                                            <span className="font-bold">{dish.financials?.totalCost?.toFixed(2)}€</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-200 pb-1">
                                            <span>Nº Raciones:</span>
                                            <span className="font-bold">{dish.servings}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-200 pb-1 bg-yellow-50 px-2 -mx-2">
                                            <span className="font-bold text-gray-900">Coste por Ración:</span>
                                            <span className="font-bold text-gray-900">{dish.financials?.costPerServing?.toFixed(2)}€</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between border-b border-gray-200 pb-1">
                                            <span>Food Cost %:</span>
                                            <span className={`${(dish.financials?.foodCostPercent || 0) > 35 ? 'text-red-600' : 'text-green-600'} font-bold`}>
                                                {dish.financials?.foodCostPercent?.toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-200 pb-1">
                                            <span>Margen Bruto:</span>
                                            <span className="font-bold">{dish.financials?.grossMargin?.toFixed(2)}€</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-900 text-white p-2 rounded mt-2">
                                            <span className="font-bold uppercase text-xs">PVP Final:</span>
                                            <span className="font-black text-xl">{dish.price?.toFixed(2)}€</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t-2 border-black">
                                    <p className="text-xs font-bold uppercase text-gray-500 mb-1">Justificación de Precio:</p>
                                    <p className="text-sm italic text-gray-800">{dish.priceJustification || "Sin justificación redactada."}</p>
                                </div>
                             </div>
                        </AuthorBlock>
                    </div>
                ))}
            </div>
        </section>
        
        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-20 pt-8 border-t border-gray-200">
            Generado con Murcia Sostenible App - Coordinación: {editorNames || 'N/A'} - {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
