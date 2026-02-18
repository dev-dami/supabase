import { useParams } from 'common'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ProjectLayoutWithAuth } from 'components/layouts/ProjectLayout'
import { useXelvoAuditSummaryQuery } from 'data/xelvo/audit-summary-query'
import type { ReactNode } from 'react'
import type { NextPageWithLayout } from 'types'

const AuditPage: NextPageWithLayout = () => {
  const { ref } = useParams()
  const { data, isLoading, isError, error } = useXelvoAuditSummaryQuery({ projectRef: ref })

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
      <h1 className="text-2xl">Audit Trail</h1>
      <p className="mt-2 text-foreground-light">Inspect actions, incidents, and governance events.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Events (24h)</p>
          <p className="mt-2 text-2xl">{data?.events24h ?? 0}</p>
        </div>
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Critical</p>
          <p className="mt-2 text-2xl">{data?.criticalEvents ?? 0}</p>
        </div>
        <div className="rounded-lg border border-default bg-surface-100 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-light">Last event</p>
          <p className="mt-2 text-sm break-all">{data?.lastEventAt ?? 'No event timestamp'}</p>
        </div>
      </div>
      {isLoading && <p className="mt-4 text-sm text-foreground-light">Loading core audit summary...</p>}
      {isError && (
        <p className="mt-4 text-sm text-warning">
          Core audit endpoint unavailable: {error instanceof Error ? error.message : 'unknown error'}
        </p>
      )}
      <p className="mt-6 text-sm text-foreground-light">Project: {ref}</p>
    </div>
  )
}

AuditPage.getLayout = (page: ReactNode) => (
  <DefaultLayout>
    <ProjectLayoutWithAuth>{page}</ProjectLayoutWithAuth>
  </DefaultLayout>
)

export default AuditPage
