import React from 'react';
import { Box, Typography, AppBar, Toolbar, Button } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PlayerAuction from './components/PlayerAuction';
import MatchSchedule from './components/matchFixes';
import './App.css';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Player Auction</Button>
          <Button color="inherit" component={Link} to="/match-schedule">Match Schedule</Button>
        </Toolbar>
      </AppBar>
      <Box className="App" sx={{ padding: 2 }}>
        <Typography variant='h4' sx={{marginTop: "0", color: "#FFFFFF", fontWeight: "bold",borderBottom: "1px solid #FFFFFF",marginBottom :"10px", paddingBottom: "10px",}}>SSPL Cricket Player Auction</Typography>
        <Routes>
          <Route path="/" element={<PlayerAuction />} />
          <Route path="/match-schedule" element={<MatchSchedule />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;