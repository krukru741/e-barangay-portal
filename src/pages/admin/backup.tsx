import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import DatabaseExportOutline from 'mdi-material-ui/DatabaseExportOutline'
import ShieldCheckOutline from 'mdi-material-ui/ShieldCheckOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import CheckboxMarkedOutline from 'mdi-material-ui/CheckboxMarkedOutline'
import CheckboxBlankOutline from 'mdi-material-ui/CheckboxBlankOutline'

const BackupPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [downloading, setDownloading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'residents', 'documents', 'blotters', 'officials', 'announcements', 'finance'
  ])

  const role = (session?.user as any)?.role
  const isAdmin = session && ['ADMIN', 'SUPER_ADMIN'].includes(role)

  const handleBackup = async () => {
    if (selectedModules.length === 0) {
      alert('Please select at least one module to backup.')
      return
    }

    setDownloading(true)
    setSuccess(false)
    try {
      const res = await fetch(`/api/admin/backup?include=${selectedModules.join(',')}`)
      if (!res.ok) throw new Error('Failed to generate backup')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ebarangay-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error(err)
      alert('Backup failed. Please try again.')
    }
    setDownloading(false)
  }

  if (!isAdmin) {
    return <Typography color='error'>Access Denied. Admin only.</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5' sx={{ fontWeight: 700 }}>Backup & Data Management</Typography>
        <Typography variant='body2' color='textSecondary'>
          Download a full backup of your barangay data to keep it safe
        </Typography>
      </Grid>

      {success && (
        <Grid item xs={12}>
          <Alert severity='success'>
            Backup downloaded successfully! Ipreserba kini sa usa ka luwas nga lugar (e.g., USB drive, Google Drive).
          </Alert>
        </Grid>
      )}

      {/* Backup Card */}
      <Grid item xs={12} md={8}>
        <Card sx={{
          boxShadow: '0 4px 18px 0 rgba(0,0,0,0.05)',
          background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <DatabaseExportOutline sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant='h6' sx={{ color: 'white', fontWeight: 700 }}>Full Database Backup</Typography>
                <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Export all barangay data as a JSON file
                </Typography>
              </Box>
            </Box>
            <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.85)', mb: 3 }}>
              Ang backup file naglangkob sa tanang datos — mga Residente, Dokumento, Blotter, Opisyal, Announcements, Budget, ug Gastos. 
              Gamiton kini kung adunay problema sa sistema o kinahanglan na ang data migration.
            </Typography>
            <Button
              variant='contained'
              size='large'
              startIcon={downloading ? <CircularProgress size={20} color='inherit' /> : <DatabaseExportOutline />}
              onClick={handleBackup}
              disabled={downloading}
              sx={{
                backgroundColor: 'white',
                color: '#1565c0',
                fontWeight: 700,
                '&:hover': { backgroundColor: '#f5f5f5' },
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              {downloading ? 'Generating Backup...' : 'Download Full Backup (JSON)'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Info Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ boxShadow: '0 4px 18px 0 rgba(0,0,0,0.05)', height: '100%' }}>
          <CardHeader
            title='Backup Guidelines'
            avatar={<ShieldCheckOutline sx={{ color: 'success.main', fontSize: 28 }} />}
            titleTypographyProps={{ sx: { fontWeight: 600 } }}
          />
          <CardContent>
            <Box component='ul' sx={{ pl: 2, m: 0 }}>
              {[
                'I-backup ang datos matag buwan o human sa dagkong evento',
                'Isave ang backup file sa Google Drive o USB para sa dugang kaluwasan',
                'Dili ipakita ang backup file sa mga tawo nga walay permiso',
                'Gamiton ang backup para sa data migration ngadto sa bag-ong server',
              ].map((tip, i) => (
                <Box component='li' key={i} sx={{ mb: 1.5 }}>
                  <Typography variant='body2' color='textSecondary'>{tip}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* What's included */}
      <Grid item xs={12}>
        <Card sx={{ boxShadow: '0 4px 18px 0 rgba(0,0,0,0.05)' }}>
          <CardHeader
            title='What is included in the backup?'
            avatar={<InformationOutline sx={{ color: 'info.main', fontSize: 28 }} />}
            titleTypographyProps={{ sx: { fontWeight: 600 } }}
          />
          <CardContent>
            <Grid container spacing={2}>
              {[
                { id: 'residents', label: 'Residents', desc: 'All registered residents and household info' },
                { id: 'documents', label: 'Documents', desc: 'All document requests and their status' },
                { id: 'blotters', label: 'Blotter Cases', desc: 'All blotter entries and hearing schedules' },
                { id: 'officials', label: 'Officials', desc: 'All registered barangay officials' },
                { id: 'announcements', label: 'Announcements', desc: 'All posted announcements and bulletins' },
                { id: 'finance', label: 'Finance', desc: 'Budget records and expenditure logs' },
              ].map(item => {
                const isSelected = selectedModules.includes(item.id)
                return (
                  <Grid item xs={12} md={4} key={item.id}>
                    <Box 
                      onClick={() => {
                        if (isSelected) {
                          setSelectedModules(selectedModules.filter(m => m !== item.id))
                        } else {
                          setSelectedModules([...selectedModules, item.id])
                        }
                      }}
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        backgroundColor: isSelected ? '#f5f7fa' : '#ffffff', 
                        border: '1px solid',
                        borderColor: isSelected ? '#e0e0e0' : '#eeeeee',
                        opacity: isSelected ? 1 : 0.6,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                          borderColor: '#90caf9',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                          opacity: 1
                        }
                      }}
                    >
                      {isSelected 
                        ? <CheckboxMarkedOutline sx={{ color: 'success.main', mt: 0.2 }} /> 
                        : <CheckboxBlankOutline sx={{ color: 'action.disabled', mt: 0.2 }} />}
                      <Box>
                        <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>{item.label}</Typography>
                        <Typography variant='body2' color='textSecondary'>{item.desc}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default BackupPage
