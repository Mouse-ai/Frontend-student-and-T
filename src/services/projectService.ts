import { getCurrentUser } from './authService';

export interface Project {
    id: string;
    name: string;
    description: string;
    direction: string;
    ownerId: string;
    ownerName: string;
    teamMembers: {
        id: string;
        name: string;
        role: string;
    }[];
    mentor?: {
        id: string;
        name: string;
        position: string;
    };
    // Новые поля для статуса запроса
    mentorRequestStatus: 'none' | 'pending' | 'accepted' | 'rejected';
    requestedMentorName?: string;

    status: 'active' | 'pending' | 'completed';
    createdAt: string;
    meetingDate?: string;
}

const PROJECTS_KEY = 'tbank_projects';

// Получить все проекты
export const getProjects = (): Project[] => {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
};

// Сохранить все проекты
export const saveProjects = (projects: Project[]) => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

// Создать проект
export const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'status' | 'ownerId' | 'ownerName' | 'mentorRequestStatus'>): Project => {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('Пользователь не авторизован');
    }

    const projects = getProjects();

    const newProject: Project = {
        ...projectData,
        id: `project-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'active',
        ownerId: user.id,
        ownerName: user.fullName,
        mentorRequestStatus: 'none', // По умолчанию запросов нет
    };

    projects.push(newProject);
    saveProjects(projects);

    return newProject;
};

// Получить проекты текущего пользователя
export const getUserProjects = (): Project[] => {
    const user = getCurrentUser();
    if (!user) return [];

    const projects = getProjects();
    return projects.filter(p => p.ownerId === user.id);
};

// Получить проект по ID
export const getProjectById = (id: string): Project | undefined => {
    const projects = getProjects();
    return projects.find(p => p.id === id);
};

// Обновить проект
export const updateProject = (id: string, updates: Partial<Project>): Project | null => {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) return null;

    projects[index] = { ...projects[index], ...updates };
    saveProjects(projects);

    return projects[index];
};

// Удалить проект
export const deleteProject = (id: string): boolean => {
    const projects = getProjects();
    const filtered = projects.filter(p => p.id !== id);

    if (filtered.length === projects.length) return false;

    saveProjects(filtered);
    return true;
};