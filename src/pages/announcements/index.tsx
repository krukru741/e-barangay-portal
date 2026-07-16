import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import PinOutline from 'mdi-material-ui/PinOutline'
import PinOffOutline from 'mdi-material-ui/PinOffOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import Link from 'next/link'
import Box from '@mui/material/Box'

const typeColorMap: any = {
  GENERAL: 'primary',
  EMERGENCY: 'error',
  EVENT: 'success',
  ADVISORY: 'warning'
}

const BulletinBoard = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Check if current user is admin/staff
  const isAdmin = session && ['ADMIN', 'STAFF', 'SUPER_ADMIN'].includes((session.user as any)?.role)

  const fetchAnnouncements = () => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const handleTogglePin = async (id: string, currentPin: boolean) => {
    if (!isAdmin) return
    await fetch(`/api/announcements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned: !currentPin })
    })
    fetchAnnouncements()
  }

  const handleDelete = async (id: string) => {
    if (!isAdmin) return
    if (!confirm('Are you sure you want to delete this announcement?')) return
    
    await fetch(`/api/announcements/${id}`, {
      method: 'DELETE'
    })
    fetchAnnouncements()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h5'>Bulletin Board</Typography>
        {isAdmin && (
          <Link href="/announcements/create" passHref>
            <Button variant="contained">Create Announcement</Button>
          </Link>
        )}
      </Grid>

      {loading ? (
        <Grid item xs={12}><Typography>Loading announcements...</Typography></Grid>
      ) : announcements.length === 0 ? (
        <Grid item xs={12}><Typography>No announcements posted yet.</Typography></Grid>
      ) : (
        announcements.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: item.type === 'EMERGENCY' ? '2px solid red' : 'none' }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {item.isPinned && <PinOutline fontSize="small" color="primary" />}
                    <Typography variant="h6" sx={{ fontWeight: item.isPinned ? 'bold' : 'normal' }}>
                      {item.title}
                    </Typography>
                  </Box>
                }
                subheader={new Date(item.publishedAt).toLocaleString()}
                action={<Chip label={item.type} color={typeColorMap[item.type] || 'default'} size="small" />}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {item.body}
                </Typography>
              </CardContent>
              {isAdmin && (
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton onClick={() => handleTogglePin(item.id, item.isPinned)} color="primary" title={item.isPinned ? 'Unpin' : 'Pin to Top'}>
                    {item.isPinned ? <PinOffOutline /> : <PinOutline />}
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)} color="error" title="Delete">
                    <DeleteOutline />
                  </IconButton>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  )
}

export default BulletinBoard
