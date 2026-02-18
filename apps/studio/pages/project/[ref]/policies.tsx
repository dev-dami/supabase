import { useParams } from 'common'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ProjectLayoutWithAuth } from 'components/layouts/ProjectLayout'
import { useXelvoPoliciesSummaryQuery } from 'data/xelvo/policies-query'
import type { ReactNode } from 'react'
import type { NextPageWithLayout } from 'types'

const PoliciesPage: NextPageWithLayout = () => {
  const { ref } = useParams()
  const { data, isLoading, isError, error } = useXelvoPoliciesSummaryQuery({ projectRef: ref })

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
      <h1 className="text-2xl">Policies</h1>
      <p className="mt-2 text-foreground-light">Define and review policy controls for agent behavior.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Total policies</p>
          <p className="mt-2 text-2xl">{data?.total ?? 0}</p>
        </div>
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Enforce mode</p>
          <p className="mt-2 text-2xl">{data?.enforceMode ?? 0}</p>
        </div>
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Violations</p>
          <p className="mt-2 text-2xl">{data?.violations ?? 0}</p>
        </div>
      </div>
      {isLoading && <p className="mt-4 text-sm text-foreground-light">Loading core policy summary...</p>}
      {isError && (
        <p className="mt-4 text-sm text-warning">
          Core policy endpoint unavailable: {error instanceof Error ? error.message : 'unknown error'}
        </p>
      )}
      <p className="mt-6 text-sm text-foreground-light">Project: {ref}</p>
    </div>
  )
}

PoliciesPage.getLayout = (page: ReactNode) => (
  <DefaultLayout>
    <ProjectLayoutWithAuth>{page}</ProjectLayoutWithAuth>
  </DefaultLayout>
)

export default PoliciesPage
