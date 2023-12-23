import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import usePermissionState from "../Common/usePermissionState";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { getUserById } from "../../services/PermissionAndSettings/PermissionService";
import swal from "sweetalert";

// icons
import HomeIcon from "@mui/icons-material/Home";
import TrafficIcon from "@mui/icons-material/Traffic";
import EmergencyShareIcon from "@mui/icons-material/EmergencyShare";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import SignpostIcon from "@mui/icons-material/Signpost";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Cookies from 'js-cookie'; 
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import LoginIcon from "@mui/icons-material/Login";
// import LogoutIcon from "@mui/icons-material/Logout";


const drawerWidth = 300;
const pages = ["Our Services", "Plans"];
const mainFunctions = [
  "Traffic Optimization",
  "EV Prioritization",
  "Accident Detection",
  "Violation Detection",
  "Permission and Settings",
];

const otherFunctions = ["Plans and Prices"];

const paths = [
  "/Traffic_Light_System",
  "/evp/home",
  "/asd-main",
  "/violations",
  "/permission-settings",
];

const otherPaths = ["/plans-pricing"];

const icons = [
  "TrafficIcon",
  "EmergencyShareIcon",
  "CarCrashIcon",
  "SignpostIcon",
  "SettingsIcon",
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ children, currentUser }) {
  const settings = [];
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [permissionState, setPermissionState] = useState(["Home"]);
  const id = localStorage.getItem("userId");
  const storedData = localStorage.getItem("user");
  const user = JSON.parse(storedData);
  useEffect(() => {
    const fetchData = () => {
      try {
        getUserById(id)
          .then(({ data }) => {
            console.log("fetching data:", data);
            if (Array.isArray(data.permissions)) {
              setPermissionState(data.permissions);
            } else if (data.permissions) {
              setPermissionState([data.permissions]);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
        // data = permissionState;
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);


  if (localStorage.getItem('user') === null) {
    settings.push({ label: 'Sign In', icon: SettingsIcon });
  } else {
    if (localStorage.getItem('role') === "admin") {
      settings.push({ label: 'Admin Panel', icon: AdminPanelSettingsIcon });
    }

    settings.push({ label: 'Profile', icon:PersonIcon });
    settings.push({ label: 'Logout', icon: LogoutIcon });
  }
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const scrollToServices = () => {
    const servicesRef = document.getElementById("services_section");
    setTimeout(() => {
      servicesRef.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const scrollToPlans = () => {
    const plansRef = document.getElementById("plans_section");
    plansRef.scrollIntoView({ behavior: "smooth" });
  };
  const handleMenuItemClick = (settings) => () => {
    
    switch (settings) {
      case "SignIn":
        handleSignIn();
        break;
      case "Admin Panel":
        handleAdminPanel();
        break;
      case "Profile":
        handleProfile();
        break;
      case "Logout":
        handleLogout();
        break;
      default:
      
    }
  
    handleCloseUserMenu();
  };

const handleSignIn = () => {
  window.location.href = '/Siginin';
  console.log("Sign In clicked");
};


const handleAdminPanel = () => {
  window.location.href = '/Organization_Main';
  console.log("Admin Panel clicked");
};


const handleProfile = () => {
  window.location.href = '/userprofile';
  console.log("Profile clicked");
};


const handleLogout = () => {
  Cookies.remove('token');
  localStorage.clear();

  window.location.href = '/';
  swal("Successful!", "Successfully Logout ✅ ", "success");
};

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <TrafficIcon sx={{ marginRight: "1rem" }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Traffic Optima
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>
          {/* user profile and other options */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.label}
                  onClick={handleMenuItemClick(setting.label)}
                >
                  <ListItemIcon>{<setting.icon />}</ListItemIcon>
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {/* <Header open={open} handleDrawerOpen={handleDrawerOpen} /> */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => {
              window.location = "/";
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 1 : "auto" }}
                itemSize={6}
              >
                <DoneOutlineIcon
                  fontSize="small"
                  style={{ color: "#ffffff" }}
                />
              </ListItemIcon>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          {mainFunctions.map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => {
                if (permissionState.includes(text) || index === 0) {
                  window.location = paths[index];
                }
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                {!permissionState.includes(text) && index !== 0 ? (
                  <ListItemIcon
                    sx={{ minWidth: 0, mr: open ? 1 : "auto" }}
                    itemSize={6}
                  >
                    <LockIcon fontSize="small" style={{ color: "#cfd8dc" }} />
                  </ListItemIcon>
                ) : (
                  <ListItemIcon
                    sx={{ minWidth: 0, mr: open ? 1 : "auto" }}
                    itemSize={6}
                  >
                    <DoneOutlineIcon
                      fontSize="small"
                      style={{ color: "#ffffff" }}
                    />
                  </ListItemIcon>
                )}
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  {index === 0 ? (
                    <TrafficIcon />
                  ) : index === 1 ? (
                    <EmergencyShareIcon />
                  ) : index === 2 ? (
                    <CarCrashIcon />
                  ) : index === 3 ? (
                    <SignpostIcon />
                  ) : index === 4 ? (
                    <SettingsIcon />
                  ) : (
                    <DoneOutlineIcon />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {otherFunctions.map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => {
                window.location = otherPaths[index];
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                  style={{ marginLeft: "20px" }}
                >
                  {index % 2 === 0 ? <LocalOfferIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {children}
    </Box>
  );
}
