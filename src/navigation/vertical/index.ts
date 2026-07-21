// ** Icon imports
import Login from 'mdi-material-ui/Login'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline'
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline'
import ClipboardCheckOutline from 'mdi-material-ui/ClipboardCheckOutline'
import LockOutline from 'mdi-material-ui/LockOutline'
import BullhornOutline from 'mdi-material-ui/BullhornOutline'
import ChartPie from 'mdi-material-ui/ChartPie'
import Finance from 'mdi-material-ui/Finance'
import ScaleBalance from 'mdi-material-ui/ScaleBalance'
import AccountTieOutline from 'mdi-material-ui/AccountTieOutline'
import ShieldAccountOutline from 'mdi-material-ui/ShieldAccountOutline'
import History from 'mdi-material-ui/History'
import CogOutline from 'mdi-material-ui/CogOutline'
import FileCodeOutline from 'mdi-material-ui/FileCodeOutline'
import DatabaseExportOutline from 'mdi-material-ui/DatabaseExportOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

// Role-based access matrix from implementation_plan.md
// SUPER_ADMIN: everything
// ADMIN: Manage Users, Manage Residents, Issue Docs, Manage Blotters, View Reports, Manage Announcements
// STAFF: Manage Residents, Issue Docs, Manage Blotters, View Reports, Manage Announcements
// OFFICIAL: View Reports, View Announcements, File Blotter, View Own Docs
// RESIDENT: View Announcements, File Blotter, View Own Docs

const navigation = (role: string = 'RESIDENT'): VerticalNavItemsType => {
  const isSuperAdmin = role === 'SUPER_ADMIN'
  const isAdmin = role === 'ADMIN' || isSuperAdmin
  const isStaff = role === 'STAFF' || isAdmin
  const isOfficial = role === 'OFFICIAL' || isStaff

  const items: VerticalNavItemsType = [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Announcements',
      icon: BullhornOutline,
      path: '/announcements'
    },
    {
      title: 'Transparency Board',
      icon: ScaleBalance,
      path: '/transparency'
    },
    {
      title: 'Barangay Officials',
      icon: AccountTieOutline,
      path: '/officials'
    },
  ]

  // Residents and Officials (Personal actions)
  if (!isStaff) {
    items.push(
      {
        title: 'My Documents',
        icon: FileDocumentOutline,
        path: '/my-documents'
      },
      {
        title: 'File a Blotter',
        icon: LockOutline,
        path: '/file-blotter'
      }
    )
  }

  // Analytics & Reports (Official and up)
  if (isOfficial) {
    items.push({
      title: 'Analytics & Reports',
      icon: ChartPie,
      path: '/analytics'
    })
  }

  // Core Management (Staff and up)
  if (isStaff) {
    items.push(
      { sectionTitle: 'Management' } as any,
      {
        title: 'Residents',
        icon: AccountGroupOutline,
        path: '/residents'
      },
      {
        title: 'Document Requests',
        icon: FileDocumentOutline,
        path: '/documents'
      },
      {
        title: 'Release Log',
        icon: ClipboardCheckOutline,
        path: '/documents/release-log'
      },
      {
        title: 'Blotter Records',
        icon: LockOutline,
        path: '/blotter'
      }
    )
  }

  // Finance Management (Admin and up - Phase 2 optional but included for Admin)
  if (isAdmin) {
    items.push({
      title: 'Finance Mgmt',
      icon: Finance,
      path: '/finance'
    })
  }

  // Admin Settings section
  if (isAdmin || isSuperAdmin) {
    items.push({ sectionTitle: 'System Admin' } as any)
  }

  // Manage Users (Admin and SuperAdmin)
  if (isAdmin) {
    items.push({
      title: 'User Roles',
      icon: ShieldAccountOutline,
      path: '/admin/users'
    })
  }

  // System Settings (Super Admin ONLY)
  if (isSuperAdmin) {
    items.push(
      {
        title: 'System Settings',
        icon: CogOutline,
        path: '/admin/settings'
      },
      {
        title: 'Doc Templates',
        icon: FileCodeOutline,
        path: '/admin/templates'
      },
      {
        title: 'Audit Logs',
        icon: History,
        path: '/admin/audit-logs'
      },
      {
        title: 'Backup & Restore',
        icon: DatabaseExportOutline,
        path: '/admin/backup'
      }
    )
  }

  // Account Settings — all roles
  items.push(
    { sectionTitle: 'Personal' } as any,
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings'
    }
  )

  return items
}

export default navigation
