export const xelvoKeys = {
  coreOverview: () => ['xelvo', 'core', 'overview'] as const,
  agents: (projectRef?: string) => ['xelvo', 'agents', projectRef ?? 'default'] as const,
  policies: (projectRef?: string) => ['xelvo', 'policies', projectRef ?? 'default'] as const,
  costSummary: (projectRef?: string) => ['xelvo', 'cost', projectRef ?? 'default'] as const,
  auditSummary: (projectRef?: string) => ['xelvo', 'audit', projectRef ?? 'default'] as const,
}
