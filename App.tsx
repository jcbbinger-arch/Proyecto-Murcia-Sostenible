import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { Sidebar } from './components/Sidebar';
import { GeminiChat } from './components/GeminiChat';
import { Dashboard } from './pages/Dashboard';
import { Task1_TeamZone } from './pages/Task1_TeamZone';
import { ProjectSetup } from './pages/ProjectSetup';
import { Task2_Analysis } from './pages/Task2_Analysis';
import { ConceptDefinition } from './pages/ConceptDefinition';
import { MenuDesign } from './pages/MenuDesign';
import { Task4_MenuPrototype } from './pages/Task4_MenuPrototype';
import { Task5_Financials } from './pages/Task5_Financials';
import { Task6_FinalAssembly } from './pages/Task6_FinalAssembly';
import { TeamSync } from './pages/TeamSync';
import { FinalMemory } from './pages/FinalMemory';

function App() {
  return (
    <ProjectProvider>
      <HashRouter>
        <div className="flex bg-gray-50 min-h-screen font-sans text-gray-900">
          <Sidebar />
          
          <main className="flex-1 ml-64 transition-all duration-300">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/task-1" element={<Task1_TeamZone />} />
              <Route path="/setup" element={<ProjectSetup />} />
              <Route path="/sync" element={<TeamSync />} />
              <Route path="/task-2" element={<Task2_Analysis />} />
              <Route path="/zone" element={<Navigate to="/task-1" replace />} />
              <Route path="/concept" element={<ConceptDefinition />} />
              <Route path="/menu" element={<MenuDesign />} />
              <Route path="/task-4" element={<Task4_MenuPrototype />} />
              <Route path="/financials" element={<Task5_Financials />} />
              <Route path="/task-6" element={<Task6_FinalAssembly />} />
              <Route path="/memory" element={<FinalMemory />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <GeminiChat />
        </div>
      </HashRouter>
    </ProjectProvider>
  );
}

export default App;