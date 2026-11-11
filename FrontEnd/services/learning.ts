export type LearningLevel = {
  id: string;
  title: string;
  description: string;
  progressPercent: number;
  locked: boolean;
  current: boolean;
};

export interface LearningApi {
  listLevels(userId: string, accessToken: string): Promise<LearningLevel[]>;
}

let learningApi: LearningApi | null = null;
export function configureLearningApi(adapter: LearningApi) { learningApi = adapter; }
export function hasLearningApi() { return learningApi !== null; }
export function listLevels(userId: string, accessToken: string): Promise<LearningLevel[]> {
  if (!learningApi) throw new Error('O serviço de níveis ainda não está conectado ao frontend.');
  return learningApi.listLevels(userId, accessToken);
}
