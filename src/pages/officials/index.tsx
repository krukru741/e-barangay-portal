import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip
} from '@mui/material'
import { useSession } from 'next-auth/react'

export default function OfficialsPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(role)

  const [officials, setOfficials] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [residentId, setResidentId] = useState('')
  const [position, setPosition] = useState('KAGAWAD')
  const [committee, setCommittee] = useState('')
  const [termStart, setTermStart] = useState('')
  const [termEnd, setTermEnd] = useState('')

  useEffect(() => {
    fetchOfficials()
  }, [])

  const fetchOfficials = async () => {
    try {
      const res = await fetch('/api/officials')
      const data = await res.json()
      setOfficials(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/officials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentId,
          position,
          committee,
          termStart: new Date(termStart).toISOString(),
          termEnd: new Date(termEnd).toISOString(),
          isActive: true
        })
      })
      if (res.ok) {
        setOpen(false)
        fetchOfficials()
      } else {
        const err = await res.json()
        alert('Error: ' + JSON.stringify(err.error))
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Barangay Officials</Typography>
        {isAdmin && (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Official
          </Button>
        )}
      </Grid>

      {officials.map((official) => (
        <Grid item xs={12} md={4} key={official.id}>
          <Card>
            <CardHeader
              title={`${official.resident?.firstName} ${official.resident?.lastName}`}
              subheader={official.position}
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Committee: {official.committee || 'N/A'}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Term: {new Date(official.termStart).toLocaleDateString()} - {new Date(official.termEnd).toLocaleDateString()}
              </Typography>
              <Chip 
                label={official.isActive ? 'Active' : 'Inactive'} 
                color={official.isActive ? 'success' : 'default'} 
                size="small" 
              />
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Official</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Resident ID"
            margin="normal"
            value={residentId}
            onChange={(e) => setResidentId(e.target.value)}
            helperText="Enter the Resident ID from the Residents module"
          />
          <TextField
            select
            fullWidth
            label="Position"
            margin="normal"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {['CAPTAIN', 'KAGAWAD', 'SECRETARY', 'TREASURER', 'SK_CHAIR', 'SK_KAGAWAD'].map((pos) => (
              <MenuItem key={pos} value={pos}>{pos}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Committee (Optional)"
            margin="normal"
            value={committee}
            onChange={(e) => setCommittee(e.target.value)}
          />
          <TextField
            type="date"
            fullWidth
            label="Term Start"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={termStart}
            onChange={(e) => setTermStart(e.target.value)}
          />
          <TextField
            type="date"
            fullWidth
            label="Term End"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={termEnd}
            onChange={(e) => setTermEnd(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
