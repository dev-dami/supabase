import { useParams } from 'common'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ProjectLayoutWithAuth } from 'components/layouts/ProjectLayout'
import { useXelvoCostSummaryQuery } from 'data/xelvo/cost-summary-query'
import type { ReactNode } from 'react'
import type { NextPageWithLayout } from 'types'

const CostPage: NextPageWithLayout = () => {
  const { ref } = useParams()
  const { data, isLoading, isError, error } = useXelvoCostSummaryQuery({ projectRef: ref })

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
      <h1 className="text-2xl">Cost and Usage</h1>
      <p className="mt-2 text-foreground-light">Track spend, usage trends, and budget signals.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Daily cost</p>
          <p className="mt-2 text-2xl">${(data?.dailyCost ?? 0).toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Monthly cost</p>
          <p className="mt-2 text-2xl">${(data?.monthlyCost ?? 0).toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Budget usage</p>
          <p className="mt-2 text-2xl">{Math.round((data?.budgetUsagePct ?? 0) * 100)}%</p>
        </div>
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Active alerts</p>
          <p className="mt-2 text-2xl">{data?.alerts ?? 0}</p>
        </div>
      </div>
      {isLoading && <p className="mt-4 text-sm text-foreground-light">Loading core cost summary...</p>}
      {isError && (
        <p className="mt-4 text-sm text-warning">
          Core cost endpoint unavailable: {error instanceof Error ? error.message : 'unknown error'}
        </p>
      )}
      <p className="mt-6 text-sm text-foreground-light">Project: {ref}</p>
    </div>
  )
}

CostPage.getLayout = (page: ReactNode) => (
  <DefaultLayout>
    <ProjectLayoutWithAuth>{page}</ProjectLayoutWithAuth>
  </DefaultLayout>
)

export default CostPage
