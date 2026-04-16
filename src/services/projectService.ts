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
    if (!user) throw new Error('Пользователь не авторизован');

    const projects = getProjects();

    const newProject: Project = {
        ...projectData,
        id: `project-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'active',
        ownerId: user.id,
        ownerName: user.fullName,
        mentorRequestStatus: 'none',
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

// ==========================================
// НОВАЯ ФУНКЦИЯ ДЛЯ МЕНТОРА
// ==========================================
export const getMentorProjects = (mentorId: string): Project[] => {
    const projects = getProjects();
    // Ищем проекты, где этот ментор уже назначен
    return projects.filter(p => p.mentor?.id === mentorId);
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