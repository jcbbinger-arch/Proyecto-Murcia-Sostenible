import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { Sidebar } from './components/Sidebar';
import { GeminiChat } from './components/GeminiChat';
import { Landing } from './pages/Landing';
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
import { AcademicGuide } from './pages/AcademicGuide';

// Layout wrapper to conditionally show Sidebar and Chat
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans text-gray-900">
      {!isLanding && <Sidebar />}
      
      <main className={`flex-1 transition-all duration-300 ${!isLanding ? 'ml-64' : ''}`}>
        {children}
      </main>

      {!isLanding && <GeminiChat />}
    </div>
  );
};

function App() {
  return (
    <ProjectProvider>
      <HashRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/academic-guide" element={<AcademicGuide />} />
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
        </AppLayout>
      </HashRouter>
    </ProjectProvider>
  );
}

export default App;