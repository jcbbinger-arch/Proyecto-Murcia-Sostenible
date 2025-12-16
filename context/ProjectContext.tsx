import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProjectState, Zone, Dish, TeamMember, MenuPrototype, Task6Roles, DishType } from '../types';
import { INITIAL_STATE } from '../constants';

interface ProjectContextType {
  state: ProjectState;
  setCurrentUser: (id: string | null) => void;
  importProjectData: (data: ProjectState) => void;
  mergeContribution: (contributorData: ProjectState, memberId: string) => void;
  
  updateSchoolSettings: (name: string, year: string) => void;
  updateImage: (type: 'schoolLogo' | 'groupPhoto', base64: string | null) => void;
  updateTeamName: (name: string) => void;
  updateTeamMembers: (members: TeamMember[]) => void;
  selectZone: (zone: Zone) => void;
  updateZoneJustification: (text: string) => void;
  assignTask: (taskId: number, memberId: string | null) => void;
  updateTaskContent: (taskId: number, content: string) => void;
  updateConcept: (key: keyof ProjectState['concept'], value: any) => void;
  updateMission: (role: keyof ProjectState['missions'], data: any) => void;
  addDish: (dish: Dish) => void;
  removeDish: (id: string) => void;
  updateDish: (dish: Dish) => void;
  updateMenuPrototype: (data: Partial<MenuPrototype>) => void;
  updateTask6Roles: (roles: Partial<Task6Roles>) => void;
  resetProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Helper to ensure loaded data has all required fields from INITIAL_STATE
const sanitizeState = (loadedData: any): ProjectState => {
    if (!loadedData) return INITIAL_STATE;
    
    // Deep merge strategy for critical sections to avoid "undefined" errors
    const safeTask6 = { 
        designerIds: loadedData.task6?.designerIds || loadedData.task6?.designerId ? (Array.isArray(loadedData.task6?.designerIds) ? loadedData.task6.designerIds : [loadedData.task6?.designerId].filter(Boolean)) : [],
        artisanIds: loadedData.task6?.artisanIds || loadedData.task6?.artisanId ? (Array.isArray(loadedData.task6?.artisanIds) ? loadedData.task6.artisanIds : [loadedData.task6?.artisanId].filter(Boolean)) : [],
        editorIds: loadedData.task6?.editorIds || loadedData.task6?.editorId ? (Array.isArray(loadedData.task6?.editorIds) ? loadedData.task6.editorIds : [loadedData.task6?.editorId].filter(Boolean)) : []
    };

    return {
        ...INITIAL_STATE,
        ...loadedData,
        concept: { ...INITIAL_STATE.concept, ...(loadedData.concept || {}) },
        missions: { ...INITIAL_STATE.missions, ...(loadedData.missions || {}) },
        task2: { ...INITIAL_STATE.task2, ...(loadedData.task2 || {}) },
        task6: safeTask6,
        menuPrototype: { ...INITIAL_STATE.menuPrototype, ...(loadedData.menuPrototype || {}) },
        dishes: Array.isArray(loadedData.dishes) ? loadedData.dishes : [],
        team: Array.isArray(loadedData.team) ? loadedData.team : []
    };
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProjectState>(() => {
    try {
      const saved = localStorage.getItem('murcia_project_data');
      return saved ? sanitizeState(JSON.parse(saved)) : INITIAL_STATE;
    } catch (error) {
      console.error("Error loading project data from local storage, resetting to default.", error);
      return INITIAL_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('murcia_project_data', JSON.stringify(state));
    } catch (error) {
      console.error("Error saving project data to local storage", error);
    }
  }, [state]);

  const setCurrentUser = (id: string | null) => {
    setState(prev => ({ ...prev, currentUser: id }));
  };

  const importProjectData = (data: ProjectState) => {
    // Sanitize incoming data too
    const cleanData = sanitizeState(data);
    // When importing a full project, we often reset currentUser so they must select again (security/logic check)
    setState({ ...cleanData, currentUser: null }); 
  };

  const mergeContribution = (incomingState: ProjectState, memberId: string) => {
      setState(current => {
          const newState = { ...current };
          const contributorName = current.team.find(m => m.id === memberId)?.name || 'Miembro del Equipo';

          // 1. Merge Task 2 (Analysis) - SMART MERGE
          if (incomingState.task2 && Array.isArray(incomingState.task2.tasks)) {
             newState.task2.tasks = current.task2.tasks.map(currentTask => {
                const incomingTask = incomingState.task2.tasks.find(t => t.id === currentTask.id);
                
                // If there is incoming data for this task
                if (incomingTask && incomingTask.content && incomingTask.content.trim() !== "") {
                    
                    // Case A: The task was empty in master, just take the new content
                    if (!currentTask.content || currentTask.content.trim() === "") {
                        return { ...currentTask, content: incomingTask.content };
                    }

                    // Case B: The task has content, but it's different. 
                    // This handles the "two people assigned" or "overlap" scenario.
                    // We append the new content with a label so nothing is lost.
                    if (currentTask.content !== incomingTask.content) {
                        // Prevent duplicating if the user just imported their own file back
                        if (currentTask.content.includes(incomingTask.content)) {
                            return currentTask;
                        }
                        return {
                            ...currentTask,
                            content: `${currentTask.content}\n\n--- Aportación de ${contributorName} ---\n${incomingTask.content}`
                        };
                    }
                }
                return currentTask;
            });
          }

          // 2. Merge Dishes - Updated logic: Add any dish created by this author
          if (Array.isArray(incomingState.dishes)) {
              const incomingDishes = incomingState.dishes.filter(d => d.author === memberId);
              
              let updatedDishes = [...current.dishes];
              incomingDishes.forEach(inDish => {
                  const index = updatedDishes.findIndex(d => d.id === inDish.id);
                  if (index !== -1) {
                      updatedDishes[index] = inDish;
                  } else {
                      updatedDishes.push(inDish);
                  }
              });
              newState.dishes = updatedDishes;
          }

          // 3. Merge Task 6 Roles work
          if (incomingState.menuPrototype) {
              const isDesigner = current.task6.designerIds.includes(memberId);
              const isArtisan = current.task6.artisanIds.includes(memberId);

              if (isDesigner) {
                   newState.menuPrototype = {
                       ...newState.menuPrototype,
                       digitalLink: incomingState.menuPrototype.digitalLink || newState.menuPrototype.digitalLink
                   };
              }
              if (isArtisan) {
                   newState.menuPrototype = {
                       ...newState.menuPrototype,
                       physicalPhoto: incomingState.menuPrototype.physicalPhoto || newState.menuPrototype.physicalPhoto,
                       physicalDescription: incomingState.menuPrototype.physicalDescription || newState.menuPrototype.physicalDescription,
                       generalStyle: incomingState.menuPrototype.generalStyle || newState.menuPrototype.generalStyle
                   };
              }
          }

          return newState;
      });
  };

  const updateSchoolSettings = (name: string, year: string) => {
    setState(prev => ({ ...prev, schoolName: name, academicYear: year }));
  };

  const updateImage = (type: 'schoolLogo' | 'groupPhoto', base64: string | null) => {
    setState(prev => ({ ...prev, [type]: base64 }));
  };

  const updateTeamName = (name: string) => setState(prev => ({ ...prev, teamName: name }));
  
  const updateTeamMembers = (members: TeamMember[]) => setState(prev => ({ ...prev, team: members }));

  const selectZone = (zone: Zone) => setState(prev => ({ ...prev, selectedZone: zone }));
  
  const updateZoneJustification = (text: string) => setState(prev => ({ ...prev, zoneJustification: text }));

  const assignTask = (taskId: number, memberId: string | null) => {
    setState(prev => ({
        ...prev,
        task2: {
            ...prev.task2,
            tasks: prev.task2.tasks.map(t => t.id === taskId ? { ...t, assignedToId: memberId } : t)
        }
    }));
  };

  const updateTaskContent = (taskId: number, content: string) => {
    setState(prev => ({
        ...prev,
        task2: {
            ...prev.task2,
            tasks: prev.task2.tasks.map(t => t.id === taskId ? { ...t, content: content } : t)
        }
    }));
  };

  const updateConcept = (key: keyof ProjectState['concept'], value: any) => {
    setState(prev => ({
      ...prev,
      concept: { ...prev.concept, [key]: value }
    }));
  };

  const updateMission = (role: keyof ProjectState['missions'], data: any) => {
    setState(prev => ({
      ...prev,
      missions: { ...prev.missions, [role]: { ...prev.missions[role], ...data } }
    }));
  };

  const addDish = (dish: Dish) => {
    // Force author to be current user if not set
    const dishWithAuthor = { ...dish, author: dish.author || state.currentUser || '' };
    setState(prev => ({ ...prev, dishes: [...prev.dishes, dishWithAuthor] }));
  };

  const removeDish = (id: string) => {
    setState(prev => ({ ...prev, dishes: prev.dishes.filter(d => d.id !== id) }));
  };

  const updateDish = (dish: Dish) => {
    setState(prev => ({
        ...prev,
        dishes: prev.dishes.map(d => d.id === dish.id ? dish : d)
    }));
  }

  const updateMenuPrototype = (data: Partial<MenuPrototype>) => {
    setState(prev => ({
        ...prev,
        menuPrototype: { ...prev.menuPrototype, ...data }
    }));
  }

  const updateTask6Roles = (roles: Partial<Task6Roles>) => {
      setState(prev => ({
          ...prev,
          task6: { ...prev.task6, ...roles }
      }));
  }

  const resetProject = () => {
    if(confirm("¿Estás seguro de borrar todo el progreso? Esta acción no se puede deshacer.")) {
        localStorage.removeItem('murcia_project_data');
        setState(INITIAL_STATE);
        window.location.reload();
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      state, 
      setCurrentUser,
      importProjectData,
      mergeContribution,
      updateSchoolSettings,
      updateImage,
      updateTeamName, 
      updateTeamMembers,
      selectZone, 
      updateZoneJustification,
      assignTask,
      updateTaskContent,
      updateConcept, 
      updateMission, 
      addDish, 
      removeDish, 
      updateDish,
      updateMenuPrototype,
      updateTask6Roles,
      resetProject 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};