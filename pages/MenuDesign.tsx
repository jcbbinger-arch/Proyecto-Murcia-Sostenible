import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Dish, DishType, IngredientRow } from '../types';
import { ALLERGENS } from '../constants';
import { Plus, Trash2, Edit2, Image as ImageIcon, AlertCircle, BookOpen, PenTool, ClipboardList, Lock, User } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const MenuDesign: React.FC = () => {
  const { state, addDish, removeDish, updateDish } = useProject();
  const [activeTab, setActiveTab] = useState<'instructions' | 'design' | 'review'>('instructions');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<number>(1);
  
  // Empty dish template
  const [newDish, setNewDish] = useState<Dish>({
    id: '',
    name: '',
    type: DishType.STARTER,
    servings: 1,
    photo: null,
    description: '',
    elaboration: '',
    ingredients: [],
    allergens: [],
    sustainabilityJustification: '',
    cost: 0,
    price: 0,
    financials: { totalCost: 0, costPerServing: 0, foodCostPercent: 0, grossMargin: 0, grossMarginPercent: 0, salePrice: 0 },
    priceJustification: '',
    author: ''
  });

  const handleSaveDish = () => {
    if (!newDish.name) return alert("El nombre del plato es obligatorio");
    if (newDish.ingredients.length === 0) return alert("Añade al menos un ingrediente para el escandallo.");
    
    if (isEditing) {
      updateDish({ ...newDish, id: isEditing });
      setIsEditing(null);
    } else {
      addDish({ ...newDish, id: generateId() });
    }
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setNewDish({
        id: '',
        name: '',
        type: DishType.STARTER,
        servings: 1,
        photo: null,
        description: '',
        elaboration: '',
        ingredients: [],
        allergens: [],
        sustainabilityJustification: '',
        cost: 0,
        price: 0,
        financials: { totalCost: 0, costPerServing: 0, foodCostPercent: 0, grossMargin: 0, grossMarginPercent: 0, salePrice: 0 },
        priceJustification: '',
        author: ''
    });
    setActiveSection(1);
    setIsEditing(null);
  };

  const handleCreateNew = () => {
      resetForm();
      setIsEditing("NEW"); // Marker state to show form for new dish
  }

  const handleEditClick = (dish: Dish) => {
    let safeIngredients = dish.ingredients;
    if (typeof dish.ingredients === 'string') {
        safeIngredients = [];
    }

    setNewDish({
        ...dish,
        ingredients: safeIngredients,
        allergens: dish.allergens || [] 
    });
    setIsEditing(dish.id);
    setActiveTab('design');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
      if(confirm("¿Seguro que quieres eliminar este plato?")) {
          removeDish(id);
          if (isEditing === id) resetForm();
      }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDish(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAllergen = (allergenId: string) => {
    setNewDish(prev => {
        const current = prev.allergens || [];
        if (current.includes(allergenId)) {
            return { ...prev, allergens: current.filter(id => id !== allergenId) };
        } else {
            return { ...prev, allergens: [...current, allergenId] };
        }
    });
  };

  const addIngredientRow = () => {
    setNewDish(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { id: generateId(), name: '', quantity: 0, unit: 'kg', unitPrice: 0, totalCost: 0 }]
    }));
  };

  const updateIngredientRow = (id: string, field: keyof IngredientRow, value: any) => {
    setNewDish(prev => ({
        ...prev,
        ingredients: prev.ingredients.map(ing => ing.id === id ? { ...ing, [field]: value } : ing)
    }));
  };

  const removeIngredientRow = (id: string) => {
    setNewDish(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter(ing => ing.id !== id)
    }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center no-print gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 3: Diseño de Carta</h2>
            <p className="text-gray-600 mt-2">Creación de Fichas Técnicas Profesionales y Carta Gastronómica.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('instructions')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'instructions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <BookOpen size={18} /> Instrucciones
            </button>
            <button 
                onClick={() => setActiveTab('design')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'design' ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <PenTool size={18} /> Editor de Fichas
            </button>
             <button 
                onClick={() => setActiveTab('review')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'review' ? 'bg-purple-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <ClipboardList size={18} /> Revisión Carta
            </button>
        </div>
      </div>

      {/* TAB 1: INSTRUCTIONS */}
      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 prose max-w-none text-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Guía de Trabajo: Tarea 3</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-900 mt-0">Trabajo Individual</h4>
                    <p className="text-sm">Cada miembro del equipo debe crear <strong>4 fichas técnicas</strong> completas.</p>
                    <ul className="text-sm list-disc pl-5 mt-2">
                        <li>1 Aperitivo / Snack</li>
                        <li>1 Entrante</li>
                        <li>1 Plato Principal</li>
                        <li>1 Postre</li>
                    </ul>
                </div>
            </div>
            
            <div className="mt-6 flex justify-center">
                 <button onClick={() => setActiveTab('design')} className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow hover:bg-green-700">
                    Comenzar a Crear Platos
                 </button>
            </div>
        </div>
      )}

      {/* TAB 2: DESIGN FORM */}
      {activeTab === 'design' && (
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* List Column (Left) */}
        <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            <button 
                onClick={handleCreateNew}
                className="w-full bg-gray-900 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800"
            >
                <Plus size={20} /> Crear Nuevo Plato
            </button>

            <h3 className="text-lg font-bold text-gray-700 mt-4 flex items-center gap-2">
                <User size={20} /> Mis Platos Creados
            </h3>
            
            {state.dishes.filter(d => d.author === state.currentUser).length === 0 && (
                <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
                    <p>Aún no has creado ningún plato. ¡Dale al botón de arriba!</p>
                </div>
            )}
            
            <div className="space-y-3">
                {state.dishes.filter(d => d.author === state.currentUser).map((dish) => (
                    <div key={dish.id} className="p-4 rounded-xl border shadow-sm transition flex gap-3 bg-white border-green-100 hover:border-green-400 cursor-pointer">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            {dish.photo ? (
                                <img src={dish.photo} alt={dish.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20}/></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0" onClick={() => handleEditClick(dish)}>
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase truncate">{dish.type}</span>
                            </div>
                            <h4 className="font-bold text-gray-800 text-sm truncate mt-1">{dish.name}</h4>
                        </div>
                         <button onClick={() => handleDeleteClick(dish.id)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <h3 className="text-lg font-bold text-gray-700 mt-6 pt-4 border-t">Platos del Equipo</h3>
             <div className="space-y-3 opacity-70">
                {state.dishes.filter(d => d.author !== state.currentUser).map((dish) => {
                    const authorName = state.team.find(m => m.id === dish.author)?.name || 'Otro';
                    return (
                        <div key={dish.id} className="p-3 rounded-xl border bg-gray-50 flex gap-3">
                             <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                             <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-600 text-xs truncate">{dish.name}</h4>
                                <p className="text-[10px] text-gray-400">Chef: {authorName}</p>
                             </div>
                             <Lock size={14} className="text-gray-300" />
                        </div>
                    )
                })}
             </div>

        </div>

        {/* Form Column (Right) */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden order-1 lg:order-2">
            {!isEditing ? (
                <div className="p-12 text-center text-gray-500">
                    <PenTool size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Selecciona un plato para editar o crea uno nuevo.</p>
                </div>
            ) : (
                <>
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                        {isEditing === 'NEW' ? 'Creando Nuevo Plato' : `Editando: ${newDish.name}`}
                    </h3>
                    <div className="flex space-x-2">
                        {[1, 2, 3].map(step => (
                            <div 
                                key={step} 
                                onClick={() => setActiveSection(step)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                                    activeSection === step ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="p-6">
                    {/* SECTION 1: IDENTITY */}
                    {activeSection === 1 && (
                        <div className="space-y-6">
                            <h4 className="font-bold text-green-700 border-b pb-2">1. Identidad del Plato</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="label">Nombre del Plato</label>
                                        <input 
                                            className="input-field w-full border p-2 rounded"
                                            value={newDish.name}
                                            onChange={e => setNewDish({...newDish, name: e.target.value})}
                                            placeholder="Ej: Arroz con Conejo y Serranas"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Tipo</label>
                                            <select 
                                                className="w-full border p-2 rounded"
                                                value={newDish.type}
                                                onChange={e => setNewDish({...newDish, type: e.target.value as DishType})}
                                            >
                                                {Object.values(DishType).map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label">Raciones</label>
                                            <input 
                                                type="number" 
                                                className="w-full border p-2 rounded"
                                                value={newDish.servings}
                                                onChange={e => setNewDish({...newDish, servings: parseInt(e.target.value) || 1})}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label">Descripción Comercial (Carta)</label>
                                        <textarea 
                                            className="w-full border p-2 rounded h-24"
                                            value={newDish.description}
                                            onChange={e => setNewDish({...newDish, description: e.target.value})}
                                            placeholder="Descripción atractiva para el cliente..."
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 min-h-[250px]">
                                    {newDish.photo ? (
                                        <div className="relative w-full h-full">
                                            <img src={newDish.photo} alt="Plato" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                                            <button 
                                                onClick={() => setNewDish({...newDish, photo: null})}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center text-gray-500 hover:text-green-600">
                                            <ImageIcon size={48} className="mb-2" />
                                            <span className="text-sm font-bold">Subir Foto del Plato</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={() => setActiveSection(2)} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">Siguiente</button>
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: RECIPE */}
                    {activeSection === 2 && (
                        <div className="space-y-6">
                            <h4 className="font-bold text-green-700 border-b pb-2">2. Receta y Escandallo</h4>
                            
                            {/* Ingredients Table */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="label">Ingredientes (Para {newDish.servings} raciones)</label>
                                    <button onClick={addIngredientRow} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 flex items-center gap-1">
                                        <Plus size={14} /> Añadir Ingrediente
                                    </button>
                                </div>
                                <div className="bg-gray-50 rounded-lg border overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100 text-left">
                                            <tr>
                                                <th className="p-2 w-1/2">Ingrediente</th>
                                                <th className="p-2">Cantidad</th>
                                                <th className="p-2">Unidad</th>
                                                <th className="p-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {newDish.ingredients.map((ing) => (
                                                <tr key={ing.id}>
                                                    <td className="p-2">
                                                        <input 
                                                            className="w-full border p-1 rounded" 
                                                            placeholder="Ej: Tomate Pera"
                                                            value={ing.name}
                                                            onChange={(e) => updateIngredientRow(ing.id, 'name', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <input 
                                                            type="number"
                                                            className="w-full border p-1 rounded" 
                                                            placeholder="0"
                                                            value={ing.quantity}
                                                            onChange={(e) => updateIngredientRow(ing.id, 'quantity', parseFloat(e.target.value))}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <select 
                                                            className="w-full border p-1 rounded"
                                                            value={ing.unit}
                                                            onChange={(e) => updateIngredientRow(ing.id, 'unit', e.target.value)}
                                                        >
                                                            <option value="kg">kg</option>
                                                            <option value="g">g</option>
                                                            <option value="l">l</option>
                                                            <option value="ml">ml</option>
                                                            <option value="ud">ud</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button onClick={() => removeIngredientRow(ing.id)} className="text-red-400 hover:text-red-600">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {newDish.ingredients.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="p-4 text-center text-gray-400 italic">No hay ingredientes. Añade uno para el escandallo.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Elaboration */}
                            <div>
                                <label className="label">Elaboración / Paso a Paso</label>
                                <textarea 
                                    className="w-full border p-2 rounded h-32"
                                    value={newDish.elaboration}
                                    onChange={e => setNewDish({...newDish, elaboration: e.target.value})}
                                    placeholder="1. Cortar las verduras... 2. Sofreír..."
                                />
                            </div>

                            <div className="flex justify-between">
                                <button onClick={() => setActiveSection(1)} className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded">Atrás</button>
                                <button onClick={() => setActiveSection(3)} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">Siguiente</button>
                            </div>
                        </div>
                    )}

                    {/* SECTION 3: TECH & ALLERGENS */}
                    {activeSection === 3 && (
                        <div className="space-y-6">
                            <h4 className="font-bold text-green-700 border-b pb-2">3. Seguridad Alimentaria y Costes</h4>
                            
                            <div>
                                <label className="label mb-2 flex items-center gap-2">
                                    <AlertCircle size={16} className="text-orange-500" /> 
                                    Alérgenos (Clica para activar)
                                </label>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                    {ALLERGENS.map(allergen => {
                                        const isActive = (newDish.allergens || []).includes(allergen.id);
                                        return (
                                            <button 
                                                key={allergen.id}
                                                onClick={() => toggleAllergen(allergen.id)}
                                                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all ${
                                                    isActive 
                                                    ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500' 
                                                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className="text-xl mb-1">{allergen.icon}</span>
                                                <span className="text-[10px] text-center leading-tight">{allergen.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="label">Justificación Sostenible (Storytelling)</label>
                                <textarea 
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500"
                                    rows={2}
                                    value={newDish.sustainabilityJustification}
                                    onChange={e => setNewDish({...newDish, sustainabilityJustification: e.target.value})}
                                    placeholder="Por qué es sostenible (Km0, temporada...)"
                                />
                            </div>

                            <div className="bg-blue-50 p-4 rounded text-sm text-blue-900">
                                <strong>Nota:</strong> Los cálculos financieros detallados (Escandallo) se realizarán en la <strong>Tarea 5</strong>.
                                Aquí solo debes introducir una estimación inicial.
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <div>
                                    <label className="label">Coste Materia Prima Estimado (€)</label>
                                    <input 
                                        type="number"
                                        className="w-full border p-2 rounded bg-white"
                                        value={newDish.cost}
                                        onChange={e => setNewDish({...newDish, cost: parseFloat(e.target.value) || 0})}
                                    />
                                </div>
                                <div>
                                    <label className="label">Precio Venta (PVP) Estimado (€)</label>
                                    <input 
                                        type="number"
                                        className="w-full border p-2 rounded bg-white"
                                        value={newDish.price}
                                        onChange={e => setNewDish({...newDish, price: parseFloat(e.target.value) || 0})}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button onClick={() => setActiveSection(2)} className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded">Atrás</button>
                                <div className="flex gap-2">
                                    <button onClick={resetForm} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                                    <button 
                                        onClick={handleSaveDish}
                                        className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 shadow-lg flex items-center gap-2"
                                    >
                                        <Plus size={18} /> Guardar Plato
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                </>
            )}
        </div>
      </div>
      )}

      {/* TAB 3: REVIEW */}
      {activeTab === 'review' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Revisión de la Carta Completa</h3>
            <p className="text-gray-600 mb-8">
                Resumen de todos los platos creados por el equipo.
            </p>

            <div className="max-w-3xl mx-auto space-y-4 text-left">
                {Object.values(DishType).map(type => {
                    const dishesOfType = state.dishes.filter(d => d.type === type);
                    if (dishesOfType.length === 0) return null;
                    return (
                        <div key={type} className="border-b pb-4">
                            <h4 className="text-lg font-bold text-green-800 uppercase mb-2">{type}</h4>
                            <ul className="space-y-2">
                                {dishesOfType.map(dish => {
                                    const authorName = state.team.find(m => m.id === dish.author)?.name || 'Desconocido';
                                    return (
                                        <li key={dish.id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded">
                                            <div>
                                                <span className="font-medium text-gray-900">{dish.name}</span>
                                                <span className="text-xs text-gray-400 ml-2">({authorName})</span>
                                            </div>
                                            <span className="text-gray-500 italic">{dish.price}€</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })}
                 {state.dishes.length === 0 && <p className="text-gray-400 italic text-center">No hay platos en la carta aún.</p>}
            </div>
        </div>
      )}

      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 0.25rem; }
      `}</style>
    </div>
  );
};