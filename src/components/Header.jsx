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
            Date Planner
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
