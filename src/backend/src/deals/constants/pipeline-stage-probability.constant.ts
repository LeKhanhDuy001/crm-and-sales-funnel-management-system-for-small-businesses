export const PIPELINE_STAGE_PROBABILITY: Record<string, number> = {
  lead: 10,
  qualified: 30,
  proposal: 50,
  negotiation: 70,
  won: 100,
  lost: 0,
};

export function getPipelineStageProbability(stageName: string): number | null {
  const normalizedName = stageName.trim().toLowerCase();

  return PIPELINE_STAGE_PROBABILITY[normalizedName] ?? null;
}
