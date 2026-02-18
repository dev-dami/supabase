import { useParams } from 'common'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ProjectLayoutWithAuth } from 'components/layouts/ProjectLayout'
import type { ReactNode } from 'react'
import type { NextPageWithLayout } from 'types'

const AccessPage: NextPageWithLayout = () => {
  const { ref } = useParams()
  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
      <h1 className="text-2xl">Access and Roles</h1>
      <p className="mt-2 text-foreground-light">Configure user access, role mappings, and admin controls.</p>
      <p className="mt-6 text-sm text-foreground-light">Project: {ref}</p>
    </div>
  )
}

AccessPage.getLayout = (page: ReactNode) => (
  <DefaultLayout>
    <ProjectLayoutWithAuth>{page}</ProjectLayoutWithAuth>
  </DefaultLayout>
)

export default AccessPage
