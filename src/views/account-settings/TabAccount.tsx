import { useState, useEffect, ElementType, ChangeEvent } from 'react'
import { useSession } from 'next-auth/react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'
import AccountCircleOutline from 'mdi-material-ui/AccountCircleOutline'

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const roleColorMap: any = {
  SUPER_ADMIN: 'error',
  ADMIN: 'warning',
  STAFF: 'info',
  OFFICIAL: 'primary',
  RESIDENT: 'default'
}

const TabAccount = () => {
  const { data: session, update: updateSession } = useSession()
  const [profile, setProfile] = useState({ name: '', email: '', image: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const userRole = (session?.user as any)?.role || 'RESIDENT'

  useEffect(() => {
    if (session) {
      fetch('/api/user/profile')
        .then(r => r.json())
        .then(data => {
          setProfile({
            name: data.name || '',
            email: data.email || '',
            image: data.image || ''
          })
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [session])

  const handleSave = async () => {
    setSaving(true)
    setSuccess('')
    setError('')
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess('Profile updated successfully!')
        // Update the session so the name shows in the navbar
        await updateSession({ name: data.name, email: data.email, image: data.image })
        setTimeout(() => setSuccess(''), 4000)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setSaving(false)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setProfile(p => ({ ...p, image: reader.result as string }))
      reader.readAsDataURL(file)
    }
  }

  if (loading) return (
    <CardContent sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
      <CircularProgress />
    </CardContent>
  )

  return (
    <CardContent>
      <Grid container spacing={6}>
        {/* Avatar section */}
        <Grid item xs={12} sx={{ mt: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Avatar
              src={profile.image}
              sx={{ width: 100, height: 100, border: '3px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              <AccountCircleOutline sx={{ fontSize: 60 }} />
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>{profile.name || 'My Account'}</Typography>
                <Chip label={userRole} color={roleColorMap[userRole]} size='small' sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
              </Box>
              <Typography variant='body2' color='textSecondary' sx={{ mb: 2 }}>{profile.email}</Typography>
              <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image' size='small'>
                Upload New Photo
                <input hidden type='file' onChange={handleImageChange} accept='image/png, image/jpeg' id='account-settings-upload-image' />
              </ButtonStyled>
              <Button size='small' color='secondary' variant='outlined' sx={{ ml: 2 }} onClick={() => setProfile(p => ({ ...p, image: '' }))}>
                Reset
              </Button>
              <Typography variant='caption' display='block' sx={{ mt: 1, color: 'text.secondary' }}>
                Allowed: PNG or JPEG. Max 2MB.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {success && (
          <Grid item xs={12}>
            <Alert severity='success'>{success}</Alert>
          </Grid>
        )}
        {error && (
          <Grid item xs={12}>
            <Alert severity='error'>{error}</Alert>
          </Grid>
        )}

        {/* Form Fields */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label='Full Name'
            value={profile.name}
            onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            placeholder='e.g. Juan dela Cruz'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type='email'
            label='Email Address'
            value={profile.email}
            onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
            placeholder='e.g. juan@gmail.com'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Role'
            value={userRole}
            disabled
            helperText='Role is managed by your administrator'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Profile Photo URL'
            value={profile.image}
            onChange={e => setProfile(p => ({ ...p, image: e.target.value }))}
            placeholder='https://... (optional)'
            helperText='Or use the Upload button above'
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant='contained'
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color='inherit' /> : undefined}
            sx={{ mr: 3, boxShadow: '0 4px 12px 0 rgba(102,108,255,0.4)' }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => {
              setError('')
              setSuccess('')
              if (session?.user) {
                setProfile({
                  name: (session.user as any).name || '',
                  email: (session.user as any).email || '',
                  image: (session.user as any).image || ''
                })
              }
            }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TabAccount
