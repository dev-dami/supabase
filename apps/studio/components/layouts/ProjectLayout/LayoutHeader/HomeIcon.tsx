import Link from 'next/link'

import { LOCAL_STORAGE_KEYS } from 'common'
import { useOrganizationsQuery } from 'data/organizations/organizations-query'
import { useLocalStorageQuery } from 'hooks/misc/useLocalStorage'
import { useSelectedOrganizationQuery } from 'hooks/misc/useSelectedOrganization'
import { IS_PLATFORM } from 'lib/constants'
import { useIsFeatureEnabled } from 'hooks/misc/useIsFeatureEnabled'

export const HomeIcon = () => {
  const { data: selectedOrganization } = useSelectedOrganizationQuery()
  const { data: organizations } = useOrganizationsQuery()

  const largeLogo = useIsFeatureEnabled('branding:large_logo')

  const [lastVisitedOrganization] = useLocalStorageQuery(
    LOCAL_STORAGE_KEYS.LAST_VISITED_ORGANIZATION,
    ''
  )

  const getDefaultOrgRedirect = () => {
    if (lastVisitedOrganization) return `/org/${lastVisitedOrganization}`
    if (selectedOrganization?.slug) return `/org/${selectedOrganization.slug}`
    if (organizations && organizations.length > 0) return `/org/${organizations[0].slug}`
    return '/organizations'
  }

  const href = IS_PLATFORM ? getDefaultOrgRedirect() : '/project/default'

  return (
    <Link
      href={href}
      className="items-center justify-center flex-shrink-0 hidden md:flex rounded-md border border-default bg-background px-2.5 py-1"
    >
      <span className={largeLogo ? 'text-xs tracking-[0.22em] font-semibold' : 'text-[10px] tracking-[0.2em] font-semibold'}>
        XELVO
      </span>
    </Link>
  )
}
