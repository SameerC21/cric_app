import React, { useState } from 'react';
import { teamsData } from "../utils/playersdetails";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box } from '@mui/material';
const generateSchedule = (teamsData) => {
  const schedule = [];
  const numTeams = teamsData.length;
  const rounds = numTeams - 1;

  for (let round = 0; round < rounds; round++) {
    const matches = [];
    for (let i = 0; i < numTeams / 2; i++) {
      const home = teamsData[i];
      const away = teamsData[numTeams - 1 - i];
      matches.push({ home, away });
    }
    schedule.push(matches);

    teamsData.splice(1, 0, teamsData.pop());
  }

  return schedule;
};


const MatchSchedule = () => {
  const schedule = generateSchedule([...teamsData]);
  const [open, setOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleClickOpen = (match) => {
    setSelectedMatch(match);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedMatch(null);
  };

  return (
    <Box style={{ background: "#FFFFFF", padding: "20px" }}>
      <h1>Match Schedule</h1>
      {schedule.map((round, index) => (
        <Box key={index}>
          <h2>Slot {index + 1}</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {round.map((match, matchIndex) => (
              <li key={matchIndex} onClick={() => handleClickOpen(match)}>
                {match.home.name} vs {match.away.name}
              </li>
            ))}
          </ul>
        </Box>
      ))}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Match Details</DialogTitle>
        <DialogContent>
          {selectedMatch && (
            <>
              <h3>
                {selectedMatch.home.name} vs {selectedMatch.away.name}
              </h3>
              <Box sx={{display: 'flex', gap: "100px",}}>
                <Box>
                  <h4>{selectedMatch.home.name} <br />Players:</h4>
                  <ul>
                    {teamsData
                      .find((team) => team.name === selectedMatch.home.name)
                      .players.map((player, idx) => (
                        <li key={idx}>{player}</li>
                      ))}
                  </ul>
                </Box>
                <Box>
                  <h4>{selectedMatch.away.name} <br/>Players:</h4>
                  <ul>
                    {teamsData
                      .find((team) => team.name === selectedMatch.away.name)
                      .players.map((player, idx) => (
                        <li key={idx}>{player}</li>
                      ))}
                  </ul>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MatchSchedule;
