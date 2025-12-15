import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Dish, IngredientRow } from '../types';
import { DollarSign, BookOpen, Calculator, Save, AlertTriangle } from 'lucide-react';

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
        // Ensure ingredient rows have numeric values for new fields
        const ingredientsWithFinancials = dish.ingredients.map(ing => ({
            ...ing,
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

  // Recalculate totals whenever ingredients or target PVP changes
  useEffect(() => {
    if (!currentDish) return;

    const totalRawMaterialCost = currentDish.ingredients.reduce((sum, ing) => sum + (ing.totalCost || 0), 0);
    const costPerServing = currentDish.servings > 0 ? totalRawMaterialCost / currentDish.servings : 0;
    
    // Safety check for division by zero
    const pvp = currentDish.price || 0;
    const foodCostPercent = pvp > 0 ? (costPerServing / pvp) * 100 : 0;
    const grossMargin = pvp - costPerServing;
    const grossMarginPercent = pvp > 0 ? (grossMargin / pvp) * 100 : 0;

    setCurrentDish(prev => {
        if (!prev) return null;
        return {
            ...prev,
            financials: {
                totalCost: totalRawMaterialCost,
                costPerServing: costPerServing,
                foodCostPercent: foodCostPercent,
                grossMargin: grossMargin,
                grossMarginPercent: grossMarginPercent,
                salePrice: pvp // In this model, user inputs PVP, we calculate margin
            }
        };
    });

  }, [currentDish?.ingredients, currentDish?.price, currentDish?.servings]);


  const handleIngredientChange = (id: string, field: keyof IngredientRow, value: number) => {
    if (!currentDish) return;
    
    const updatedIngredients = currentDish.ingredients.map(ing => {
        if (ing.id === id) {
            const newIng = { ...ing, [field]: value };
            // Recalculate row total
            if (field === 'quantity' || field === 'unitPrice') {
                newIng.totalCost = newIng.quantity * newIng.unitPrice;
            }
            return newIng;
        }
        return ing;
    });

    setCurrentDish({ ...currentDish, ingredients: updatedIngredients });
  };

  const handlePVPChange = (val: number) => {
      if (!currentDish) return;
      setCurrentDish({ ...currentDish, price: val });
  }

  const handleJustificationChange = (val: string) => {
    if (!currentDish) return;
    setCurrentDish({ ...currentDish, priceJustification: val });
  }

  const saveEscandallo = () => {
      if (currentDish) {
          updateDish(currentDish);
          alert(`Escandallo guardado para: ${currentDish.name}`);
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center no-print gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 5: Viabilidad Económica</h2>
            <p className="text-gray-600 mt-2">Análisis de Rentabilidad y Escandallos (Fase 4)</p>
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
             <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Objetivo: El "Baño de Realidad"</h3>
             <p>El objetivo es que calcules el coste real de tus creaciones y defiendas su precio de venta.</p>
             
             <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-bold text-yellow-900 mt-0">Instrucciones (Trabajo Individual)</h4>
                    <ul className="text-sm list-disc pl-5 space-y-2">
                        <li><strong>Selecciona tus platos:</strong> Realiza el escandallo para los 4 platos que diseñaste en la Tarea 3.</li>
                        <li><strong>Investigación de Precios:</strong> Busca precios reales de mercado (webs, tickets, etc.).</li>
                        <li><strong>Cálculo del Coste:</strong> Rellena la tabla con los precios unitarios. El sistema calculará automáticamente los costes.</li>
                        <li><strong>Justificación del PVP:</strong> Compara tu precio final con el mercado y justifícalo.</li>
                    </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-900 mt-0">Cómo usar la calculadora</h4>
                    <ol className="text-sm list-decimal pl-5 space-y-2">
                        <li>Ve a la pestaña <strong>"Escandallos"</strong>.</li>
                        <li>Selecciona un plato del desplegable.</li>
                        <li>Introduce el <strong>Precio Unitario</strong> para cada ingrediente.</li>
                        <li>Ajusta el <strong>PVP (Precio Venta Público)</strong> deseado.</li>
                        <li>Analiza el <strong>% Food Cost</strong> resultante (Ideal: 25-35%).</li>
                        <li>Escribe la justificación y guarda.</li>
                    </ol>
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
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 flex items-center gap-4">
                <label className="font-bold text-gray-700">Selecciona un Plato para Escandallar:</label>
                <select 
                    className="p-2 border border-gray-300 rounded-lg min-w-[300px]"
                    value={selectedDishId}
                    onChange={(e) => setSelectedDishId(e.target.value)}
                >
                    <option value="">-- Seleccionar Plato --</option>
                    {state.dishes.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.type})</option>
                    ))}
                </select>
            </div>

            {currentDish ? (
                <div className="space-y-8 animate-fade-in">
                    {/* The Blue Escandallo Sheet */}
                    <div className="border-4 border-black bg-white">
                        {/* Header */}
                        <div className="bg-blue-200 text-center p-4 border-b-2 border-black">
                            <h2 className="text-2xl font-bold uppercase">Escandallo de Plato</h2>
                            <h3 className="text-xl font-bold uppercase">Hoja de Coste</h3>
                        </div>

                        {/* Meta Data */}
                        <div className="flex border-b-2 border-black">
                            <div className="flex-1 p-2 border-r-2 border-black">
                                <span className="font-bold text-sm block">Nombre del plato</span>
                                <span className="text-lg">{currentDish.name}</span>
                            </div>
                            <div className="w-48 p-2 border-r-2 border-black bg-white">
                                <span className="font-bold text-sm block">Nº de raciones</span>
                                <span className="text-lg">{currentDish.servings}</span>
                            </div>
                            <div className="w-48 p-2 bg-white">
                                <span className="font-bold text-sm block">Fecha</span>
                                <span className="text-lg">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Table Header */}
                        <div className="flex bg-blue-200 border-b-2 border-black font-bold text-sm text-center">
                            <div className="flex-1 p-2 border-r border-black">Productos</div>
                            <div className="w-24 p-2 border-r border-black">Cantidad</div>
                            <div className="w-24 p-2 border-r border-black">Unidad</div>
                            <div className="w-32 p-2 border-r border-black">Precio Unitario (€)</div>
                            <div className="w-32 p-2">Coste (€)</div>
                        </div>

                        {/* Table Body - Ingredients */}
                        <div className="text-sm">
                            {currentDish.ingredients.map((ing) => (
                                <div key={ing.id} className="flex border-b border-gray-300 items-center hover:bg-gray-50">
                                    <div className="flex-1 p-2 border-r border-gray-300">{ing.name}</div>
                                    <div className="w-24 p-1 border-r border-gray-300">
                                        <input 
                                            type="number" 
                                            className="w-full text-center bg-transparent focus:bg-white border-none focus:ring-1 focus:ring-blue-500 rounded"
                                            value={ing.quantity}
                                            onChange={(e) => handleIngredientChange(ing.id, 'quantity', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="w-24 p-2 border-r border-gray-300 text-center">{ing.unit}</div>
                                    <div className="w-32 p-1 border-r border-gray-300">
                                         <input 
                                            type="number" 
                                            className="w-full text-center bg-yellow-50 focus:bg-white border border-yellow-200 focus:ring-1 focus:ring-blue-500 rounded font-medium"
                                            placeholder="0.00"
                                            value={ing.unitPrice || ''}
                                            onChange={(e) => handleIngredientChange(ing.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="w-32 p-2 text-right font-mono pr-4">
                                        {(ing.totalCost || 0).toFixed(2)} €
                                    </div>
                                </div>
                            ))}
                            {/* Empty rows filler for visual fidelity */}
                            {Array.from({ length: Math.max(0, 10 - currentDish.ingredients.length) }).map((_, i) => (
                                <div key={i} className="flex border-b border-gray-300 h-8">
                                    <div className="flex-1 border-r border-gray-300"></div>
                                    <div className="w-24 border-r border-gray-300"></div>
                                    <div className="w-24 border-r border-gray-300"></div>
                                    <div className="w-32 border-r border-gray-300"></div>
                                    <div className="w-32"></div>
                                </div>
                            ))}
                        </div>

                        {/* Totals Section */}
                        <div className="bg-blue-100 border-t-2 border-black text-sm">
                            
                            {/* Total Raw Material */}
                            <div className="flex border-b border-black">
                                <div className="flex-1 p-2 font-bold border-r border-black">Coste total de la materia prima</div>
                                <div className="w-32 p-2 text-right font-bold bg-white">{currentDish.financials.totalCost.toFixed(2)} €</div>
                            </div>
                            
                            {/* Cost Per Serving */}
                            <div className="flex border-b border-black">
                                <div className="flex-1 p-2 font-bold border-r border-black">Coste por ración</div>
                                <div className="w-32 p-2 text-right font-bold bg-white">{currentDish.financials.costPerServing.toFixed(2)} €</div>
                            </div>

                            {/* Food Cost % */}
                            <div className="flex border-b border-black">
                                <div className="flex-1 p-2 font-bold border-r border-black">% Food cost (Coste / PVP)</div>
                                <div className={`w-32 p-2 text-right font-bold bg-white ${
                                    currentDish.financials.foodCostPercent > 35 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                    {currentDish.financials.foodCostPercent.toFixed(2)} %
                                </div>
                            </div>

                            {/* Gross Margin */}
                            <div className="flex border-b border-black">
                                <div className="flex-1 p-2 font-bold border-r border-black">Margen bruto de explotación (PVP - Coste)</div>
                                <div className="w-32 p-2 text-right font-bold bg-white">{currentDish.financials.grossMargin.toFixed(2)} €</div>
                            </div>
                            
                             {/* Gross Margin % */}
                             <div className="flex border-b border-black">
                                <div className="flex-1 p-2 font-bold border-r border-black">% Margen bruto de explotación</div>
                                <div className="w-32 p-2 text-right font-bold bg-white">{currentDish.financials.grossMarginPercent.toFixed(2)} %</div>
                            </div>

                            {/* PVP INPUT */}
                            <div className="flex border-black">
                                <div className="flex-1 p-2 font-black text-base uppercase border-r border-black flex items-center justify-between">
                                    <span>Precio de venta al público por ración (PVP)</span>
                                    <span className="text-xs font-normal normal-case text-gray-500 mr-2">(Introduce el precio final deseado)</span>
                                </div>
                                <div className="w-32 p-0 bg-white relative">
                                    <input 
                                        type="number"
                                        className="w-full h-full text-right font-black text-lg p-2 bg-yellow-100 focus:bg-white focus:ring-inset focus:ring-2 focus:ring-blue-500"
                                        value={currentDish.price || ''}
                                        onChange={(e) => handlePVPChange(parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="absolute right-8 top-2 text-gray-400 pointer-events-none">€</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Justification Section */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Justificación del Precio</h3>
                        <p className="text-sm text-gray-600 mb-2">Compara tu PVP con el ticket medio de la zona y competidores. ¿Por qué es rentable?</p>
                        <textarea 
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            rows={3}
                            placeholder="El precio se justifica por la calidad del producto Km0..."
                            value={currentDish.priceJustification || ''}
                            onChange={(e) => handleJustificationChange(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end pt-4 mb-12">
                         <button 
                            onClick={saveEscandallo}
                            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 shadow-lg flex items-center gap-2"
                        >
                            <Save size={20} /> Guardar Escandallo
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
                    <Calculator size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Selecciona un plato arriba para comenzar el cálculo.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};