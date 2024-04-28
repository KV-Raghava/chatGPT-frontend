import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Logo from './shared/Logo';
import NavigationLink from './shared/NavigationLink';
import { useAuth } from "../context/AuthContext";
const Header = () => {
  const auth = useAuth();
  return (
    <AppBar 
    sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex" }}>
        <Logo/>
        <div>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink
                bg="#35DF79"
                to="/chat"
                text="Go To Chat"
                textColor="black"
              />
              <NavigationLink
                bg="#35DF79"
                textColor="black"
                to="/"
                text="logout"
                onClick={auth.logout}
              />
            </>
          ) : (
            <>
              <NavigationLink
                bg="#35DF79"
                to="/login"
                text="Login"
                textColor="black"
              />
              <NavigationLink
                bg="#35DF79"
                textColor="black"
                to="/signup"
                text="Signup"
              />
            </>
          )}
        </div>
      </Toolbar>

    </AppBar>
  )
}

export default Header