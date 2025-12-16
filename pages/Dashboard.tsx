
import React, { useRef, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, FileText, User, Lock, LogIn, Download } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state, resetProject, importProjectData, setCurrentUser } = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);

  // LOGIC: If team exists but user is not identified, BLOCK access with a modal
  const needsIdentity = state.team.length > 0 && !state.currentUser;

  const handleStartNew = () => {
      if(confirm("Esto borrará cualquier datos actuales para empezar de cero. ¿Estás seguro?")) {
          localStorage.removeItem('murcia_project_data');
          window.location.reload(); // Hard reload to clear context
      }
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = state.teamName ? state.teamName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'proyecto';
    const date = new Date().toISOString().slice(0, 10);
    
    link.href = url;
    link.download = `BACKUP_MURCIA_${safeName}_${date}.json`;
    link.click();
  };

  const handleLoadClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImporting(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          importProjectData(data);
          setIsImporting(false);
          // The state update will trigger the re-render, and 'needsIdentity' will become true if applicable
        } catch (error) {
          alert("Error al leer el archivo JSON. Asegúrate de que es un archivo válido.");
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleIdentitySelect = (id: string) => {
      setCurrentUser(id);
      // Once identified, they stay on dashboard or can navigate
  };

  // --- RENDER: IDENTITY LOCK SCREEN ---
  if (needsIdentity) {
      return (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                      <User size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Identificación Requerida</h2>
                  <p className="text-gray-600 mb-8 text-lg">
                      Has cargado el proyecto <strong>{state.teamName}</strong>. <br/>
                      Para continuar y evitar conflictos, debes confirmar quién eres.
                  </p>
                  
                  <div className="grid gap-3 max-h-80 overflow-y-auto text-left">
                      {state.team.map(member => (
                          <button
                              key={member.id}
                              onClick={() => handleIdentitySelect(member.id)}
                              className="group flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all"
                          >
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 group-hover:bg-green-200 group-hover:text-green-800">
                                      {member.name.charAt(0)}
                                  </div>
                                  <div>
                                      <span className="block font-bold text-gray-900 text-lg">{member.name}</span>
                                      {member.isCoordinator && (
                                          <span className="text-xs uppercase font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Coordinador</span>
                                      )}
                                  </div>
                              </div>
                              <LogIn className="text-gray-300 group-hover:text-green-600" />
                          </button>
                      ))}
                  </div>
                  <p className="mt-6 text-xs text-gray-400">
                      Selecciona tu nombre para desbloquear tus tareas asignadas.
                  </p>
              </div>
          </div>
      );
  }

  // --- RENDER: MAIN DASHBOARD ---
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Panel de Gestión <span className="text-green-600">Murcia Sostenible</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bienvenido al entorno de trabajo. Selecciona una opción para empezar.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* OPTION 1: LOAD PROJECT */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-400 transition-all group cursor-pointer relative overflow-hidden" onClick={handleLoadClick}>
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Opción Recomendada
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Cargar Proyecto / Restaurar</h3>
              <p className="text-gray-600 mb-6">
                  Si tienes un archivo <code>.json</code> (Backup, Configuración del Coordinador, etc.), cárgalo aquí para continuar trabajando.
              </p>
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <FileText size={20} /> Cargar Archivo
              </button>
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".json"
              />
          </div>

          {/* OPTION 2: START NEW */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-green-400 transition-all group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                  <ArrowRight size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Comenzar Nuevo Proyecto</h3>
              <p className="text-gray-600 mb-6">
                  Solo para el inicio del curso o para Coordinadores que crean el equipo desde cero. Borrará cualquier dato actual.
              </p>
              {state.team.length > 0 ? (
                  <Link 
                    to="/task-1"
                    className="w-full py-3 bg-white border-2 border-green-600 text-green-700 rounded-lg font-bold hover:bg-green-50 transition flex items-center justify-center gap-2"
                  >
                      Continuar Proyecto Actual
                  </Link>
              ) : (
                  <button 
                    onClick={handleStartNew}
                    className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                      <ArrowRight size={20} /> Crear Desde Cero (Tarea 1)
                  </button>
              )}
          </div>
      </div>

      {state.currentUser && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-xl">
                      {state.team.find(m => m.id === state.currentUser)?.name.charAt(0)}
                  </div>
                  <div>
                      <p className="text-sm text-green-800 font-bold uppercase">Sesión Activa</p>
                      <p className="text-lg font-bold text-gray-900">
                          Hola, {state.team.find(m => m.id === state.currentUser)?.name}
                      </p>
                  </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                  <div className="text-sm text-gray-500 hidden md:block">
                      <p>Guarda tu trabajo frecuentemente.</p>
                  </div>
                  <button 
                    onClick={handleBackup}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-sm"
                  >
                      <Download size={18} /> Backup
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
