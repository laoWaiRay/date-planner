import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useLogout from "../hooks/useLogout";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;
const navItems = ["Home", "Explore", "Your Date Ideas", "Add Date", "Logout"];

export default function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const logout = useLogout();
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavButtonClick = (event, navItem) => {
    switch (navItem) {
      case "Home":
        navigate("/");
        break;
      case "Explore":
        navigate("/dates");
        break;
      case "Your Date Ideas":
        navigate("/mydates");
        break;
      case "Add Date":
        navigate("/dates/new");
        break;
      case "Logout":
        logout();
        break;
      default:
        return () => {};
    }
  };

  const isActiveLink = (navItem) => {
    let url;
    switch (navItem) {
      case "Home":
        url = "/";
        break;
      case "Explore":
        url = "/dates";
        break;
      case "Your Date Ideas":
        url = "/mydates";
        break;
      case "Add Date":
        url = "/dates/new";
        break;
    }
    if (currentLocation.pathname == url) return true;
    return false;
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Ignite
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item}
            disablePadding
            onClick={(e) => handleNavButtonClick(e, item)}
          >
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }} className="h-[64px]">
      <AppBar component="nav">
        <Toolbar style={{ background: "#39798f" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <div className="flex items-center">
              <svg className="w-[1.5rem] mr-3 fill-white" viewBox="0 0 72.25 95"><defs><style>.cls-1</style></defs><path className="cls-1" d="M15.64,25.63a40.06,40.06,0,0,0-.3,23.67c.14-1.11.08-2.23.17-3.35a24.9,24.9,0,0,1,5.91-14.14,52.38,52.38,0,0,0,5-6.58,20.78,20.78,0,0,0,2.82-9.61A35.75,35.75,0,0,0,26.92,1.4,5.08,5.08,0,0,1,26.5.06c.24-.15.38,0,.52.1A71.31,71.31,0,0,1,41.31,11.41a44.33,44.33,0,0,1,11.48,20,35.27,35.27,0,0,1,.92,11.12,5.19,5.19,0,0,0,1.53-1.26,12.78,12.78,0,0,0,2.88-7.77,17.89,17.89,0,0,0-.2-4.43c.4,0,.48.3.62.48a100.39,100.39,0,0,1,8.22,13A47.45,47.45,0,0,1,72.21,62c.39,8.38-2.37,15.66-7.62,22.08A48.09,48.09,0,0,1,52,94.75c-.19.11-.39.37-.6.19s0-.43.08-.64a49.74,49.74,0,0,0,2.22-8.9c.56-4.49,0-8.75-2.7-12.53a1.25,1.25,0,0,0-.09-.12c-.22-.23-.36-.68-.71-.6s-.23.52-.31.79a12.05,12.05,0,0,1-6.39,7.55c-.26.12-.56.42-.83.18s0-.52.09-.77A29.51,29.51,0,0,0,30.6,46.8c-.16-.11-.33-.31-.54-.22s-.06.32,0,.48c1.46,6.62-.22,12.42-4.53,17.56a34.94,34.94,0,0,0-4.08,5.57,18.51,18.51,0,0,0-2.29,7.89A28.38,28.38,0,0,0,23.2,94.27c.12.21.33.39.31.69-.29.13-.48-.09-.69-.19a44.9,44.9,0,0,1-17-14.53A32,32,0,0,1,0,63.06,43.3,43.3,0,0,1,4.24,43.41c2.86-6.35,6.81-12,11-17.56A.44.44,0,0,1,15.64,25.63Z"/></svg>
              Ignite
            </div>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{ color: "#fff" }}
                onClick={(e) => handleNavButtonClick(e, item)}
                className={`relative ${isActiveLink(item) ? "activeLink" : ""}`}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}
