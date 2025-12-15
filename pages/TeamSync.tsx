import React, { useRef, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Download, Upload, User, Users, FileJson, Merge } from 'lucide-react';

export const TeamSync: React.FC = () => {
  const { state, setCurrentUser, importProjectData, mergeContribution } = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mergeInputRef = useRef<HTMLInputElement>(null);
  const [mergeStatus, setMergeStatus] = useState<string>('');

  const handleIdentify = (id: string) => {
    setCurrentUser(id);
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `murcia_proyecto_${state.teamName.replace(/\s+/g, '_')}_config.json`;
    link.click();
  };

  const handleExportContribution = () => {
    const member = state.team.find(m => m.id === state.currentUser);
    if (!member) return alert("Debes identificarte primero.");

    // We export the whole state, but name it differently so the coordinator knows it's a partial
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contribucion_${member.name.replace(/\s+/g, '_')}.json`;
    link.click();
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          importProjectData(data);
          alert("Proyecto importado correctamente. Ahora selecciona tu nombre.");
        } catch (error) {
          alert("Error al leer el archivo.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleMerge = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            // We need to know WHO sent this file. 
            // In a real app, we'd check metadata. Here, we'll ask the Coordinator.
            // Simplified: We try to match content or just ask user.
            
            // Let's create a dialog or just a simple prompt for now, or infer from filename?
            // Safer: Let the coordinator pick the member from a list BEFORE clicking upload, 
            // but the input is hidden.
            
            // Wait, we need the UI to pick the member first.
          } catch (error) {
            alert("Error al leer el archivo.");
          }
        };
        // We handle the actual logic in the Render part with a wrapper function
      }
  };

  const triggerMergeForMember = (memberId: string) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e: any) => {
          const file = e.target.files?.[0];
          if(!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
              try {
                  const incomingData = JSON.parse(ev.target?.result as string);
                  mergeContribution(incomingData, memberId);
                  const memberName = state.team.find(m => m.id === memberId)?.name;
                  setMergeStatus(`¡Éxito! Datos de ${memberName} fusionados correctamente.`);
                  setTimeout(() => setMergeStatus(''), 3000);
              } catch (err) {
                  alert("Error al fusionar el archivo.");
              }
          };
          reader.readAsText(file);
      };
      input.click();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Gestión de Equipo y Sincronización</h2>
        <p className="text-gray-600 mt-2">
          Importa el proyecto del coordinador, trabaja en tu parte y exporta tu contribución.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* PANEL 1: IDENTITY */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} /> 1. ¿Quién eres?
            </h3>
            <p className="text-sm text-gray-600 mb-4">Selecciona tu nombre para activar tus permisos de edición.</p>
            
            <div className="space-y-2">
                {state.team.map(member => (
                    <button
                        key={member.id}
                        onClick={() => handleIdentify(member.id)}
                        className={`w-full p-3 rounded-lg flex justify-between items-center transition ${
                            state.currentUser === member.id 
                            ? 'bg-green-100 border-green-500 text-green-900 ring-2 ring-green-500' 
                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                        }`}
                    >
                        <span className="font-medium">{member.name}</span>
                        {member.isCoordinator && <span className="text-xs bg-gray-200 px-2 py-1 rounded">COORD</span>}
                        {state.currentUser === member.id && <span className="text-green-600 font-bold">YO</span>}
                    </button>
                ))}
                {state.team.length === 0 && <p className="text-gray-400 italic">No hay equipo definido (Tarea 1).</p>}
            </div>
        </div>

        {/* PANEL 2: ACTIONS */}
        <div className="space-y-6">
            
            {/* COORDINATOR ACTIONS */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Users size={20} /> Zona del Coordinador
                </h3>
                
                <div className="space-y-4">
                    <button 
                        onClick={handleExportConfig}
                        className="w-full bg-white border border-blue-300 text-blue-800 p-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-100"
                    >
                        <Upload size={18} /> Exportar Archivo de Equipo
                    </button>
                    <p className="text-xs text-blue-700">
                        Envía este archivo a tus compañeros para que puedan empezar a trabajar.
                    </p>

                    <div className="border-t border-blue-200 pt-4">
                        <label className="text-sm font-bold text-blue-900 block mb-2">Fusionar Trabajo de Compañero</label>
                        <div className="grid grid-cols-1 gap-2">
                            {state.team.filter(m => !m.isCoordinator).map(m => (
                                <button 
                                    key={m.id}
                                    onClick={() => triggerMergeForMember(m.id)}
                                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex justify-between items-center"
                                >
                                    <span>Importar de {m.name}</span>
                                    <Merge size={14} />
                                </button>
                            ))}
                        </div>
                        {mergeStatus && <p className="text-green-600 font-bold text-sm mt-2">{mergeStatus}</p>}
                    </div>
                </div>
            </div>

            {/* MEMBER ACTIONS */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <User size={20} /> Zona del Miembro
                </h3>
                
                <div className="space-y-4">
                    <label className="w-full bg-white border border-green-300 text-green-800 p-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-100 cursor-pointer">
                        <Download size={18} /> Importar Proyecto del Coord.
                        <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImportConfig} />
                    </label>
                    
                    <button 
                        onClick={handleExportContribution}
                        disabled={!state.currentUser}
                        className="w-full bg-green-600 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
                    >
                        <FileJson size={18} /> Exportar Mi Trabajo
                    </button>
                    <p className="text-xs text-green-700">
                        Envía el archivo generado a tu coordinador para que lo una al proyecto.
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};