import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import BankOutline from 'mdi-material-ui/BankOutline'
import TrendingDown from 'mdi-material-ui/TrendingDown'
import WalletOutline from 'mdi-material-ui/WalletOutline'


const ReactApexcharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const formatPHP = (amount: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

const TransparencyBoard = () => {
  const [data, setData] = useState<{ budgets: any[], expenditures: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/finance/budget').then(async r => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || 'Failed to fetch budgets');
        return json;
      }),
      fetch('/api/finance/expenditures').then(async r => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || 'Failed to fetch expenditures');
        return json;
      })
    ]).then(([budgets, expenditures]) => {
      setData({ 
        budgets: Array.isArray(budgets) ? budgets : [], 
        expenditures: Array.isArray(expenditures) ? expenditures : [] 
      })
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setError(err.message)
      setLoading(false)
    })
  }, [])

  if (loading) return <Typography>Loading transparency records...</Typography>
  if (error) return <Typography color="error">Error: {error}. Please ensure the database schema is updated (Run `npx prisma db push`).</Typography>
  if (!data) return <Typography>No data available</Typography>

  const totalBudget = data.budgets.reduce((sum, b) => sum + b.totalAmount, 0)
  const totalExpense = data.expenditures.reduce((sum, e) => sum + e.amount, 0)
  const remaining = totalBudget - totalExpense

  // Group expenditures by category for Pie Chart
  const categoryTotals: Record<string, number> = {}
  data.expenditures.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
  })
  
  const chartSeries = Object.values(categoryTotals)
  const chartLabels = Object.keys(categoryTotals)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4' gutterBottom>Full Disclosure Policy Board</Typography>
        <Typography variant='body1' color="textSecondary">
          Kini nga dashboard nagpakita sa mga pundo ug mga nagasto sa atong Barangay aron pagsiguro nga limpyo ug klaro ang atong pagdumala.
        </Typography>
      </Grid>

      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
          color: 'white',
          boxShadow: '0 4px 20px 0 rgba(30, 136, 229, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant='subtitle2' sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  Total Budget
                </Typography>
                <Typography variant='h4' sx={{ color: 'white', fontWeight: 700 }}>
                  {formatPHP(totalBudget)}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <BankOutline sx={{ fontSize: 32, color: 'white' }} />
              </Box>
            </Box>
          </CardContent>
          {/* Decorative Circle */}
          <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)',
          color: 'white',
          boxShadow: '0 4px 20px 0 rgba(229, 57, 53, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant='subtitle2' sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  Total Expenditures
                </Typography>
                <Typography variant='h4' sx={{ color: 'white', fontWeight: 700 }}>
                  {formatPHP(totalExpense)}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <TrendingDown sx={{ fontSize: 32, color: 'white' }} />
              </Box>
            </Box>
          </CardContent>
          <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)',
          color: 'white',
          boxShadow: '0 4px 20px 0 rgba(67, 160, 71, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant='subtitle2' sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  Remaining Balance
                </Typography>
                <Typography variant='h4' sx={{ color: 'white', fontWeight: 700 }}>
                  {formatPHP(remaining)}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <WalletOutline sx={{ fontSize: 32, color: 'white' }} />
              </Box>
            </Box>
          </CardContent>
          <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
        </Card>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', boxShadow: '0 4px 18px 0 rgba(0,0,0,0.05)' }}>
          <CardHeader title="Expenses Breakdown" titleTypographyProps={{ sx: { fontWeight: 600 } }} />
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {chartSeries.length > 0 ? (
              <ReactApexcharts 
                options={{ 
                  labels: chartLabels,
                  tooltip: { y: { formatter: val => formatPHP(val) } },
                  colors: ['#1e88e5', '#e53935', '#ff9800', '#43a047', '#8e24aa', '#00acc1'],
                  stroke: { width: 0 },
                  legend: { position: 'bottom', markers: { radius: 12 } },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '70%',
                        labels: {
                          show: true,
                          name: { fontSize: '14px' },
                          value: { fontSize: '20px', fontWeight: 600, formatter: val => formatPHP(Number(val)) },
                          total: { show: true, label: 'Total', formatter: () => formatPHP(totalExpense) }
                        }
                      }
                    }
                  }
                }} 
                series={chartSeries} 
                type="donut" 
                height={350} 
                width="100%"
              />
            ) : <Typography color="textSecondary" sx={{ mt: 5 }}>No expenditures recorded yet.</Typography>}
          </CardContent>
        </Card>
      </Grid>

      {/* Expense List (Privacy compliant: no payee, no receipts) */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', boxShadow: '0 4px 18px 0 rgba(0,0,0,0.05)' }}>
          <CardHeader 
            title="Recent Expenditures" 
            subheader="Public View of Detailed Expenses" 
            titleTypographyProps={{ sx: { fontWeight: 600 } }}
          />
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.expenditures.slice(0, 7).map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1e88e5' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.category}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.description}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>{formatPHP(row.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {data.expenditures.length > 7 && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                View All Expenditures
              </Typography>
            </Box>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default TransparencyBoard
