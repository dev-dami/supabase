import Link from 'next/link'

import { useParams } from 'common'
import { useXelvoAgentsSummaryQuery } from 'data/xelvo/agents-query'
import { useXelvoAuditSummaryQuery } from 'data/xelvo/audit-summary-query'
import { useXelvoCostSummaryQuery } from 'data/xelvo/cost-summary-query'
import { useXelvoCoreOverviewQuery } from 'data/xelvo/core-overview-query'
import { useXelvoPoliciesSummaryQuery } from 'data/xelvo/policies-query'
import { useSelectedProjectQuery } from 'hooks/misc/useSelectedProject'

const OVERVIEW_CARD_CONFIG = [
  {
    key: 'agents',
    title: 'Agents',
    description: 'Track active agents and recent executions',
    href: (ref: string) => `/project/${ref}/agents`,
  },
  {
    key: 'policies',
    title: 'Policies',
    description: 'Review policy coverage and recent rule changes',
    href: (ref: string) => `/project/${ref}/policies`,
  },
  {
    key: 'cost',
    title: 'Cost',
    description: 'Monitor budget trends and spend anomalies',
    href: (ref: string) => `/project/${ref}/cost`,
  },
  {
    key: 'audit',
    title: 'Audit',
    description: 'Inspect critical activity and security events',
    href: (ref: string) => `/project/${ref}/audit`,
  },
  {
    key: 'templates',
    title: 'Templates',
    description: 'Launch repeatable workflows and policy starter packs',
    href: (ref: string) => `/project/${ref}/templates`,
  },
  {
    key: 'access',
    title: 'Access',
    description: 'Manage roles, break-glass settings, and onboarding access',
    href: (ref: string) => `/project/${ref}/access`,
  },
]

export const Home = () => {
  const { ref } = useParams()
  const { data: project } = useSelectedProjectQuery()
  const { data: coreOverview } = useXelvoCoreOverviewQuery()
  const { data: agentsSummary } = useXelvoAgentsSummaryQuery({ projectRef: ref })
  const { data: policiesSummary } = useXelvoPoliciesSummaryQuery({ projectRef: ref })
  const { data: costSummary } = useXelvoCostSummaryQuery({ projectRef: ref })
  const { data: auditSummary } = useXelvoAuditSummaryQuery({ projectRef: ref })

  const coreConnected = coreOverview?.connected ?? false
  const healthLabel = coreOverview?.health ?? 'unknown'

  const overviewCards = OVERVIEW_CARD_CONFIG.map((card) => {
    if (card.key === 'agents') {
      return {
        ...card,
        metric: `${agentsSummary?.running ?? 0} running / ${agentsSummary?.total ?? 0} total`,
      }
    }

    if (card.key === 'policies') {
      return {
        ...card,
        metric: `${policiesSummary?.enforceMode ?? 0} enforce / ${policiesSummary?.violations ?? 0} violations`,
      }
    }

    if (card.key === 'cost') {
      return {
        ...card,
        metric: `$${(costSummary?.monthlyCost ?? 0).toFixed(2)} month / ${Math.round(
          (costSummary?.budgetUsagePct ?? 0) * 100
        )}% budget`,
      }
    }

    if (card.key === 'audit') {
      return {
        ...card,
        metric: `${auditSummary?.events24h ?? 0} events / ${auditSummary?.criticalEvents ?? 0} critical`,
      }
    }

    return {
      ...card,
      metric: 'Ready',
    }
  })

  return (
    <div className="w-full p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="relative overflow-hidden rounded-2xl border border-default bg-gradient-to-br from-brand-600/20 via-brand-500/10 to-transparent p-6 md:p-8">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-warning-500/10 blur-3xl" />
          <div className="relative space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand">Xelvo Command Surface</p>
            <h1 className="text-3xl md:text-5xl font-semibold">{project?.name ?? 'Project Overview'}</h1>
            <p className="text-foreground-light max-w-3xl text-sm md:text-base">
              Operations-first dashboard for agent governance, policy enforcement, spend controls, and
              cross-tenant audit readiness.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="rounded-full border border-default bg-background px-3 py-1 text-xs uppercase tracking-[0.14em] text-foreground-light">
                Core API: {coreConnected ? 'Connected' : 'Disconnected'}
              </div>
              <div className="rounded-full border border-default bg-background px-3 py-1 text-xs uppercase tracking-[0.14em] text-foreground-light">
                Health: {healthLabel}
              </div>
              <div className="rounded-full border border-default bg-background px-3 py-1 text-xs uppercase tracking-[0.14em] text-foreground-light">
                Identity: {coreOverview?.userEmail ?? 'No API identity'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overviewCards.map((card) => (
            <Link
              key={card.key}
              href={ref ? card.href(ref) : '#'}
              className="group rounded-xl border border-default bg-surface-100/70 p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-surface-200/70"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium">{card.title}</h2>
                <span className="text-xs uppercase tracking-[0.14em] text-foreground-light group-hover:text-brand">
                  Open
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground-light leading-relaxed">{card.description}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-foreground-light">{card.metric}</p>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-default bg-surface-100 p-5">
          <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-foreground-light">
            Quick actions
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link className="text-sm text-brand hover:underline" href={ref ? `/project/${ref}/agents` : '#'}>
              Open agents
            </Link>
            <Link className="text-sm text-brand hover:underline" href={ref ? `/project/${ref}/policies` : '#'}>
              Review policies
            </Link>
            <Link className="text-sm text-brand hover:underline" href={ref ? `/project/${ref}/ops/tenants` : '#'}>
              Operator tenants
            </Link>
            <Link className="text-sm text-brand hover:underline" href={ref ? `/project/${ref}/cost` : '#'}>
              Check cost budget
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
