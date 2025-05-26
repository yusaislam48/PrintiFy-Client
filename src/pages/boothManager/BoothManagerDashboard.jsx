import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalPrintshopOutlined,
  LocationOnOutlined,
  PersonOutlined,
  NumbersOutlined,
  DescriptionOutlined,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import axios from 'axios';

const BoothManagerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [boothManager, setBoothManager] = useState(null);
  const [error, setError] = useState('');
  const [openPaperDialog, setOpenPaperDialog] = useState(false);
  const [paperCount, setPaperCount] = useState(0);
  const [paperOperation, setPaperOperation] = useState('add');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch booth manager data on component mount
  useEffect(() => {
    fetchBoothManagerData();
  }, []);

  // Fetch booth manager data from API
  const fetchBoothManagerData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/booth-managers/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoothManager(response.data.boothManager);
      setError('');
    } catch (err) {
      console.error('Error fetching booth manager data:', err);
      setError('Failed to load your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle paper count update
  const handlePaperUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/booth-managers/paper-count`,
        {
          loadedPaper: paperCount,
          operation: paperOperation,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbar({
        open: true,
        message: 'Paper count updated successfully',
        severity: 'success',
      });
      handleClosePaperDialog();
      fetchBoothManagerData();
    } catch (err) {
      console.error('Error updating paper count:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error updating paper count',
        severity: 'error',
      });
    }
  };

  // Open paper update dialog
  const handleOpenPaperDialog = (operation) => {
    setPaperOperation(operation);
    setPaperCount(0);
    setOpenPaperDialog(true);
  };

  // Close paper update dialog
  const handleClosePaperDialog = () => {
    setOpenPaperDialog(false);
  };

  // Handle paper count input change
  const handlePaperCountChange = (e) => {
    setPaperCount(Number(e.target.value));
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate paper level percentage
  const calculatePaperLevel = () => {
    if (!boothManager) return 0;
    return Math.min((boothManager.loadedPaper / boothManager.paperCapacity) * 100, 100);
  };

  // Get paper level color based on percentage
  const getPaperLevelColor = () => {
    const level = calculatePaperLevel();
    if (level < 20) return '#f44336'; // Red
    if (level < 50) return '#ff9800'; // Orange
    return '#4caf50'; // Green
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#000' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="500">
          Booth Manager Dashboard
        </Typography>
        <IconButton
          onClick={fetchBoothManagerData}
          sx={{
            bgcolor: '#000',
            color: 'white',
            '&:hover': { bgcolor: '#333' },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {boothManager && (
        <>
          {/* Booth Info Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              mb: 4,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: '#000',
                color: 'white',
              }}
            >
              <Typography variant="h5" fontWeight="500">
                Booth Information
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" fontWeight="500">
                      Manager Name:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    {boothManager.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" fontWeight="500">
                      Booth Name:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    {boothManager.boothName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" fontWeight="500">
                      Booth Location:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    {boothManager.boothLocation}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <NumbersOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" fontWeight="500">
                      Booth Number:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    {boothManager.boothNumber}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Printer Info Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              mb: 4,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: '#000',
                color: 'white',
              }}
            >
              <Typography variant="h5" fontWeight="500">
                Printer Information
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalPrintshopOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" fontWeight="500">
                      Printer Name:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    {boothManager.printerName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalPrintshopOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" fontWeight="500">
                      Printer Model:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    {boothManager.printerModel}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Paper Status Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: '#000',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" fontWeight="500">
                Paper Status
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenPaperDialog('add')}
                  sx={{
                    mr: 1,
                    bgcolor: 'white',
                    color: '#000',
                    '&:hover': { bgcolor: '#eee' },
                  }}
                >
                  Add Paper
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenPaperDialog('set')}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': { borderColor: '#eee', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Set Paper
                </Button>
              </Box>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 2 }}>
                    Paper Level
                  </Typography>
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 20,
                        borderRadius: 10,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${calculatePaperLevel()}%`,
                          bgcolor: getPaperLevelColor(),
                          transition: 'width 0.5s ease-in-out',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'text.secondary',
                        fontWeight: 'bold',
                      }}
                    >
                      {Math.round(calculatePaperLevel())}%
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {boothManager.loadedPaper} / {boothManager.paperCapacity} sheets
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 2 }}>
                    Paper Status
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: calculatePaperLevel() < 20 ? 'error.light' : 'success.light',
                    }}
                  >
                    <Typography
                      variant="h6"
                      color={calculatePaperLevel() < 20 ? 'error.dark' : 'success.dark'}
                    >
                      {calculatePaperLevel() < 20
                        ? 'Low Paper! Please refill soon.'
                        : calculatePaperLevel() < 50
                        ? 'Paper level is okay, but consider refilling.'
                        : 'Paper level is good.'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </>
      )}

      {/* Paper Update Dialog */}
      <Dialog open={openPaperDialog} onClose={handleClosePaperDialog}>
        <DialogTitle>
          {paperOperation === 'add' ? 'Add Paper to Printer' : 'Set Paper Level'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {paperOperation === 'add'
              ? 'Enter the number of sheets to add to the current count.'
              : 'Enter the total number of sheets currently in the printer.'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Current paper level: {boothManager?.loadedPaper || 0} /{' '}
            {boothManager?.paperCapacity || 0} sheets
          </Typography>
          <TextField
            label="Paper Count"
            type="number"
            fullWidth
            value={paperCount}
            onChange={handlePaperCountChange}
            inputProps={{
              min: 0,
              max: boothManager?.paperCapacity || 1000,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaperDialog}>Cancel</Button>
          <Button
            onClick={handlePaperUpdate}
            variant="contained"
            sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}
          >
            {paperOperation === 'add' ? 'Add Paper' : 'Set Paper Level'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BoothManagerDashboard; 