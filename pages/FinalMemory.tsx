import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Printer, Info } from 'lucide-react';
import { DishType } from '../types';

// Palette for team members to be used in badges
const MEMBER_COLORS = [
    { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
    { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
];

// Helper component for Academic Figures (Images)
const AcademicFigure: React.FC<{ src: string; alt: string; title: string; source?: string; className?: string }> = ({ src, alt, title, source = "Elaboración propia", className = "" }) => (
    <figure className={`academic-figure ${className}`}>
        <figcaption className="academic-caption-top">{title}</figcaption>
        <img src={src} alt={alt} className="max-w-full h-auto mx-auto border border-gray-300 print:border-none" />
        <div className="academic-source-bottom">{source}</div>
    </figure>
);

// Helper component for Academic Tables
const AcademicTable: React.FC<{ title: string; children: React.ReactNode; source?: string }> = ({ title, children, source = "Elaboración propia" }) => (
    <div className="academic-table-container">
        <div className="academic-caption-top">{title}</div>
        <div className="w-full border border-black p-1">
            {children}
        </div>
        <div className="academic-source-bottom">{source}</div>
    </div>
);

export const FinalMemory: React.FC = () => {
  const { state } = useProject();

  const handlePrint = () => {
    window.print();
  };

  // Helper to get member style
  const getMemberBadge = (memberId: string | null) => {
      if (!memberId) return <span className="text-gray-400 text-xs italic">Sin asignar</span>;
      
      const memberIndex = state.team.findIndex(m => m.id === memberId);
      const memberName = state.team.find(m => m.id === memberId)?.name || "Desconocido";
      const style = memberIndex >= 0 ? MEMBER_COLORS[memberIndex % MEMBER_COLORS.length] : { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };

      return (
          <span className={`member-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${style.bg} ${style.text} ${style.border}`}>
              {memberName}
          </span>
      );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto print:max-w-none print:w-full print:p-0 print:m-0">
      
      {/* UI HEADER (NO PRINT) */}
      <div className="flex flex-col gap-4 mb-8 no-print print:hidden">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900">Memoria Final del Proyecto</h2>
            <button 
                onClick={handlePrint}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"
            >
                <Printer size={18} /> Imprimir PDF Oficial
            </button>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
            <Info className="text-yellow-600 shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
                <p className="font-bold mb-1">Formato Académico Aplicado:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Tipografía Calibri 11pt, Interlineado 1.15.</li>
                    <li>Las etiquetas de color identifican a cada alumno responsable de la tarea.</li>
                </ul>
            </div>
        </div>
      </div>

      {/* DOCUMENT CONTENT */}
      <div className="bg-white p-12 shadow-lg print:shadow-none print:p-0 min-h-screen print:min-h-0 print:w-full">
        
        {/* === PORTADA (LIBRE) === */}
        <div className="print:h-[26cm] print:flex print:flex-col print:justify-between break-after-page">
            <div className="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-16 print:mb-8">
                <div className="flex items-center gap-4">
                    {state.schoolLogo ? (
                        <img src={state.schoolLogo} alt="Logo Centro" className="h-20 w-auto object-contain" />
                    ) : (
                        <div className="h-16 w-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400 border">Logo Centro</div>
                    )}
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-gray-900">{state.schoolName}</h2>
                    <p className="text-gray-600 font-medium">Curso {state.academicYear}</p>
                </div>
            </div>

            <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-green-900 mb-6 tracking-tight uppercase leading-none print:text-5xl">{state.concept.name || "NOMBRE DEL RESTAURANTE"}</h1>
                <p className="text-3xl text-gray-600 italic font-serif mb-12">"{state.concept.slogan || "Tu eslogan aquí"}"</p>
                
                {state.groupPhoto && (
                    <div className="my-8 flex justify-center">
                        <img src={state.groupPhoto} alt="Imagen del Equipo" className="h-32 w-auto object-contain rounded-lg shadow-sm border-2 border-white print:border-none print:shadow-none" />
                    </div>
                )}
            </div>

            <div className="text-center mt-auto">
                <p className="uppercase tracking-[0.2em] font-bold text-green-800 mb-4 print:text-black">Proyecto Murcia Sostenible</p>
                <p className="text-2xl font-bold text-gray-900 mb-8">{state.teamName || "Nombre del Equipo"}</p>
                
                <div className="border-t border-gray-300 w-2/3 mx-auto pt-4 text-sm">
                    <p className="mb-2"><strong>Integrantes del Equipo:</strong></p>
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {state.team.map(m => (
                            <div key={m.id}>
                                {getMemberBadge(m.id)}
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-gray-500">Fecha de entrega: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>

        {/* === ÍNDICE === */}
        <div className="break-after-page px-4 print:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-2">Índice del Proyecto</h2>
            <ul className="space-y-4 text-lg">
                {[
                    "1. El Concepto",
                    "2. La Investigación (Anexos)",
                    "3. Nuestra Carta Gastronómica",
                    "4. Fichas Técnicas (Anexos)",
                    "5. Producción Final (Diseño y Prototipos)",
                    "6. Viabilidad Económica",
                    "Anexo: Coevaluación Diabólica"
                ].map((chapter, i) => (
                    <li key={i} className="flex justify-between border-b border-dotted border-gray-300 pb-1">
                        <span>{chapter}</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* === CAPÍTULO 1 === */}
        <section className="mb-8 break-after-page">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-500 pb-2 print:text-black print:border-black">1. El Concepto</h2>
            
            <p className="mb-4">
                En este capítulo definimos la identidad corporativa y la vinculación territorial de nuestro proyecto.
            </p>

            <AcademicTable title="Identidad Corporativa">
                <div className="grid grid-cols-2 text-sm">
                    <div className="p-2 border-b border-r border-gray-300 font-bold bg-gray-100 print:bg-white">Nombre Comercial</div>
                    <div className="p-2 border-b border-gray-300">{state.concept.name}</div>
                    
                    <div className="p-2 border-b border-r border-gray-300 font-bold bg-gray-100 print:bg-white">Eslogan</div>
                    <div className="p-2 border-b border-gray-300">{state.concept.slogan}</div>
                    
                    <div className="p-2 border-b border-r border-gray-300 font-bold bg-gray-100 print:bg-white">Zona Territorial</div>
                    <div className="p-2 border-b border-gray-300">{state.selectedZone?.name}</div>

                    <div className="p-2 border-r border-gray-300 font-bold bg-gray-100 print:bg-white">Valores</div>
                    <div className="p-2">{state.concept.values.join(', ')}</div>
                </div>
            </AcademicTable>

            <h3 className="font-bold text-lg mt-6 mb-2">1.1 Público Objetivo</h3>
            <p className="mb-4 text-justify">"{state.concept.targetAudience}"</p>

            <h3 className="font-bold text-lg mt-6 mb-2">1.2 Vinculación con {state.selectedZone?.name}</h3>
            <p className="text-justify">{state.zoneJustification}</p>
        </section>

        {/* === CAPÍTULO 2 === */}
        <section className="mb-8 break-after-page">
             <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-500 pb-2 print:text-black print:border-black">2. La Investigación</h2>
             <p className="mb-6">A continuación, se presentan los resúmenes ejecutivos de las investigaciones realizadas por el equipo.</p>
             
             <div className="space-y-6">
                {state.task2.tasks.filter(t => t.content && t.content.length > 5).map((task) => (
                    <div key={task.id} className="mb-4 border-l-2 border-gray-300 pl-4">
                        <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-lg">{task.title}</h4>
                             {getMemberBadge(task.assignedToId)}
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.content}</p>
                    </div>
                ))}
             </div>
        </section>

        {/* === CAPÍTULO 3 === */}
        <section className="mb-8 break-after-page">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-500 pb-2 print:text-black print:border-black">3. Nuestra Carta Gastronómica</h2>
            
            <AcademicTable title={`Menú de Temporada: ${state.concept.name}`}>
                <div className="p-4 text-center">
                    {Object.values(DishType).map(type => {
                        const dishes = state.dishes.filter(d => d.type === type);
                        if (dishes.length === 0) return null;
                        return (
                            <div key={type} className="mb-6 break-inside-avoid">
                                <h4 className="font-bold uppercase text-sm mb-2 underline">{type}</h4>
                                <ul className="space-y-3">
                                    {dishes.map(dish => (
                                        <li key={dish.id} className="text-sm">
                                            <div className="flex justify-center items-center gap-2">
                                                <span className="font-bold">{dish.name}</span>
                                                <span className="mx-1">......................</span>
                                                <span>{dish.price}€</span>
                                                <span className="scale-75 origin-left">{getMemberBadge(dish.author)}</span>
                                            </div>
                                            <div className="text-xs italic mt-0.5">{dish.description}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </AcademicTable>
        </section>

        {/* === CAPÍTULO 4 === */}
        <section className="mb-8 break-after-page">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-500 pb-2 print:text-black print:border-black">4. Fichas Técnicas</h2>
            
            {state.dishes.map(dish => (
                <div key={dish.id} className="mb-8 break-after-page">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                         <h3 className="font-bold text-xl">{dish.name} ({dish.type})</h3>
                         {getMemberBadge(dish.author)}
                    </div>
                    
                    {dish.photo && (
                        <div className="mb-4 max-w-sm mx-auto">
                            <AcademicFigure 
                                src={dish.photo} 
                                alt={dish.name} 
                                title={`Presentación: ${dish.name}`} 
                            />
                        </div>
                    )}

                    <AcademicTable title={`Ficha Técnica: ${dish.name}`}>
                        <div className="grid grid-cols-2 text-xs">
                            <div className="p-2 border-b border-r border-black font-bold">Ingredientes</div>
                            <div className="p-2 border-b border-black font-bold">Elaboración</div>
                            
                            <div className="p-2 border-r border-black align-top">
                                <ul className="list-disc pl-4 space-y-1">
                                    {dish.ingredients.map((ing, i) => (
                                        <li key={i}>{ing.quantity} {ing.unit} {ing.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-2 border-black align-top whitespace-pre-wrap">
                                {dish.elaboration}
                            </div>

                            <div className="col-span-2 p-2 border-t border-black bg-gray-100 print:bg-white">
                                <strong>Justificación Sostenible:</strong> {dish.sustainabilityJustification}
                            </div>
                        </div>
                    </AcademicTable>
                </div>
            ))}
        </section>

        {/* === CAPÍTULO 5 (PRODUCTION) === */}
        <section className="mb-8 break-after-page">
             <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-500 pb-2 print:text-black print:border-black">5. Producción Final</h2>
             
             <h3 className="font-bold text-lg mb-2">5.1 Identidad Visual</h3>
             <p className="mb-4">{state.menuPrototype.generalStyle || "No definida."}</p>

             <h3 className="font-bold text-lg mb-2">5.2 Carta Digital</h3>
             <p className="mb-4">
                 Enlace al diseño: <a href={state.menuPrototype.digitalLink} target="_blank" className="underline">{state.menuPrototype.digitalLink || "No disponible"}</a>
             </p>
             <p className="text-xs mb-4">Responsables: {state.task6.designerIds.map(id => getMemberBadge(id))}</p>

             <h3 className="font-bold text-lg mb-2">5.3 Prototipo Físico</h3>
             <p className="mb-2">{state.menuPrototype.physicalDescription}</p>
             <p className="text-xs mb-4">Responsables: {state.task6.artisanIds.map(id => getMemberBadge(id))}</p>
             
             {state.menuPrototype.physicalPhoto && (
                 <AcademicFigure 
                    src={state.menuPrototype.physicalPhoto} 
                    alt="Prototipo Físico" 
                    title="Maqueta de la Carta Física" 
                 />
             )}
        </section>

        {/* === CAPÍTULO 6 === */}
        <section className="mb-8 break-after-page">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-500 pb-2 print:text-black print:border-black">6. Viabilidad Económica</h2>
            
            {state.dishes.map((dish) => (
                <div key={dish.id} className="mb-8 break-inside-avoid">
                    <div className="mb-1 flex justify-end">
                        {getMemberBadge(dish.author)}
                    </div>
                    <AcademicTable title={`Escandallo: ${dish.name}`}>
                        <div className="text-sm p-2">
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <div><strong>Coste Materia Prima Total:</strong> {dish.financials?.totalCost?.toFixed(2)}€</div>
                                <div><strong>Coste por Ración:</strong> {dish.financials?.costPerServing?.toFixed(2)}€</div>
                                <div><strong>Food Cost %:</strong> {dish.financials?.foodCostPercent?.toFixed(2)}%</div>
                                <div><strong>Margen Bruto:</strong> {dish.financials?.grossMargin?.toFixed(2)}€</div>
                            </div>
                            <div className="border-t border-black pt-2 mt-2">
                                <strong>PVP Final: {dish.price?.toFixed(2)}€</strong>
                            </div>
                            <div className="mt-2 text-xs italic">
                                <strong>Justificación de Precio:</strong> {dish.priceJustification || "Sin justificación."}
                            </div>
                        </div>
                    </AcademicTable>
                </div>
            ))}
        </section>

        {/* === ANEXO: COEVALUACIÓN === */}
        <section className="mb-8 break-before-page">
            <h2 className="text-2xl font-bold text-red-900 mb-6 border-b-2 border-red-500 pb-2 print:text-black print:border-black">Anexo Confidencial: Coevaluación</h2>
            <p className="text-sm italic mb-4">Nota: Este anexo contiene las valoraciones cruzadas entre los miembros del equipo.</p>

            {state.coEvaluations.length === 0 ? (
                <p className="italic">No se han registrado coevaluaciones.</p>
            ) : (
                <div className="space-y-4">
                    {state.coEvaluations.map((review, idx) => {
                        const evaluator = state.team.find(m => m.id === review.evaluatorId)?.name || 'Desconocido';
                        const target = state.team.find(m => m.id === review.targetId)?.name || 'Desconocido';
                        const totalScore = 
                            review.items.participation.score + 
                            review.items.responsibility.score + 
                            review.items.collaboration.score + 
                            review.items.contribution.score;

                        return (
                            <AcademicTable key={idx} title={`Evaluación: ${evaluator} a ${target}`}>
                                <div className="text-xs p-2">
                                    <div className="mb-2 font-bold">Puntuación Total: {totalScore} Puntos</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <strong>Participación:</strong> {review.items.participation.justification}
                                        </div>
                                        <div>
                                            <strong>Responsabilidad:</strong> {review.items.responsibility.justification}
                                        </div>
                                        <div>
                                            <strong>Colaboración:</strong> {review.items.collaboration.justification}
                                        </div>
                                        <div>
                                            <strong>Aportación:</strong> {review.items.contribution.justification}
                                        </div>
                                    </div>
                                </div>
                            </AcademicTable>
                        )
                    })}
                </div>
            )}
        </section>
      </div>
    </div>
  );
};