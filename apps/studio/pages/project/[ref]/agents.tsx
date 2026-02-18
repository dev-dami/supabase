import { useParams } from 'common'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ProjectLayoutWithAuth } from 'components/layouts/ProjectLayout'
import { useXelvoAgentsSummaryQuery } from 'data/xelvo/agents-query'
import type { ReactNode } from 'react'
import type { NextPageWithLayout } from 'types'

const AgentsPage: NextPageWithLayout = () => {
  const { ref } = useParams()
  const { data, isLoading, isError, error } = useXelvoAgentsSummaryQuery({ projectRef: ref })

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
      <h1 className="text-2xl">Agents</h1>
      <p className="mt-2 text-foreground-light">Manage deployed agents and execution health.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Total</p>
          <p className="mt-2 text-2xl">{data?.total ?? 0}</p>
        </div>
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Running</p>
          <p className="mt-2 text-2xl">{data?.running ?? 0}</p>
        </div>
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Unhealthy</p>
          <p className="mt-2 text-2xl">{data?.unhealthy ?? 0}</p>
        </div>
      </div>
      {isLoading && <p className="mt-4 text-sm text-foreground-light">Loading core agent summary...</p>}
      {isError && (
        <p className="mt-4 text-sm text-warning">
          Core agents endpoint unavailable: {error instanceof Error ? error.message : 'unknown error'}
        </p>
      )}
      <p className="mt-6 text-sm text-foreground-light">Project: {ref}</p>
    </div>
  )
}

AgentsPage.getLayout = (page: ReactNode) => (
  <DefaultLayout>
    <ProjectLayoutWithAuth>{page}</ProjectLayoutWithAuth>
  </DefaultLayout>
)

export default AgentsPage
