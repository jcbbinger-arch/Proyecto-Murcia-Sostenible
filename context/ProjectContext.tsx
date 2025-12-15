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
  updateDishDistribution: (assignments: { type: DishType, authorId: string, name: string }[]) => void;
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
    // if we add new properties in the future
    return {
        ...INITIAL_STATE,
        ...loadedData,
        concept: { ...INITIAL_STATE.concept, ...(loadedData.concept || {}) },
        missions: { ...INITIAL_STATE.missions, ...(loadedData.missions || {}) },
        task2: { ...INITIAL_STATE.task2, ...(loadedData.task2 || {}) },
        task6: { ...INITIAL_STATE.task6, ...(loadedData.task6 || {}) },
        menuPrototype: { ...INITIAL_STATE.menuPrototype, ...(loadedData.menuPrototype || {}) },
        // Arrays are replaced, not merged, to avoid duplication issues, 
        // but we default to empty array if missing
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
    setState({ ...cleanData, currentUser: state.currentUser }); 
  };

  const mergeContribution = (incomingState: ProjectState, memberId: string) => {
      // Logic: Take the current state, and overwrite ONLY the parts assigned to memberId
      // from the incomingState.
      
      setState(current => {
          const newState = { ...current };

          // 1. Merge Task 2 (Analysis)
          if (incomingState.task2 && Array.isArray(incomingState.task2.tasks)) {
             newState.task2.tasks = current.task2.tasks.map(currentTask => {
                if (currentTask.assignedToId === memberId) {
                    // Find the version in incoming state
                    const incomingTask = incomingState.task2.tasks.find(t => t.id === currentTask.id);
                    if (incomingTask) {
                        return incomingTask; // Overwrite with incoming
                    }
                }
                return currentTask; // Keep existing
            });
          }

          // 2. Merge Dishes
          // We look for the dishes in incomingState that belong to memberId
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

          // 3. Merge Task 6 Roles work (if applicable)
          if (incomingState.menuPrototype) {
              // If this member is the Designer (6.A), merge menuPrototype digital parts
              if (current.task6.designerId === memberId) {
                   newState.menuPrototype = {
                       ...newState.menuPrototype,
                       digitalLink: incomingState.menuPrototype.digitalLink || newState.menuPrototype.digitalLink
                   };
              }
              // If this member is the Artisan (6.B), merge menuPrototype physical parts
               if (current.task6.artisanId === memberId) {
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
    // Force author to be current user
    const dishWithAuthor = { ...dish, author: state.currentUser || '' };
    setState(prev => ({ ...prev, dishes: [...prev.dishes, dishWithAuthor] }));
  };

  const updateDishDistribution = (assignments: { type: DishType, authorId: string, name: string }[]) => {
      setState(prev => {
          // Robust update: Try to preserve existing dish data if types match
          const unassignedDishes = [...prev.dishes];
          const newDishes: Dish[] = [];

          assignments.forEach(assign => {
             // Find existing dish of this type
             const matchIndex = unassignedDishes.findIndex(d => d.type === assign.type);
             
             if (matchIndex !== -1) {
                 // Update existing dish author and keep data
                 const existing = unassignedDishes[matchIndex];
                 newDishes.push({
                     ...existing,
                     author: assign.authorId,
                     // Only update name if it matches the generic assignment name or was empty
                     name: (existing.name && existing.name.length > 3) ? existing.name : assign.name
                 });
                 unassignedDishes.splice(matchIndex, 1);
             } else {
                 // Create new dish entry
                 newDishes.push({
                    id: Math.random().toString(36).substr(2, 9),
                    name: assign.name,
                    type: assign.type,
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
                    author: assign.authorId
                 });
             }
          });
          
          return { ...prev, dishes: newDishes };
      });
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
      updateDishDistribution,
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