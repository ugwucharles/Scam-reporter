import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  AdminPanelSettings,
  Visibility,
  Check,
  Close,
  Pending,
  Flag,
  Person,
  Assessment,
  Settings,
  Search,
  MoreVert,
  Security,
  Delete,
  AttachFile,
  VideoFile,
  Description,
  Email,
  Sms,
  DownloadForOffline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { ScamReport } from '../types';
import { scamReportsAPI, adminAPI } from '../services/api';

// import { format } from 'date-fns';
// Simple date formatter to avoid import issues
const format = (date: Date, formatStr: string) => {
  if (formatStr === 'PPP') {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  if (formatStr === 'PPp') {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  if (formatStr === 'MMM dd, yyyy') {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
  }
  return date.toLocaleDateString();
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// User Activities Panel Component
const UserActivitiesPanel: React.FC = () => {
  const [activityPage, setActivityPage] = useState(0);
  const [activitiesPerPage, setActivitiesPerPage] = useState(25);
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState('24h');
  
  const queryClient = useQueryClient();

  // Fetch activities
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['admin-activities', activityPage, activitiesPerPage, activityTypeFilter, timeRangeFilter],
    queryFn: async () => {
      const response = await adminAPI.getActivities({
        page: activityPage + 1,
        limit: activitiesPerPage,
        activityType: activityTypeFilter !== 'all' ? activityTypeFilter : undefined,
        timeRange: timeRangeFilter,
      });
      return response.data;
    },
  });

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'search_query':
        return <Search sx={{ fontSize: 20 }} />;
      case 'website_check':
        return <Security sx={{ fontSize: 20 }} />;
      case 'report_view':
        return <Visibility sx={{ fontSize: 20 }} />;
      case 'report_submit':
        return <Flag sx={{ fontSize: 20 }} />;
      case 'user_login':
        return <Person sx={{ fontSize: 20 }} />;
      case 'user_register':
        return <Person sx={{ fontSize: 20 }} />;
      default:
        return <Assessment sx={{ fontSize: 20 }} />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'search_query':
        return '#2196F3';
      case 'website_check':
        return '#FF9800';
      case 'report_view':
        return '#4CAF50';
      case 'report_submit':
        return '#F44336';
      case 'user_login':
        return '#9C27B0';
      case 'user_register':
        return '#3F51B5';
      default:
        return '#757575';
    }
  };

  const formatActivityDetails = (activity: any) => {
    switch (activity.activityType) {
      case 'search_query':
        return `Query: "${activity.details.query || 'N/A'}" - ${activity.details.result || 'No results'}`;
      case 'website_check':
        return `Website: ${activity.details.website || activity.details.domain} - Result: ${activity.details.result}`;
      case 'report_view':
        return `Viewed report: ${activity.details.reportId || 'N/A'}`;
      case 'report_submit':
        return `Submitted report: ${activity.details.reportId || 'N/A'}`;
      case 'user_login':
        return 'User signed in';
      case 'user_register':
        return 'User registered';
      default:
        return 'Activity performed';
    }
  };

  return (
    <Box>
      {/* Filters */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3, 
        flexWrap: 'wrap',
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <InputLabel>Activity Type</InputLabel>
          <Select
            value={activityTypeFilter}
            label="Activity Type"
            onChange={(e) => setActivityTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All Activities</MenuItem>
            <MenuItem value="search_query">Search Queries</MenuItem>
            <MenuItem value="website_check">Website Checks</MenuItem>
            <MenuItem value="report_view">Report Views</MenuItem>
            <MenuItem value="report_submit">Report Submissions</MenuItem>
            <MenuItem value="user_login">User Logins</MenuItem>
            <MenuItem value="user_register">User Registrations</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRangeFilter}
            label="Time Range"
            onChange={(e) => setTimeRangeFilter(e.target.value)}
          >
            <MenuItem value="1h">Last Hour</MenuItem>
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Activities Statistics */}
      {activitiesData?.statistics && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Activity Statistics
          </Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              sm: 'repeat(auto-fit, minmax(120px, 1fr))' 
            },
            gap: 2 
          }}>
            {activitiesData.statistics.map((stat: any) => (
              <Card key={stat._id} sx={{ height: '100%' }}>
                <CardContent sx={{ py: { xs: 1.5, md: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: getActivityColor(stat._id) }}>
                      {getActivityIcon(stat._id)}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{stat.count}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{
                        fontSize: { xs: '0.65rem', md: '0.75rem' }
                      }}>
                        {stat._id.replace('_', ' ').toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Activities Table */}
      {activitiesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ 
          overflowX: 'auto',
          '& .MuiTable-root': {
            minWidth: { xs: 800, md: 'auto' }
          }
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activitiesData?.activities?.map((activity: any) => (
                <TableRow key={activity._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: getActivityColor(activity.activityType) }}>
                        {getActivityIcon(activity.activityType)}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {activity.activityType.replace('_', ' ').toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {activity.userId ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {activity.userId.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {activity.userId.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.userId.role}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Anonymous
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatActivityDetails(activity)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {activity.location ? (
                        `${activity.location.city || 'Unknown'}, ${activity.location.country || 'Unknown'}`
                      ) : (
                        'Unknown'
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {activity.ipAddress}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(activity.timestamp), 'PPp')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const confirmDelete = window.confirm('Are you sure you want to delete this activity?');
                        if (confirmDelete) {
                          adminAPI.deleteActivity(activity._id).then(() => {
                            queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
                          });
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={activitiesData?.pagination?.totalActivities || 0}
            rowsPerPage={activitiesPerPage}
            page={activityPage}
            onPageChange={(_, newPage) => setActivityPage(newPage)}
            onRowsPerPageChange={(e) => {
              setActivitiesPerPage(parseInt(e.target.value, 10));
              setActivityPage(0);
            }}
          />
        </TableContainer>
      )}
    </Box>
  );
};

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
  const [moderationDialog, setModerationDialog] = useState(false);
  const [moderationStatus, setModerationStatus] = useState('');
  const [moderationNotes, setModerationNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const queryClient = useQueryClient();

  // Fetch all reports (including pending ones for admin)
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-all-reports', page, rowsPerPage, statusFilter],
    queryFn: async () => {
      const response = await adminAPI.getAllReports({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      return response.data;
    },
    enabled: !!user
  });

  // Fetch pending reports
  const { data: pendingReports, isLoading: pendingLoading } = useQuery({
    queryKey: ['admin-pending-reports'],
    queryFn: async () => {
      const response = await adminAPI.getAllReports({ 
        page: 1, 
        limit: 100, 
        status: 'pending' 
      });
      return response.data.reports;
    },
    enabled: !!user
  });

  // Moderation mutation
  const moderateMutation = useMutation({
    mutationFn: async ({ reportId, status, notes }: { reportId: string; status: string; notes: string }) => {
      return scamReportsAPI.moderateReport(reportId, status, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-reports'] });
      setModerationDialog(false);
      setSelectedReport(null);
      setModerationNotes('');
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleModerate = (report: ScamReport) => {
    setSelectedReport(report);
    setModerationDialog(true);
  };

  const handleModerationSubmit = () => {
    if (selectedReport && moderationStatus) {
      moderateMutation.mutate({
        reportId: selectedReport._id,
        status: moderationStatus,
        notes: moderationNotes,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      case 'under_review':
        return 'info';
      default:
        return 'default';
    }
  };

  const getScamTypeColor = (scamType: string) => {
    const colors: { [key: string]: string } = {
      'online_shopping': '#FF6B35',
      'investment': '#E53E3E',
      'romance': '#E91E63',
      'phishing': '#FF8C00',
      'fake_job': '#9C27B0',
      'crypto': '#3F51B5',
      'tech_support': '#2196F3',
      'charity': '#4CAF50',
      'lottery': '#FF5722',
      'rental': '#795548',
      'identity_theft': '#F44336',
      'other': '#757575',
    };
    return colors[scamType] || '#757575';
  };

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Access Denied</Typography>
          <Typography>You don't have permission to access this area.</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', 
      pt: 8,
      overflow: 'hidden', // Prevent horizontal scrolling
      width: '100%'
    }}>
      <Container maxWidth="xl" sx={{ 
        py: 4,
        px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            mb: 4, 
            background: 'linear-gradient(135deg, #1B365C 0%, #2D4A6B 100%)',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: { xs: 'flex-start', md: 'center' }, 
              gap: { xs: 2, md: 3 },
              flexDirection: { xs: 'column', md: 'row' }
            }}>
              <Avatar sx={{ 
                width: { xs: 60, md: 80 }, 
                height: { xs: 60, md: 80 }, 
                bgcolor: 'rgba(255,255,255,0.2)' 
              }}>
                <AdminPanelSettings sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }} />
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h3" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  mb: 1,
                  wordBreak: 'break-word',
                  fontSize: { xs: '2rem', md: '3rem' }
                }}>
                  Admin Dashboard
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  wordBreak: 'break-word',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}>
                  Welcome back, {user.username}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  display: { xs: 'none', sm: 'block' }
                }}>
                  {user.role === 'admin' ? 'Administrator' : 'Moderator'} • Last login: {format(new Date(), 'PPP')}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={logout}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            },
            gap: 2, 
            mb: 4 
          }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8A5B 100%)',
              height: '100%'
            }}>
              <CardContent sx={{ color: 'white', py: { xs: 1.5, md: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                        {(pendingReports as ScamReport[])?.length || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontSize: { xs: '0.7rem', md: '0.875rem' }
                      }}>
                        Pending Reports
                      </Typography>
                    </Box>
                    <Pending sx={{ fontSize: { xs: 24, md: 32 }, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            
            <Card sx={{ 
              background: 'linear-gradient(135deg, #38A169 0%, #48BB78 100%)',
              height: '100%'
            }}>
              <CardContent sx={{ color: 'white', py: { xs: 1.5, md: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                        {(reportsData as any)?.reports?.filter((r: ScamReport) => r.status === 'approved').length || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontSize: { xs: '0.7rem', md: '0.875rem' }
                      }}>
                        Approved
                      </Typography>
                    </Box>
                    <Check sx={{ fontSize: { xs: 24, md: 32 }, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            
            <Card sx={{ 
              background: 'linear-gradient(135deg, #E53E3E 0%, #FC8181 100%)',
              height: '100%'
            }}>
              <CardContent sx={{ color: 'white', py: { xs: 1.5, md: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                        {(reportsData as any)?.reports?.filter((r: ScamReport) => r.status === 'rejected').length || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontSize: { xs: '0.7rem', md: '0.875rem' }
                      }}>
                        Rejected
                      </Typography>
                    </Box>
                    <Close sx={{ fontSize: { xs: 24, md: 32 }, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            
            <Card sx={{ 
              background: 'linear-gradient(135deg, #3182CE 0%, #63B3ED 100%)',
              height: '100%'
            }}>
              <CardContent sx={{ color: 'white', py: { xs: 1.5, md: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                        {(reportsData as any)?.pagination?.totalReports || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontSize: { xs: '0.7rem', md: '0.875rem' }
                      }}>
                        Total Reports
                      </Typography>
                    </Box>
                    <Assessment sx={{ fontSize: { xs: 24, md: 32 }, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
          </Box>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper sx={{ mb: 4, overflow: 'hidden' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: { xs: 'auto', sm: 160 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 }
                },
                '& .MuiTabs-scrollButtons': {
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                },
              }}
            >
              <Tab
                icon={<Badge badgeContent={(pendingReports as ScamReport[])?.length} color="error"><Pending /></Badge>}
                label="Pending Reviews"
              />
              <Tab icon={<Assessment />} label="All Reports" />
              <Tab icon={<Person />} label="User Management" />
              <Tab icon={<Security />} label="User Activities" />
              <Tab icon={<Settings />} label="System Settings" />
            </Tabs>

            {/* Pending Reviews Tab */}
            <TabPanel value={currentTab} index={0}>
              {pendingLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(auto-fit, minmax(260px, 1fr))', 
                    md: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    lg: 'repeat(auto-fit, minmax(350px, 1fr))' 
                  }, 
                  gap: { xs: 1.5, sm: 2, md: 3 },
                  width: '100%',
                  overflowX: 'hidden',
                  px: 0 // Remove any padding that might cause overflow
                }}>
                  {(pendingReports as ScamReport[])?.map((report: ScamReport) => (
                    <Box key={report._id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          minWidth: 0, // Allow shrinking
                          maxWidth: '100%', // Prevent overflow
                          '&:hover': {
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Chip
                              label={report.scamType.replace('_', ' ').toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: getScamTypeColor(report.scamType),
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                            />
                            <Chip
                              label={report.status}
                              size="small"
                              color={getStatusColor(report.status) as any}
                            />
                          </Box>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            gutterBottom
                            sx={{
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}
                          >
                            {report.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2,
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {report.description.substring(0, 150)}...
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                              {report.reportedBy?.username?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" color="text.secondary">
                              By {report.reportedBy?.username || 'Anonymous'}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Submitted: {format(new Date(report.createdAt), 'PPp')}
                          </Typography>
                          
                          {/* Evidence Section */}
                          {report.evidence && report.evidence.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Evidence ({report.evidence.length})
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 1,
                                maxHeight: 120,
                                overflowY: 'auto'
                              }}>
                                {report.evidence.map((evidence, index) => (
                                  <Box key={index} sx={{ 
                                    position: 'relative',
                                    minWidth: 60,
                                    maxWidth: 100
                                  }}>
                                    {evidence.type === 'screenshot' || evidence.type === 'document' ? (
                                      evidence.url ? (
                                        <Box sx={{
                                          width: 80,
                                          height: 60,
                                          border: '1px solid #ddd',
                                          borderRadius: 1,
                                          overflow: 'hidden',
                                          position: 'relative',
                                          cursor: 'pointer',
                                          '&:hover': {
                                            opacity: 0.8
                                          }
                                        }}>
                                          <img 
                                            src={evidence.url}
                                            alt={evidence.description || 'Evidence'}
                                            style={{
                                              width: '100%',
                                              height: '100%',
                                              objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement;
target.style.display = 'none';
                                              const parent = target.parentElement;
                                              if (parent) {
                                                const fallback = document.createElement('div');
                                                fallback.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #666; font-size: 12px; text-align: center; padding: 4px;';
                                                fallback.innerHTML = `
                                                  <div>
                                                    <div style="margin-bottom: 4px;">📎</div>
                                                    <div>${evidence.filename || 'File'}</div>
                                                  </div>
                                                `;
                                                parent.appendChild(fallback);
                                              }
                                            }}
                                          />
                                        </Box>
                                      ) : (
                                        <Box sx={{
                                          width: 80,
                                          height: 60,
                                          border: '1px solid #ddd',
                                          borderRadius: 1,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          backgroundColor: '#f5f5f5',
                                          flexDirection: 'column',
                                          cursor: 'pointer'
                                        }}>
                                          <AttachFile sx={{ fontSize: 16, color: '#666', mb: 0.5 }} />
                                          <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#666', textAlign: 'center' }}>
                                            {evidence.filename || 'File'}
                                          </Typography>
                                        </Box>
                                      )
                                    ) : (
                                      <Box sx={{
                                        width: 80,
                                        height: 60,
                                        border: '1px solid #ddd',
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#f5f5f5',
                                        flexDirection: 'column',
                                        cursor: 'pointer'
                                      }}>
                                        {evidence.type === 'video' && <VideoFile sx={{ fontSize: 16, color: '#666', mb: 0.5 }} />}
                                        {evidence.type === 'email' && <Email sx={{ fontSize: 16, color: '#666', mb: 0.5 }} />}
                                        {evidence.type === 'text_message' && <Sms sx={{ fontSize: 16, color: '#666', mb: 0.5 }} />}
                                        {evidence.type === 'other' && <Description sx={{ fontSize: 16, color: '#666', mb: 0.5 }} />}
                                        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#666', textAlign: 'center' }}>
                                          {evidence.type.replace('_', ' ')}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                        <Box sx={{ p: 2, pt: 0 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              gap: 1,
                              flexDirection: { xs: 'column', sm: 'row' }
                            }}>
                            <Button
                              fullWidth
                              size="small"
                              variant="outlined"
                              startIcon={<Visibility />}
                              onClick={() => handleModerate(report)}
                            >
                              Review
                            </Button>
                            <Button
                              fullWidth
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<Check />}
                              onClick={() => {
                                setSelectedReport(report);
                                setModerationStatus('approved');
                                setModerationDialog(true);
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              fullWidth
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<Close />}
                              onClick={() => {
                                setSelectedReport(report);
                                setModerationStatus('rejected');
                                setModerationDialog(true);
                              }}
                            >
                              Reject
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                    </Box>
                  ))}
                </Box>
              )}
              {(pendingReports as ScamReport[])?.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Check sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    All caught up!
                  </Typography>
                  <Typography color="text.secondary">
                    No pending reports to review at the moment.
                  </Typography>
                </Box>
              )}
            </TabPanel>

            {/* All Reports Tab */}
            <TabPanel value={currentTab} index={1}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ maxWidth: { xs: '100%', md: 300 } }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Filter by Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                      <MenuItem value="under_review">Under Review</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TableContainer component={Paper} sx={{ 
                overflowX: 'auto',
                '& .MuiTable-root': {
                  minWidth: { xs: 800, md: 'auto' }
                }
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Reporter</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Views</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {((reportsData as any)?.reports as ScamReport[])
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      ?.map((report: ScamReport) => (
                        <TableRow key={report._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {report.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={report.scamType.replace('_', ' ')}
                              size="small"
                              sx={{
                                bgcolor: getScamTypeColor(report.scamType),
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                                {report.reportedBy?.username?.charAt(0).toUpperCase()}
                              </Avatar>
                              {report.reportedBy?.username || 'Anonymous'}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={report.status}
                              size="small"
                              color={getStatusColor(report.status) as any}
                            />
                          </TableCell>
                          <TableCell>
                            {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>{report.views}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleModerate(report)}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={(reportsData as any)?.pagination?.totalReports || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </TabPanel>

            {/* User Management Tab */}
            <TabPanel value={currentTab} index={2}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Person sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  User Management
                </Typography>
                <Typography color="text.secondary">
                  User management features coming soon.
                </Typography>
              </Box>
            </TabPanel>

            {/* User Activities Tab */}
            <TabPanel value={currentTab} index={3}>
              <UserActivitiesPanel />
            </TabPanel>

            {/* System Settings Tab */}
            <TabPanel value={currentTab} index={4}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Settings sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  System Settings
                </Typography>
                <Typography color="text.secondary">
                  System configuration options coming soon.
                </Typography>
              </Box>
            </TabPanel>
          </Paper>
        </motion.div>
      </Container>

      {/* Moderation Dialog */}
      <Dialog
        open={moderationDialog}
        onClose={() => setModerationDialog(false)}
        maxWidth="md"
        fullWidth
fullScreen={false}
        sx={{
          '& .MuiDialog-paper': {
            margin: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' }
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Moderate Report: {selectedReport?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
{selectedReport && (
            <Box sx={{ py: 2, overflow: 'hidden' }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: { xs: 2, md: 3 },
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: 'wrap',
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Scam Type
                    </Typography>
                    <Chip
                      label={selectedReport.scamType.replace('_', ' ')}
                      sx={{
                        bgcolor: getScamTypeColor(selectedReport.scamType),
                        color: 'white',
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Description
                  </Typography>
                  <Box sx={{
                    maxHeight: 200,
                    overflowY: 'auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    backgroundColor: '#fafafa'
                  }}>
                    <Typography variant="body2" color="text.secondary" sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5
                    }}>
                      {selectedReport.description}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Evidence Section in Dialog */}
                {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Evidence ({selectedReport.evidence.length} files)
                    </Typography>
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                      gap: 2,
                      maxHeight: 400,
                      overflowY: 'auto',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      p: 2
                    }}>
                      {selectedReport.evidence.map((evidence, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          {evidence.type === 'screenshot' || evidence.type === 'document' ? (
                            evidence.url ? (
                              <Box sx={{
                                width: '100%',
                                maxWidth: 150,
                                height: 100,
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                overflow: 'hidden',
                                position: 'relative',
                                cursor: 'pointer',
                                '&:hover': {
                                  boxShadow: 2
                                },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5'
                              }}>
                                <img 
                                  src={evidence.url}
                                  alt={evidence.description || 'Evidence'}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                  onClick={() => window.open(evidence.url, '_blank')}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    const parent = target.parentElement;
                                    if (parent) {
                                      target.style.display = 'none';
                                      // Create fallback content
                                      const fallback = document.createElement('div');
                                      fallback.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 12px; text-align: center; padding: 8px;';
                                      fallback.innerHTML = `
                                        <div style="font-size: 20px; margin-bottom: 4px;">📄</div>
                                        <div>${evidence.filename || evidence.type}</div>
                                      `;
                                      parent.appendChild(fallback);
                                    }
                                  }}
                                />
                              </Box>
                            ) : (
                              <Box sx={{
                                width: '100%',
                                maxWidth: 150,
                                height: 100,
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5',
                                flexDirection: 'column',
                                cursor: 'pointer'
                              }}>
                                <AttachFile sx={{ fontSize: 24, color: '#666', mb: 1 }} />
                                <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', fontSize: '0.65rem' }}>
                                  {evidence.filename || 'No File'}
                                </Typography>
                              </Box>
                            )
                          ) : (
                            <Box sx={{
                              width: '100%',
                              maxWidth: 150,
                              height: 100,
                              border: '1px solid #ddd',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f5f5f5',
                              flexDirection: 'column',
                              cursor: evidence.url ? 'pointer' : 'default'
                            }}
                            onClick={evidence.url ? () => window.open(evidence.url, '_blank') : undefined}
                            >
                              {evidence.type === 'video' && <VideoFile sx={{ fontSize: 24, color: '#666', mb: 1 }} />}
                              {evidence.type === 'email' && <Email sx={{ fontSize: 24, color: '#666', mb: 1 }} />}
                              {evidence.type === 'text_message' && <Sms sx={{ fontSize: 24, color: '#666', mb: 1 }} />}
                              {evidence.type === 'other' && <Description sx={{ fontSize: 24, color: '#666', mb: 1 }} />}
                              <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', textTransform: 'capitalize', fontSize: '0.65rem' }}>
                                {evidence.filename || evidence.type.replace('_', ' ')}
                              </Typography>
                            </Box>
                          )}
                          
                          <Box sx={{ textAlign: 'center', width: '100%' }}>
                            <Typography variant="caption" sx={{ 
                              display: 'block',
                              fontWeight: 'medium',
                              color: 'text.primary',
                              wordBreak: 'break-word'
                            }}>
                              {evidence.filename || `${evidence.type}.file`}
                            </Typography>
                            {evidence.description && (
                              <Typography variant="caption" sx={{ 
                                display: 'block',
                                color: 'text.secondary',
                                mt: 0.5,
                                fontStyle: 'italic',
                                wordBreak: 'break-word'
                              }}>
                                {evidence.description}
                              </Typography>
                            )}
                            {evidence.url && (
                              <Button
                                size="small"
                                startIcon={<DownloadForOffline />}
                                onClick={() => window.open(evidence.url, '_blank')}
                                sx={{ 
                                  mt: 0.5,
                                  fontSize: '0.7rem',
                                  minWidth: 'auto',
                                  px: 1
                                }}
                              >
                                View
                              </Button>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                <FormControl fullWidth>
                  <InputLabel>New Status</InputLabel>
                  <Select
                    value={moderationStatus}
                    label="New Status"
                    onChange={(e) => setModerationStatus(e.target.value)}
                  >
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="under_review">Under Review</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          p: { xs: 2, sm: 1 }
        }}>
          <Button 
            onClick={() => setModerationDialog(false)}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleModerationSubmit}
            variant="contained"
            disabled={!moderationStatus || moderateMutation.isPending}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {moderateMutation.isPending ? <CircularProgress size={20} /> : 'Save Decision'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
