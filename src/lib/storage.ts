import Dexie, { type Table } from "dexie";
import type { CardProject } from "@/types/card";

class NewYearCardDatabase extends Dexie {
  projects!: Table<CardProject, string>;

  constructor() {
    super("newyear-card-maker-db");
    this.version(1).stores({
      projects: "id, updatedAt",
    });
  }
}

const db = typeof window !== "undefined" ? new NewYearCardDatabase() : null;

export const ACTIVE_PROJECT_ID = "current-draft";

export async function saveProjectToLocal(project: CardProject): Promise<void> {
  if (!db) return;
  await db.projects.put({
    ...project,
    id: ACTIVE_PROJECT_ID,
    updatedAt: Date.now(),
  });
}

export async function loadProjectFromLocal(): Promise<CardProject | undefined> {
  if (!db) return undefined;
  return db.projects.get(ACTIVE_PROJECT_ID);
}

export async function clearLocalProject(): Promise<void> {
  if (!db) return;
  await db.projects.delete(ACTIVE_PROJECT_ID);
}
