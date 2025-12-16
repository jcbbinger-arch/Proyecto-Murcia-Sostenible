import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Dish, IngredientRow } from '../types';
import { BookOpen, Calculator, Save, AlertTriangle } from 'lucide-react';

export const Task5_Financials: React.FC = () => {
  const { state, updateDish } = useProject();
  const [activeTab, setActiveTab] = useState<'instructions' | 'calculator'>('instructions');
  const [selectedDishId, setSelectedDishId] = useState<string>('');
  const [currentDish, setCurrentDish] = useState<Dish | null>(null);

  // Load selected dish data into local state for editing
  useEffect(() => {
    if (selectedDishId) {
      const dish = state.dishes.find(d => d.id === selectedDishId);
      if (dish) {
        // Ensure ingredients have proper numeric values
        // We keep the row calculation (Quantity * Price) as a helper, but totals are manual
        const ingredientsWithFinancials = dish.ingredients.map(ing => ({
            ...ing,
            quantity: ing.quantity || 0, // Enforce existing quantity
            unitPrice: ing.unitPrice || 0,
            totalCost: (ing.quantity || 0) * (ing.unitPrice || 0)
        }));
        
        setCurrentDish({
            ...dish,
            ingredients: ingredientsWithFinancials
        });
      }
    } else {
      setCurrentDish(null);
    }
  }, [selectedDishId, state.dishes]);

  // REMOVED: The useEffect that automatically calculated totals based on ingredients.
  // Now students must enter these values manually.

  const handleUnitPriceChange = (id: string, value: number) => {
    if (!currentDish) return;
    
    const updatedIngredients = currentDish.ingredients.map(ing => {
        if (ing.id === id) {
            const newPrice = value;
            // We still auto-calculate the ROW total (Quantity * Price) for convenience
            return { 
                ...ing, 
                unitPrice: newPrice,
                totalCost: (ing.quantity || 0) * newPrice 
            };
        }
        return ing;
    });

    setCurrentDish({ ...currentDish, ingredients: updatedIngredients });
  };

  // Handler for manual financial inputs (Totals, Margins, Percents)
  const handleFinancialInput = (field: keyof typeof currentDish.financials, value: number) => {
      if (!currentDish) return;
      setCurrentDish({
          ...currentDish,
          financials: {
              ...currentDish.financials,
              [field]: value
          }
      });
  };

  const handlePVPChange = (val: number) => {
      if (!currentDish) return;
      setCurrentDish({ ...currentDish, price: val });
  }

  const saveEscandallo = () => {
      if (currentDish) {
          // This updates the global state dish
          updateDish({
              ...currentDish,
              cost: currentDish.financials.totalCost, // Sync total cost
              price: currentDish.price // Sync PVP
          });
          alert(`¡Escandallo guardado!\n\nSe han actualizado los datos en la Ficha Técnica de "${currentDish.name}".`);
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center no-print gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 5: Viabilidad Económica</h2>
            <p className="text-gray-600 mt-2">Cálculo de costes y precios de venta (Escandallos).</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('instructions')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'instructions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <BookOpen size={18} /> Instrucciones
            </button>
            <button 
                onClick={() => setActiveTab('calculator')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'calculator' ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <Calculator size={18} /> Escandallos
            </button>
        </div>
      </div>

      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 prose max-w-none text-gray-700">
             <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Objetivo: Determinar el Precio Justo</h3>
             
             <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-900 mt-0">¿Cómo funciona?</h4>
                    <p className="text-sm mb-2">Esta herramienta es una hoja de trabajo manual.</p>
                    <ol className="text-sm list-decimal pl-5 space-y-2">
                        <li>Selecciona uno de tus platos.</li>
                        <li>Introduce el <strong>Precio Unitario</strong> de mercado para cada ingrediente.</li>
                        <li><strong>Calcula tú mismo</strong> la suma total de los costes y escríbela en la casilla correspondiente.</li>
                        <li>Realiza las operaciones matemáticas necesarias para hallar el Coste por Ración, el Food Cost % y el Margen Bruto.</li>
                        <li>Introduce los resultados en las casillas azules del pie de página.</li>
                    </ol>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-bold text-yellow-900 mt-0">Ejercicio Práctico</h4>
                    <p className="text-sm">
                        La aplicación <strong>NO calculará los totales automáticamente</strong>. Debes demostrar que entiendes de dónde sale cada cifra realizando las sumas y divisiones pertinentes.
                    </p>
                </div>
             </div>
             
             <div className="flex justify-center mt-8">
                 <button onClick={() => setActiveTab('calculator')} className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow hover:bg-green-700">
                    Comenzar Escandallos
                 </button>
             </div>
        </div>
      )}

      {activeTab === 'calculator' && (
        <div>
            {/* Dish Selector */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 flex flex-col md:flex-row items-center gap-4 shadow-sm">
                <div className="flex-1">
                    <label className="font-bold text-gray-700 block mb-2">Selecciona un Plato para Escandallar:</label>
                    <select 
                        className="w-full p-3 border border-gray-300 rounded-lg text-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        value={selectedDishId}
                        onChange={(e) => setSelectedDishId(e.target.value)}
                    >
                        <option value="">-- Seleccionar de la Carta --</option>
                        {state.dishes.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.type}) - Autor: {state.team.find(m=>m.id === d.author)?.name}</option>
                        ))}
                    </select>
                </div>
                {selectedDishId && currentDish && (
                   <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg border">
                       Receta para <span className="font-bold text-gray-900">{currentDish.servings} raciones</span>
                   </div>
                )}
            </div>

            {currentDish ? (
                <div className="space-y-8 animate-fade-in">
                    
                    {/* === ESCANDALLO SHEET (EXACT REPLICA START) === */}
                    <div className="border-[3px] border-black bg-white shadow-2xl max-w-4xl mx-auto">
                        
                        {/* HEADER */}
                        <div className="bg-[#bfdbfe] text-center py-6 border-b-[3px] border-black">
                            <h2 className="text-2xl font-bold text-black tracking-wide">ESCANDALLO DE PLATO</h2>
                            <h3 className="text-xl font-bold text-black tracking-wide mt-1">HOJA DE COSTE</h3>
                        </div>

                        {/* INFO ROW */}
                        <div className="flex border-b-[3px] border-black h-20">
                            <div className="flex-[2] border-r-[3px] border-black p-2 flex flex-col justify-between">
                                <span className="font-bold text-sm">Nombre del plato</span>
                                <span className="text-xl truncate font-medium pl-2">{currentDish.name}</span>
                            </div>
                            <div className="flex-1 border-r-[3px] border-black p-2 flex flex-col justify-between bg-white">
                                <span className="font-bold text-sm">Nº de raciones</span>
                                <span className="text-xl text-center font-medium">{currentDish.servings}</span>
                            </div>
                            <div className="flex-1 p-2 flex flex-col justify-between">
                                <span className="font-bold text-sm">Fecha</span>
                                <span className="text-lg text-center font-medium">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* GRID HEADER */}
                        <div className="flex bg-[#bfdbfe] border-b-[3px] border-black text-center font-bold text-black h-12 items-center text-sm">
                            <div className="flex-[2] border-r border-black h-full flex items-center justify-center bg-[#bfdbfe]">Productos</div>
                            <div className="w-24 border-r border-black h-full flex items-center justify-center bg-[#bfdbfe]">Cantidad</div>
                            <div className="w-24 border-r border-black h-full flex items-center justify-center bg-[#bfdbfe]">Unidad</div>
                            <div className="flex-[1.5] flex flex-col h-full">
                                <div className="h-1/2 border-b border-black w-full bg-[#bfdbfe]"></div> {/* Spacer for visual match */}
                                <div className="flex h-1/2">
                                    <div className="flex-1 border-r border-black flex items-center justify-center bg-[#bfdbfe]">Precio</div>
                                    <div className="flex-1 flex items-center justify-center bg-[#bfdbfe]">Coste</div>
                                </div>
                            </div>
                        </div>

                        {/* GRID BODY */}
                        <div className="text-sm font-medium">
                            {currentDish.ingredients.map((ing) => (
                                <div key={ing.id} className="flex border-b border-black h-10 items-center hover:bg-yellow-50 transition-colors group">
                                    <div className="flex-[2] border-r border-black pl-3 h-full flex items-center text-gray-800">
                                        {ing.name}
                                    </div>
                                    <div className="w-24 border-r border-black text-center h-full flex items-center justify-center bg-gray-50 text-gray-600">
                                        {ing.quantity}
                                    </div>
                                    <div className="w-24 border-r border-black text-center h-full flex items-center justify-center bg-gray-50 text-gray-600">
                                        {ing.unit}
                                    </div>
                                    
                                    {/* PRECIO INPUT */}
                                    <div className="flex-[0.75] border-r border-black h-full relative">
                                        <input 
                                            type="number" 
                                            className="w-full h-full text-center bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-800"
                                            placeholder="0.00"
                                            value={ing.unitPrice || ''}
                                            onChange={(e) => handleUnitPriceChange(ing.id, parseFloat(e.target.value) || 0)}
                                        />
                                        <span className="absolute top-0 right-1 text-[10px] text-gray-400 h-full flex items-center pointer-events-none">€</span>
                                    </div>

                                    {/* COSTE CALCULATED (Still auto for rows to avoid tedium, but totals are manual) */}
                                    <div className="flex-[0.75] h-full flex items-center justify-end pr-4 font-mono bg-gray-50 text-gray-800">
                                        {(ing.totalCost || 0).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            
                            {/* Empty rows filler */}
                            {Array.from({ length: Math.max(0, 10 - currentDish.ingredients.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex border-b border-black h-10 bg-white">
                                    <div className="flex-[2] border-r border-black"></div>
                                    <div className="w-24 border-r border-black"></div>
                                    <div className="w-24 border-r border-black"></div>
                                    <div className="flex-[0.75] border-r border-black"></div>
                                    <div className="flex-[0.75]"></div>
                                </div>
                            ))}
                        </div>

                        {/* TOTALS SECTION (MANUAL INPUTS NOW) */}
                        <div className="bg-[#bfdbfe] border-t-2 border-black text-sm text-black">
                            
                            {/* Row 1: Total Cost */}
                            <div className="flex border-b border-black h-10 items-center">
                                <div className="flex-1 pl-3 font-medium">Coste total de la materia prima (Suma)</div>
                                <div className="w-32 h-full border-l border-black relative">
                                    <input 
                                        type="number"
                                        className="w-full h-full text-right pr-6 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 placeholder-gray-300"
                                        placeholder="0.00"
                                        value={currentDish.financials.totalCost || ''}
                                        onChange={(e) => handleFinancialInput('totalCost', parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">€</span>
                                </div>
                            </div>
                            
                            {/* Row 2: Cost Per Serving */}
                            <div className="flex border-b border-black h-10 items-center">
                                <div className="flex-1 pl-3 font-medium">Coste por ración (Total / Nº Raciones)</div>
                                <div className="w-32 h-full border-l border-black relative">
                                    <input 
                                        type="number"
                                        className="w-full h-full text-right pr-6 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 placeholder-gray-300"
                                        placeholder="0.00"
                                        value={currentDish.financials.costPerServing || ''}
                                        onChange={(e) => handleFinancialInput('costPerServing', parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">€</span>
                                </div>
                            </div>

                            {/* Row 3: Food Cost % */}
                            <div className="flex border-b border-black h-10 items-center">
                                <div className="flex-1 pl-3 font-medium">% Food cost (Coste Ración / PVP * 100)</div>
                                <div className="w-32 h-full border-l border-black relative">
                                    <input 
                                        type="number"
                                        className={`w-full h-full text-right pr-6 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold placeholder-gray-300 ${
                                            (currentDish.financials.foodCostPercent || 0) > 35 ? 'text-red-600' : 'text-green-700'
                                        }`}
                                        placeholder="0.00"
                                        value={currentDish.financials.foodCostPercent || ''}
                                        onChange={(e) => handleFinancialInput('foodCostPercent', parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">%</span>
                                </div>
                            </div>

                            {/* Row 4: Gross Margin */}
                            <div className="flex border-b border-black h-10 items-center">
                                <div className="flex-1 pl-3 font-medium">Margen bruto de explotación (PVP - Coste Ración)</div>
                                <div className="w-32 h-full border-l border-black relative">
                                    <input 
                                        type="number"
                                        className="w-full h-full text-right pr-6 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 placeholder-gray-300"
                                        placeholder="0.00"
                                        value={currentDish.financials.grossMargin || ''}
                                        onChange={(e) => handleFinancialInput('grossMargin', parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">€</span>
                                </div>
                            </div>
                            
                            {/* Row 5: Gross Margin % */}
                            <div className="flex border-b border-black h-10 items-center">
                                <div className="flex-1 pl-3 font-medium">% Margen bruto de explotación</div>
                                <div className="w-32 h-full border-l border-black relative">
                                    <input 
                                        type="number"
                                        className="w-full h-full text-right pr-6 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 placeholder-gray-300"
                                        placeholder="0.00"
                                        value={currentDish.financials.grossMarginPercent || ''}
                                        onChange={(e) => handleFinancialInput('grossMarginPercent', parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">%</span>
                                </div>
                            </div>

                            {/* Row 6: Calculated Sale Price (Informational) */}
                            <div className="flex border-b border-black h-10 items-center">
                                <div className="flex-1 pl-3 font-medium text-gray-600 italic">Precio Teórico Sugerido (Coste Ración * 3.33)</div>
                                <div className="w-32 text-right pr-4 text-gray-500 italic bg-gray-50 h-full flex items-center justify-end border-l border-black">
                                    {(currentDish.financials.costPerServing * 3.33).toFixed(2)} €
                                </div>
                            </div>

                            {/* Row 7: PVP INPUT (MAIN) */}
                            <div className="flex h-14 items-center bg-white border-t border-black">
                                <div className="flex-1 pl-3 font-extrabold text-lg uppercase bg-white h-full flex items-center">
                                    Precio de venta al público por ración
                                </div>
                                <div className="w-32 h-full border-l border-black bg-white relative">
                                    <input 
                                        type="number"
                                        className="w-full h-full text-right font-black text-xl pr-8 bg-yellow-100 focus:bg-white focus:ring-inset focus:ring-4 focus:ring-green-500 outline-none"
                                        value={currentDish.price || ''}
                                        onChange={(e) => handlePVPChange(parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-gray-500 pointer-events-none">€</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* === ESCANDALLO SHEET END === */}

                    {/* Action Buttons */}
                    <div className="flex justify-center pt-8 mb-12">
                         <button 
                            onClick={saveEscandallo}
                            className="bg-green-600 text-white px-12 py-4 rounded-full font-bold hover:bg-green-700 shadow-xl flex items-center gap-3 text-lg transform hover:scale-105 transition-all"
                        >
                            <Save size={24} /> Guardar Escandallo y Sincronizar Ficha
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
                    <Calculator size={64} className="mx-auto text-gray-300 mb-6" />
                    <h3 className="text-xl font-bold text-gray-500">Ningún plato seleccionado</h3>
                    <p className="text-gray-400 mt-2">Elige un plato del menú superior para cargar sus ingredientes.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};