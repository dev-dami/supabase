import type { Route } from 'components/ui/ui.types'
import type { Project } from 'data/projects/project-detail-query'
import { IS_PLATFORM } from 'lib/constants'
import {
  Activity,
  BadgeDollarSign,
  FileCode2,
  FileLock2,
  Files,
  GanttChartSquare,
  House,
  LayoutTemplate,
  Shield,
  Users,
} from 'lucide-react'

const ICON_SIZE = 16

export const generateToolRoutes = (_ref?: string, _project?: Project, _features?: {}): Route[] => {
  return [
    {
      key: 'home',
      label: 'Home',
      icon: <House size={ICON_SIZE} />,
      link: _ref && `/project/${_ref}`,
    },
    {
      key: 'agents',
      label: 'Agents',
      icon: <Users size={ICON_SIZE} />,
      link: _ref && `/project/${_ref}/agents`,
    },
    {
      key: 'policies',
      label: 'Policies',
      icon: <Shield size={ICON_SIZE} />,
      link: _ref && `/project/${_ref}/policies`,
    },
  ]
}

export const generateProductRoutes = (
  _ref?: string,
  _project?: Project,
  _features?: {
    auth?: boolean
    edgeFunctions?: boolean
    storage?: boolean
    realtime?: boolean
    authOverviewPage?: boolean
  }
): Route[] => {
  return [
    {
      key: 'cost',
      label: 'Cost',
      icon: <BadgeDollarSign size={ICON_SIZE} />,
      link: _ref && `/project/${_ref}/cost`,
    },
    {
      key: 'audit',
      label: 'Audit',
      icon: <Activity size={ICON_SIZE} />,
      link: _ref && `/project/${_ref}/audit`,
    },
    {
      key: 'templates',
      label: 'Templates',
      icon: <LayoutTemplate size={ICON_SIZE} />,
      link: _ref && `/project/${_ref}/templates`,
    },
  ]
}

export const generateOtherRoutes = (
  _ref?: string,
  _project?: Project,
  _features?: { unifiedLogs?: boolean; showReports?: boolean; apiDocsSidePanel?: boolean }
): Route[] => {
  const routes: Route[] = [
    {
      key: 'access',
      label: 'Access',
      icon: <FileLock2 size={ICON_SIZE} />,
      link: _ref && `/project/${_ref}/access`,
    },
    {
      key: 'billing',
      label: 'Billing',
      icon: <FileCode2 size={ICON_SIZE} />,
      link: _ref && `/project/${_ref}/billing`,
    },
  ]

  if (IS_PLATFORM) {
    routes.push(
      {
        key: 'ops-tenants',
        label: 'Tenants',
        icon: <Users size={ICON_SIZE} />,
        link: _ref && `/project/${_ref}/ops/tenants`,
      },
      {
        key: 'ops-fleet',
        label: 'Fleet',
        icon: <GanttChartSquare size={ICON_SIZE} />,
        link: _ref && `/project/${_ref}/ops/fleet`,
      },
      {
        key: 'ops-provisioning',
        label: 'Provisioning',
        icon: <FileCode2 size={ICON_SIZE} />,
        link: _ref && `/project/${_ref}/ops/provisioning`,
      },
      {
        key: 'ops-audit',
        label: 'Cross-Tenant Audit',
        icon: <Files size={ICON_SIZE} />,
        link: _ref && `/project/${_ref}/ops/audit`,
      }
    )
  }

  return routes
}

export const generateSettingsRoutes = (_ref?: string, _project?: Project): Route[] => {
  return []
}
