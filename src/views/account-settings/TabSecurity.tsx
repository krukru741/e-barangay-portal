import { ChangeEvent, MouseEvent, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import ShieldKeyOutline from 'mdi-material-ui/ShieldKeyOutline'

interface State {
  newPassword: string
  currentPassword: string
  showNewPassword: boolean
  confirmNewPassword: string
  showCurrentPassword: boolean
  showConfirmNewPassword: boolean
}

const TabSecurity = () => {
  const [values, setValues] = useState<State>({
    newPassword: '',
    currentPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShow = (prop: keyof State) => () => {
    setValues({ ...values, [prop]: !values[prop] })
  }
  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault()

  const handleSave = async () => {
    setError('')
    setSuccess('')

    if (!values.currentPassword || !values.newPassword || !values.confirmNewPassword) {
      return setError('Please fill in all password fields.')
    }
    if (values.newPassword.length < 6) {
      return setError('New password must be at least 6 characters.')
    }
    if (values.newPassword !== values.confirmNewPassword) {
      return setError('New password and confirm password do not match.')
    }

    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        })
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess('Password changed successfully!')
        setValues({ newPassword: '', currentPassword: '', showNewPassword: false, confirmNewPassword: '', showCurrentPassword: false, showConfirmNewPassword: false })
        setTimeout(() => setSuccess(''), 5000)
      } else {
        setError(data.error || 'Failed to change password.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSaving(false)
  }

  const eyeIcon = (show: boolean) => show ? <EyeOutline /> : <EyeOffOutline />

  return (
    <form onSubmit={e => e.preventDefault()}>
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, mt: 2 }}>
          <ShieldKeyOutline sx={{ fontSize: 28, color: 'primary.main' }} />
          <Typography variant='h6' sx={{ fontWeight: 600 }}>Change Password</Typography>
        </Box>

        {success && <Alert severity='success' sx={{ mb: 3 }}>{success}</Alert>}
        {error && <Alert severity='error' sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={5} sx={{ maxWidth: 500 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor='current-password'>Current Password</InputLabel>
              <OutlinedInput
                id='current-password'
                label='Current Password'
                value={values.currentPassword}
                type={values.showCurrentPassword ? 'text' : 'password'}
                onChange={handleChange('currentPassword')}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShow('showCurrentPassword')} onMouseDown={handleMouseDown}>
                      {eyeIcon(values.showCurrentPassword)}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor='new-password'>New Password</InputLabel>
              <OutlinedInput
                id='new-password'
                label='New Password'
                value={values.newPassword}
                type={values.showNewPassword ? 'text' : 'password'}
                onChange={handleChange('newPassword')}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShow('showNewPassword')} onMouseDown={handleMouseDown}>
                      {eyeIcon(values.showNewPassword)}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor='confirm-password'>Confirm New Password</InputLabel>
              <OutlinedInput
                id='confirm-password'
                label='Confirm New Password'
                value={values.confirmNewPassword}
                type={values.showConfirmNewPassword ? 'text' : 'password'}
                onChange={handleChange('confirmNewPassword')}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShow('showConfirmNewPassword')} onMouseDown={handleMouseDown}>
                      {eyeIcon(values.showConfirmNewPassword)}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ mt: 6, mb: 0 }} />

      <CardContent>
        <Box sx={{ mt: 2 }}>
          <Button
            variant='contained'
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color='inherit' /> : undefined}
            sx={{ mr: 3, boxShadow: '0 4px 12px 0 rgba(102,108,255,0.4)' }}
          >
            {saving ? 'Saving...' : 'Change Password'}
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => {
              setValues({ newPassword: '', currentPassword: '', showNewPassword: false, confirmNewPassword: '', showCurrentPassword: false, showConfirmNewPassword: false })
              setError('')
              setSuccess('')
            }}
          >
            Reset
          </Button>
        </Box>
      </CardContent>
    </form>
  )
}

export default TabSecurity
