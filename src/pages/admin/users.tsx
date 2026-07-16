import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function UsersPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const router = useRouter()

  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    if (session && !['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      router.replace('/')
    } else if (session) {
      fetchUsers()
    }
  }, [session, role, router])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, newRole })
      })
      if (res.ok) {
        fetchUsers() // refresh list
      } else {
        const err = await res.json()
        alert('Error: ' + err.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'error'
      case 'ADMIN': return 'warning'
      case 'STAFF': return 'info'
      case 'OFFICIAL': return 'primary'
      default: return 'default'
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="User Role Management" titleTypographyProps={{ variant: 'h6' }} />
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Current Role</TableCell>
                    <TableCell>Change Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={user.role} color={getRoleColor(user.role) as any} size="small" />
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={user.id === (session?.user as any)?.id} // Can't change own role
                        >
                          <MenuItem value="RESIDENT">RESIDENT</MenuItem>
                          <MenuItem value="OFFICIAL">OFFICIAL</MenuItem>
                          <MenuItem value="STAFF">STAFF</MenuItem>
                          {role === 'SUPER_ADMIN' && <MenuItem value="ADMIN">ADMIN</MenuItem>}
                          {role === 'SUPER_ADMIN' && <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
