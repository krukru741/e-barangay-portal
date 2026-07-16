import { useState, useEffect } from 'react'
import Link from 'next/link'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Magnify from 'mdi-material-ui/Magnify'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Grid from '@mui/material/Grid'

export default function ResidentsPage() {
  const [residents, setResidents] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date') // 'alphabetical', 'date', 'sitio'

  const applySortAndFilter = (data: any[], query: string, sort: string) => {
    let result = data.filter((r: any) => 
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(query.toLowerCase())
    )

    if (sort === 'alphabetical') {
      result.sort((a, b) => a.firstName.localeCompare(b.firstName))
    } else if (sort === 'date') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sort === 'sitio') {
      result.sort((a, b) => (a.household?.sitio || '').localeCompare(b.household?.sitio || ''))
    }

    setFiltered(result)
  }

  useEffect(() => {
    fetch('/api/residents')
      .then(res => res.json())
      .then(data => {
        setResidents(data)
        applySortAndFilter(data, search, sortBy)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Typography variant='h5'>
          Resident Registry
        </Typography>
        <Link href='/residents/create' passHref>
          <Button variant='contained'>Add New Resident</Button>
        </Link>
      </Box>

      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={8} md={9}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by resident name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                applySortAndFilter(residents, e.target.value, sortBy)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Magnify />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => {
                  setSortBy(e.target.value)
                  applySortAndFilter(residents, search, e.target.value)
                }}
              >
                <MenuItem value="date">Date Registered (Newest)</MenuItem>
                <MenuItem value="alphabetical">Alphabetical (A-Z)</MenuItem>
                <MenuItem value="sitio">Sitio (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>ID Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Sitio</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>Loading residents...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>No residents found.</TableCell>
                </TableRow>
              ) : (
                filtered.map((resident: any) => (
                  <TableRow
                    key={resident.id}
                    sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {resident.id.substring(resident.id.length - 8).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {resident.firstName} {resident.lastName}
                    </TableCell>
                    <TableCell>{resident.gender}</TableCell>
                    <TableCell>{resident.civilStatus}</TableCell>
                    <TableCell>
                      {resident.isSenior && <Chip size="small" label="Senior" sx={{ mr: 1 }} color="primary" />}
                      {resident.isPWD && <Chip size="small" label="PWD" sx={{ mr: 1 }} color="secondary" />}
                      {resident.isIndigent && <Chip size="small" label="Indigent" sx={{ mr: 1 }} color="error" />}
                      {resident.isVoter && <Chip size="small" label="Voter" color="success" />}
                    </TableCell>
                    <TableCell>
                      {resident.household?.sitio ? resident.household.sitio : <Typography variant="caption" color="textSecondary">N/A</Typography>}
                    </TableCell>
                    <TableCell align='right'>
                      <Link href={`/residents/${resident.id}`} passHref>
                        <Button variant="outlined" size="small">View Profile</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}
