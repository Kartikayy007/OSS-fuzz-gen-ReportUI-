import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Divider,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Collapse,
  ListSubheader
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  BugReport as BugReportIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  ExpandLess,
  ExpandMore,
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
  Compare as CompareIcon,
  Add as AddIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

// Recent reports mock data
const recentlyViewedReports = [
  { id: 'exp-1234', name: 'libxml2 Recent Test', date: '2 hours ago' },
  { id: 'exp-5678', name: 'curl Memory Analysis', date: '1 day ago' },
  { id: 'exp-9101', name: 'OpenSSL Fuzz Run', date: '3 days ago' },
];

// Pinned reports mock data
const pinnedReports = [
  { id: 'exp-2468', name: 'libpng Benchmark', date: 'Pinned 1 week ago' },
  { id: 'exp-1357', name: 'sqlite Long-running Test', date: 'Pinned 2 weeks ago' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [experimentsOpen, setExperimentsOpen] = useState(true);
  const [recentOpen, setRecentOpen] = useState(true);
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Auto-collapse drawer on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  // Close drawer when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleExperimentsToggle = () => {
    setExperimentsOpen(!experimentsOpen);
  };

  const handleRecentToggle = () => {
    setRecentOpen(!recentOpen);
  };

  const handlePinnedToggle = () => {
    setPinnedOpen(!pinnedOpen);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };


  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const isSelected = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawerWidth = 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: open ? `100%` : '100%' },
          ml: { md: open ? `${drawerWidth}px` : 0 },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            OSS-Fuzz-Gen
          </Typography>
          <Box sx={{ position: 'relative', borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' }, width: { xs: 120, sm: 200, md: 300 }, mr: 2 }}>
            <Box sx={{ padding: '0 16px', height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search…"
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '8px 8px 8px 0',
                  paddingLeft: `calc(1em + 32px)`,
                  width: '100%'
                },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                aria-label="show 3 new notifications"
                color="inherit"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={notificationsAnchorEl}
              open={Boolean(notificationsAnchorEl)}
              onClose={handleNotificationsClose}
              sx={{ mt: 2 }}
            >
              <MenuItem onClick={handleNotificationsClose}>New crash found in libxml2</MenuItem>
              <MenuItem onClick={handleNotificationsClose}>Experiment "curl test" completed</MenuItem>
              <MenuItem onClick={handleNotificationsClose}>Coverage goal reached in SQLite test</MenuItem>
            </Menu>
            {/* <Tooltip title="User Settings">
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>K</Avatar>
              </IconButton>
            </Tooltip> */}
            <Menu
              anchorEl={userMenuAnchorEl}
              open={Boolean(userMenuAnchorEl)}
              onClose={handleUserMenuClose}
              sx={{ mt: 2 }}
            >
              <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleUserMenuClose}>Account Settings</MenuItem>
              <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 0 }}>
          <List component="nav" aria-label="main navigation" sx={{ px: 1 }}>
            <ListItemButton 
              component={Link} 
              to="/" 
              selected={isSelected('/')}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.12)',
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: isSelected('/') ? 500 : 400 }} />
            </ListItemButton>
            
            {/* Experiments section with dropdown */}
            <ListItemButton 
              onClick={handleExperimentsToggle}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                bgcolor: experimentsOpen ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText primary="Experiments" primaryTypographyProps={{ fontWeight: 500 }} />
              {experimentsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={experimentsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ ml: 1 }}>
                <ListItemButton 
                  component={Link} 
                  to="/experiments" 
                  selected={isSelected('/experiments') && location.pathname === '/experiments'}
                  sx={{ 
                    pl: 3,
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.12)',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <FilterIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="All Experiments" 
                    primaryTypographyProps={{ 
                      fontSize: '0.94rem',
                      fontWeight: isSelected('/experiments') && location.pathname === '/experiments' ? 500 : 400 
                    }} 
                  />
                </ListItemButton>
                <ListItemButton 
                  component={Link} 
                  to="/experiments/new" 
                  selected={isSelected('/experiments/new')}
                  sx={{ 
                    pl: 3,
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.12)',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AddIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="New Experiment" 
                    primaryTypographyProps={{ 
                      fontSize: '0.94rem',
                      fontWeight: isSelected('/experiments/new') ? 500 : 400 
                    }} 
                  />
                </ListItemButton>
                <ListItemButton 
                  component={Link} 
                  to="/experiments/compare" 
                  selected={isSelected('/experiments/compare')}
                  sx={{ 
                    pl: 3,
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.12)',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CompareIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Compare Experiments" 
                    primaryTypographyProps={{ 
                      fontSize: '0.94rem',
                      fontWeight: isSelected('/experiments/compare') ? 500 : 400 
                    }} 
                  />
                </ListItemButton>
              </List>
            </Collapse>
            
            <ListItemButton 
              component={Link} 
              to="/metrics" 
              selected={isSelected('/metrics')}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.12)',
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AnalyticsIcon />
              </ListItemIcon>
              <ListItemText primary="Metrics Dashboard" primaryTypographyProps={{ fontWeight: isSelected('/metrics') ? 500 : 400 }} />
            </ListItemButton>
            
            <ListItemButton 
              component={Link} 
              to="/settings" 
              selected={isSelected('/settings')}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.12)',
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: isSelected('/settings') ? 500 : 400 }} />
            </ListItemButton>
          </List>

          <Divider sx={{ my: 2, mx: 2 }} />
          
          {/* Recently viewed section */}
          <List
            subheader={
              <ListSubheader 
                component="div" 
                onClick={handleRecentToggle} 
                sx={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  px: 2,
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderRadius: 1,
                  }
                }}
              >
                Recently Viewed
                {recentOpen ? <ExpandLess /> : <ExpandMore />}
              </ListSubheader>
            }
            sx={{ px: 1 }}
          >
            <Collapse in={recentOpen} timeout="auto" unmountOnExit>
              {recentlyViewedReports.map((report) => (
                <ListItemButton
                  key={report.id}
                  component={Link}
                  to={`/experiments/${report.id}`}
                  selected={location.pathname === `/experiments/${report.id}`}
                  sx={{ 
                    pl: 2,
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.12)',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <HistoryIcon fontSize="small" sx={{ opacity: 0.7 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={report.name} 
                    secondary={report.date}
                    primaryTypographyProps={{ 
                      variant: 'body2', 
                      noWrap: true,
                      fontWeight: location.pathname === `/experiments/${report.id}` ? 500 : 400,
                      fontSize: '0.875rem'
                    }}
                    secondaryTypographyProps={{ 
                      variant: 'caption', 
                      noWrap: true,
                      fontSize: '0.75rem',
                      color: 'text.secondary'
                    }}
                  />
                </ListItemButton>
              ))}
            </Collapse>
          </List>
          
          {/* Pinned reports section */}
          <List
            subheader={
              <ListSubheader 
                component="div" 
                onClick={handlePinnedToggle} 
                sx={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  px: 2,
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderRadius: 1,
                  }
                }}
              >
                Pinned Reports
                {pinnedOpen ? <ExpandLess /> : <ExpandMore />}
              </ListSubheader>
            }
            sx={{ px: 1 }}
          >
            <Collapse in={pinnedOpen} timeout="auto" unmountOnExit>
              {pinnedReports.map((report) => (
                <ListItemButton
                  key={report.id}
                  component={Link}
                  to={`/experiments/${report.id}`}
                  selected={location.pathname === `/experiments/${report.id}`}
                  sx={{ 
                    pl: 2,
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.12)',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <BookmarkIcon fontSize="small" color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={report.name} 
                    secondary={report.date}
                    primaryTypographyProps={{ 
                      variant: 'body2', 
                      noWrap: true,
                      fontWeight: location.pathname === `/experiments/${report.id}` ? 500 : 400,
                      fontSize: '0.875rem'
                    }}
                    secondaryTypographyProps={{ 
                      variant: 'caption', 
                      noWrap: true,
                      fontSize: '0.75rem',
                      color: 'text.secondary'
                    }}
                  />
                </ListItemButton>
              ))}
            </Collapse>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 0,
          width: { xs: '100%', md: '100%' },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          mt: { xs: 8, sm: 8 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 