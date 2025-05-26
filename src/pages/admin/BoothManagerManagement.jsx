import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import axios from 'axios';

const BoothManagerManagement = () => {
  const [boothManagers, setBoothManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    boothName: '',
    boothLocation: '',
    boothNumber: '',
    paperCapacity: 500,
    loadedPaper: 0,
    printerName: '',
    printerModel: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedBoothManagerId, setSelectedBoothManagerId] = useState(null);
  const [selectedBoothManager, setSelectedBoothManager] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch booth managers on component mount
  useEffect(() => {
    fetchBoothManagers();
  }, []);

  // Fetch booth managers from API
  const fetchBoothManagers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/booth-managers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoothManagers(response.data.boothManagers);
      setError('');
    } catch (err) {
      console.error('Error fetching booth managers:', err);
      setError('Failed to load booth managers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'paperCapacity' || name === 'loadedPaper' ? Number(value) : value,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      let response;

      if (editMode) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/booth-managers/${selectedBoothManagerId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSnackbar({
          open: true,
          message: 'Booth manager updated successfully',
          severity: 'success',
        });
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/booth-managers`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSnackbar({
          open: true,
          message: 'Booth manager created successfully',
          severity: 'success',
        });
      }

      handleCloseForm();
      fetchBoothManagers();
    } catch (err) {
      console.error('Error saving booth manager:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error saving booth manager',
        severity: 'error',
      });
    }
  };

  // Handle delete booth manager
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/booth-managers/${selectedBoothManagerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbar({
        open: true,
        message: 'Booth manager deleted successfully',
        severity: 'success',
      });
      handleCloseDeleteDialog();
      fetchBoothManagers();
    } catch (err) {
      console.error('Error deleting booth manager:', err);
      setSnackbar({
        open: true,
        message: 'Error deleting booth manager',
        severity: 'error',
      });
    }
  };

  // Handle toggle booth manager active status
  const handleToggleActive = async (boothManager) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/booth-managers/${boothManager._id}`,
        { isActive: !boothManager.isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbar({
        open: true,
        message: `Booth manager ${boothManager.isActive ? 'deactivated' : 'activated'} successfully`,
        severity: 'success',
      });
      fetchBoothManagers();
    } catch (err) {
      console.error('Error toggling booth manager status:', err);
      setSnackbar({
        open: true,
        message: 'Error updating booth manager status',
        severity: 'error',
      });
    }
  };

  // Open form dialog for creating or editing
  const handleOpenForm = (boothManager = null) => {
    if (boothManager) {
      // Edit mode
      setFormData({
        name: boothManager.name,
        email: boothManager.email,
        password: '', // Don't include password in edit mode
        boothName: boothManager.boothName,
        boothLocation: boothManager.boothLocation,
        boothNumber: boothManager.boothNumber,
        paperCapacity: boothManager.paperCapacity,
        loadedPaper: boothManager.loadedPaper,
        printerName: boothManager.printerName,
        printerModel: boothManager.printerModel,
      });
      setEditMode(true);
      setSelectedBoothManagerId(boothManager._id);
    } else {
      // Create mode
      setFormData({
        name: '',
        email: '',
        password: '',
        boothName: '',
        boothLocation: '',
        boothNumber: '',
        paperCapacity: 500,
        loadedPaper: 0,
        printerName: '',
        printerModel: '',
      });
      setEditMode(false);
      setSelectedBoothManagerId(null);
    }
    setOpenForm(true);
  };

  // Close form dialog
  const handleCloseForm = () => {
    setOpenForm(false);
    setEditMode(false);
    setSelectedBoothManagerId(null);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (id) => {
    setSelectedBoothManagerId(id);
    setOpenDeleteDialog(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBoothManagerId(null);
  };

  // Open view dialog
  const handleOpenViewDialog = (boothManager) => {
    setSelectedBoothManager(boothManager);
    setOpenViewDialog(true);
  };

  // Close view dialog
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedBoothManager(null);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress sx={{ color: '#000' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="500">
          Booth Manager Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          sx={{
            bgcolor: '#000',
            '&:hover': { bgcolor: '#333' },
          }}
        >
          Add Booth Manager
        </Button>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'rgba(0,0,0,0.04)' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'rgba(0,0,0,0.04)' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'rgba(0,0,0,0.04)' }}>Booth Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'rgba(0,0,0,0.04)' }}>Booth Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'rgba(0,0,0,0.04)' }}>Paper Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'rgba(0,0,0,0.04)' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'rgba(0,0,0,0.04)' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boothManagers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No booth managers found
                  </TableCell>
                </TableRow>
              ) : (
                boothManagers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((boothManager) => (
                    <TableRow key={boothManager._id}>
                      <TableCell>{boothManager.name}</TableCell>
                      <TableCell>{boothManager.email}</TableCell>
                      <TableCell>{boothManager.boothName}</TableCell>
                      <TableCell>{boothManager.boothNumber}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 100,
                              height: 10,
                              borderRadius: 5,
                              bgcolor: '#eee',
                              mr: 1,
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: `${Math.min(
                                  (boothManager.loadedPaper / boothManager.paperCapacity) * 100,
                                  100
                                )}%`,
                                bgcolor:
                                  (boothManager.loadedPaper / boothManager.paperCapacity) * 100 < 20
                                    ? 'error.main'
                                    : (boothManager.loadedPaper / boothManager.paperCapacity) * 100 < 50
                                    ? 'warning.main'
                                    : 'success.main',
                              }}
                            />
                          </Box>
                          <Typography variant="caption">
                            {boothManager.loadedPaper} / {boothManager.paperCapacity}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={boothManager.isActive ? 'Active' : 'Inactive'}
                          color={boothManager.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="View Details">
                            <IconButton onClick={() => handleOpenViewDialog(boothManager)} size="small">
                              <VisibilityIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleOpenForm(boothManager)} size="small">
                              <EditIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleOpenDeleteDialog(boothManager._id)}
                              size="small"
                              color="error"
                            >
                              <DeleteIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={boothManager.isActive ? 'Deactivate' : 'Activate'}>
                            <IconButton
                              onClick={() => handleToggleActive(boothManager)}
                              size="small"
                              color={boothManager.isActive ? 'success' : 'default'}
                            >
                              {boothManager.isActive ? (
                                <ToggleOnIcon sx={{ fontSize: 20 }} />
                              ) : (
                                <ToggleOffIcon sx={{ fontSize: 20 }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={boothManagers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Create/Edit Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Booth Manager' : 'Add Booth Manager'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required={!editMode}
                margin="dense"
                helperText={editMode ? 'Leave blank to keep current password' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Booth Name"
                name="boothName"
                value={formData.boothName}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Booth Location"
                name="boothLocation"
                value={formData.boothLocation}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Booth Number"
                name="boothNumber"
                value={formData.boothNumber}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Paper Capacity"
                name="paperCapacity"
                type="number"
                value={formData.paperCapacity}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Loaded Paper"
                name="loadedPaper"
                type="number"
                value={formData.loadedPaper}
                onChange={handleChange}
                fullWidth
                margin="dense"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Printer Name"
                name="printerName"
                value={formData.printerName}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Printer Model"
                name="printerModel"
                value={formData.printerModel}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}
          >
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this booth manager?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>Booth Manager Details</DialogTitle>
        <DialogContent>
          {selectedBoothManager && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">{selectedBoothManager.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{selectedBoothManager.email}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Booth Name
                </Typography>
                <Typography variant="body1">{selectedBoothManager.boothName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Booth Location
                </Typography>
                <Typography variant="body1">{selectedBoothManager.boothLocation}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Booth Number
                </Typography>
                <Typography variant="body1">{selectedBoothManager.boothNumber}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Paper Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 150,
                      height: 12,
                      borderRadius: 5,
                      bgcolor: '#eee',
                      mr: 1,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${Math.min(
                          (selectedBoothManager.loadedPaper / selectedBoothManager.paperCapacity) * 100,
                          100
                        )}%`,
                        bgcolor:
                          (selectedBoothManager.loadedPaper / selectedBoothManager.paperCapacity) * 100 < 20
                            ? 'error.main'
                            : (selectedBoothManager.loadedPaper / selectedBoothManager.paperCapacity) * 100 < 50
                            ? 'warning.main'
                            : 'success.main',
                      }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {selectedBoothManager.loadedPaper} / {selectedBoothManager.paperCapacity} sheets
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Printer Name
                </Typography>
                <Typography variant="body1">{selectedBoothManager.printerName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Printer Model
                </Typography>
                <Typography variant="body1">{selectedBoothManager.printerModel}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedBoothManager.isActive ? 'Active' : 'Inactive'}
                  color={selectedBoothManager.isActive ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedBoothManager.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
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
    </Box>
  );
};

export default BoothManagerManagement; 