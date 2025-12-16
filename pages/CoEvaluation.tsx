
import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { User, AlertTriangle, Save, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { PeerReview, RubricItem } from '../types';

export const CoEvaluation: React.FC = () => {
  const { state, savePeerReview } = useProject();
  const [targetId, setTargetId] = useState<string>('');

  const emptyItem: RubricItem = { score: 0, justification: '' };
  
  const [form, setForm] = useState<{
      participation: RubricItem;
      responsibility: RubricItem;
      collaboration: RubricItem;
      contribution: RubricItem;
  }>({
      participation: { ...emptyItem },
      responsibility: { ...emptyItem },
      collaboration: { ...emptyItem },
      contribution: { ...emptyItem },
  });

  // Current user logic
  const me = state.team.find(m => m.id === state.currentUser);
  // Teammates excluding me
  const teammates = state.team.filter(m => m.id !== state.currentUser);

  const handleTargetChange = (id: string) => {
      setTargetId(id);
      // Try to load existing review if any
      const existing = state.coEvaluations.find(r => r.evaluatorId === state.currentUser && r.targetId === id);
      if (existing) {
          setForm(existing.items);
      } else {
          setForm({
            participation: { ...emptyItem },
            responsibility: { ...emptyItem },
            collaboration: { ...emptyItem },
            contribution: { ...emptyItem },
          });
      }
  };

  const updateItem = (category: keyof typeof form, field: 'score' | 'justification', value: any) => {
      setForm(prev => ({
          ...prev,
          [category]: {
              ...prev[category],
              [field]: value
          }
      }));
  };

  const handleSave = () => {
      if (!state.currentUser) return;
      if (!targetId) return alert("Selecciona a un compañero.");

      // Validation
      const categories = ['participation', 'responsibility', 'collaboration', 'contribution'] as const;
      for (const cat of categories) {
          if (form[cat].score === 0) return alert(`Debes puntuar el apartado: ${translateCategory(cat)}`);
          if (form[cat].justification.trim().length < 10) return alert(`La justificación de ${translateCategory(cat)} es demasiado corta.`);
      }

      const review: PeerReview = {
          evaluatorId: state.currentUser,
          targetId,
          timestamp: Date.now(),
          items: form
      };

      savePeerReview(review);
      alert("Coevaluación guardada correctamente.");
  };

  const translateCategory = (cat: string) => {
      switch(cat) {
          case 'participation': return 'Participación';
          case 'responsibility': return 'Responsabilidad';
          case 'collaboration': return 'Colaboración';
          case 'contribution': return 'Aportación Final';
          default: return cat;
      }
  };

  const RubricRow = ({ 
      category, 
      title, 
      descPos, 
      descNeg 
  }: { 
      category: keyof typeof form, 
      title: string, 
      descPos: string, 
      descNeg: string 
  }) => (
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h4 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">{category === 'participation' ? '1' : category === 'responsibility' ? '2' : category === 'collaboration' ? '3' : '4'}</span>
              {title}
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
              <button 
                onClick={() => updateItem(category, 'score', 0.5)}
                className={`p-4 rounded-lg border-2 text-left transition-all relative ${
                    form[category].score === 0.5 
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                    : 'border-gray-200 hover:border-green-200'
                }`}
              >
                  <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-green-700 flex items-center gap-2"><ThumbsUp size={16}/> Positivo (+0.5)</span>
                  </div>
                  <p className="text-xs text-gray-600">{descPos}</p>
              </button>

              <button 
                onClick={() => updateItem(category, 'score', -0.5)}
                className={`p-4 rounded-lg border-2 text-left transition-all relative ${
                    form[category].score === -0.5 
                    ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                    : 'border-gray-200 hover:border-red-200'
                }`}
              >
                  <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-red-700 flex items-center gap-2"><ThumbsDown size={16}/> Negativo (-0.5)</span>
                  </div>
                  <p className="text-xs text-gray-600">{descNeg}</p>
              </button>
          </div>

          <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} /> Justificación Obligatoria
              </label>
              <textarea 
                  className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2}
                  placeholder={`Explica por qué has elegido esta puntuación para ${title}...`}
                  value={form[category].justification}
                  onChange={(e) => updateItem(category, 'justification', e.target.value)}
              />
          </div>
      </div>
  );

  if (!state.currentUser) {
       return (
          <div className="p-8 text-center">
              <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-800">Identificación Requerida</h2>
              <p className="text-gray-600 mb-4">Debes identificarte en el Panel Principal para evaluar a tus compañeros.</p>
          </div>
      )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-3xl">⚖️</span> Coevaluación Diabólica
        </h2>
        <p className="text-gray-600 mt-2">
            Evalúa la contribución real de tus compañeros. Esta valoración puede sumar o restar hasta 1 punto en su nota final.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-sm text-blue-800">
          <strong>Instrucciones:</strong> Sé honesto y objetivo. Tus justificaciones serán revisadas por el profesor. El objetivo es ajustar la nota al esfuerzo real individual.
      </div>

      <div className="mb-8">
          <label className="block text-lg font-bold text-gray-800 mb-3">¿A quién vas a evaluar?</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teammates.map(member => (
                  <button
                    key={member.id}
                    onClick={() => handleTargetChange(member.id)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        targetId === member.id 
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-blue-300 text-gray-600'
                    }`}
                  >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                          {member.name.charAt(0)}
                      </div>
                      <span className="font-bold">{member.name}</span>
                  </button>
              ))}
          </div>
          {teammates.length === 0 && <p className="text-gray-400 italic">No tienes compañeros de equipo registrados.</p>}
      </div>

      {targetId && (
          <div className="animate-fade-in">
              <RubricRow 
                category="participation" 
                title="Participación" 
                descPos="Participa de manera regular, aporta ideas, se involucra en discusiones y mantiene constancia."
                descNeg="Participa de forma escasa, puntual o nula; no aporta al desarrollo del trabajo."
              />
              <RubricRow 
                category="responsibility" 
                title="Responsabilidad y Cumplimiento" 
                descPos="Asume y realiza sus tareas con seriedad, cumple plazos y muestra autonomía."
                descNeg="No cumple con las tareas asignadas, entrega tarde o depende excesivamente de otros."
              />
              <RubricRow 
                category="collaboration" 
                title="Capacidad de Colaboración" 
                descPos="Escucha, respeta opiniones, coopera, comunica con claridad y ayuda a resolver conflictos."
                descNeg="No colabora, genera conflictos, no respeta opiniones o dificulta la dinámica del grupo."
              />
              <RubricRow 
                category="contribution" 
                title="Aportación al Resultado Final" 
                descPos="Sus aportaciones tienen calidad, mejoran el resultado final y ayudan a cumplir objetivos."
                descNeg="Sus aportaciones son mínimas, irrelevantes o incluso entorpecen el resultado del equipo."
              />

              <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-gray-200 shadow-lg flex justify-end items-center z-20">
                  <div className="flex gap-4 items-center">
                      <div className="text-sm text-gray-500 mr-4">
                          Total: <span className={
                              (form.participation.score + form.responsibility.score + form.collaboration.score + form.contribution.score) > 0 
                              ? "text-green-600 font-bold" 
                              : "text-red-600 font-bold"
                          }>
                              {(form.participation.score + form.responsibility.score + form.collaboration.score + form.contribution.score) > 0 ? '+' : ''}
                              {(form.participation.score + form.responsibility.score + form.collaboration.score + form.contribution.score) * 0.5} Puntos
                          </span> (Ref)
                      </div>
                      <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg"
                      >
                          <Save size={18} /> Guardar Evaluación
                      </button>
                  </div>
              </div>
              <div className="h-16"></div>
          </div>
      )}
    </div>
  );
};
