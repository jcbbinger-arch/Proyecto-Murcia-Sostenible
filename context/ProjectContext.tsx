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
  createPlaceholderDishes: (assignments: { type: DishType, authorId: string, name: string }[]) => void;
  removeDish: (id: string) => void;
  updateDish: (dish: Dish) => void;
  updateMenuPrototype: (data: Partial<MenuPrototype>) => void;
  updateTask6Roles: (roles: Partial<Task6Roles>) => void;
  resetProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProjectState>(() => {
    const saved = localStorage.getItem('murcia_project_data');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('murcia_project_data', JSON.stringify(state));
  }, [state]);

  const setCurrentUser = (id: string | null) => {
    setState(prev => ({ ...prev, currentUser: id }));
  };

  const importProjectData = (data: ProjectState) => {
    setState({ ...data, currentUser: state.currentUser }); // Keep current user session if possible
  };

  const mergeContribution = (incomingState: ProjectState, memberId: string) => {
      // Logic: Take the current state, and overwrite ONLY the parts assigned to memberId
      // from the incomingState.
      
      setState(current => {
          const newState = { ...current };

          // 1. Merge Task 2 (Analysis)
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

          // 2. Merge Dishes
          // We look for the dishes in incomingState that belong to memberId
          const incomingDishes = incomingState.dishes.filter(d => d.author === memberId);
          
          // We replace the dishes in current state that match the IDs of incoming dishes
          // or add them if they are new (though in this workflow they should be pre-created)
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

          // 3. Merge Task 6 Roles work (if applicable)
          // If this member is the Designer (6.A), merge menuPrototype digital parts
          if (current.task6.designerId === memberId) {
               newState.menuPrototype = {
                   ...newState.menuPrototype,
                   digitalLink: incomingState.menuPrototype.digitalLink
               };
          }
          // If this member is the Artisan (6.B), merge menuPrototype physical parts
           if (current.task6.artisanId === memberId) {
               newState.menuPrototype = {
                   ...newState.menuPrototype,
                   physicalPhoto: incomingState.menuPrototype.physicalPhoto,
                   physicalDescription: incomingState.menuPrototype.physicalDescription,
                   generalStyle: incomingState.menuPrototype.generalStyle
               };
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

  const createPlaceholderDishes = (assignments: { type: DishType, authorId: string, name: string }[]) => {
      const newDishes: Dish[] = assignments.map((assign) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: assign.name, // Use placeholder name or real name
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
      }));

      // Replace all existing dishes with these new placeholders to start fresh structure
      setState(prev => ({ ...prev, dishes: newDishes }));
  };

  const removeDish = (id: string) => {
    setState(prev => ({ ...prev, dishes: prev.dishes.filter(d => d.id !== id) }));
  };

  const updateDish = (dish: Dish) => {
    // Keep original author if editing
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
    if(confirm("¿Estás seguro de borrar todo el progreso?")) {
        setState(INITIAL_STATE);
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
      createPlaceholderDishes,
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