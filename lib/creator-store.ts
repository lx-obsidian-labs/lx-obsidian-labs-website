export type CreatorProject = {
  id: string;
  type: "web" | "docs" | "image" | "consult";
  name: string;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, unknown>;
};

const STORAGE_KEY = "obsidian_creator_projects";

export function readCreatorProjects(): CreatorProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CreatorProject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCreatorProjects(projects: CreatorProject[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function upsertCreatorProject(project: CreatorProject) {
  const all = readCreatorProjects();
  const idx = all.findIndex((item) => item.id === project.id);
  if (idx >= 0) {
    all[idx] = project;
  } else {
    all.unshift(project);
  }
  writeCreatorProjects(all);
}

export function createProjectId() {
  return `prj_${Math.random().toString(36).slice(2, 10)}`;
}
