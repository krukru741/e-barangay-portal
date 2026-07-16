import { useState } from 'react'
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

const CreateAnnouncementPage = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'GENERAL',
    isPinned: false,
    expiresAt: ''
  })

  const handleChange = (e: any) => {
    const { name, value, checked, type } = e.target
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expiresAt: formData.expiresAt || null
        })
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to create announcement')
      }
      router.push('/announcements')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title='Create Announcement' subheader="Publish news, events, or emergencies to the bulletin board." />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {error && (
                  <Grid item xs={12}>
                    <Typography color="error">{error}</Typography>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <TextField fullWidth label='Title / Headline' name="title" value={formData.title} onChange={handleChange} required />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Announcement Type</InputLabel>
                    <Select label='Announcement Type' name="type" value={formData.type} onChange={handleChange} required>
                      <MenuItem value="GENERAL">General Info</MenuItem>
                      <MenuItem value="ADVISORY">Advisory / Memo</MenuItem>
                      <MenuItem value="EVENT">Barangay Event</MenuItem>
                      <MenuItem value="EMERGENCY" sx={{ color: 'error.main', fontWeight: 'bold' }}>EMERGENCY ALERT</MenuItem>
                    </Select>
                  </FormControl>
                  {formData.type === 'EMERGENCY' && (
                    <Typography variant="caption" color="error">
                      Warning: Emergency alerts will trigger SMS and Email broadcasts immediately upon saving!
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    type="date" 
                    label="Expiration Date (Optional)" 
                    name="expiresAt" 
                    value={formData.expiresAt} 
                    onChange={handleChange} 
                    InputLabelProps={{ shrink: true }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={6} 
                    label='Message Body' 
                    name="body" 
                    value={formData.body} 
                    onChange={handleChange} 
                    placeholder="Write the full announcement details here..." 
                    required 
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox name="isPinned" checked={formData.isPinned} onChange={handleChange} />}
                    label="Pin this announcement to the top of the bulletin board"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button type='submit' variant='contained' size='large'>
                    Publish Announcement
                  </Button>
                  <Button variant='outlined' size='large' sx={{ ml: 2 }} onClick={() => router.push('/announcements')}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CreateAnnouncementPage
