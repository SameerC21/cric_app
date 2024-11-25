import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Modal,
} from "@mui/material";
import { teams } from "../utils/playersdetails";
import { Players } from "../utils/playersdata";
import TeamTable from "./teamtable";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./components.css";
import circlebg from "../assets/rb_43496.png";
import playerImage from "../assets/playerimage.jpg";

const PlayerAuction = () => {
  const [boughtPlayers, setBoughtPlayers] = useState(() => {
    // Load from localStorage or initialize as empty array
    const savedPlayers = localStorage.getItem("boughtPlayers");
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const [teamData, setTeamData] = useState(() => {
    // Load from localStorage or initialize as empty array
    const savedTeamData = localStorage.getItem("teamData");
    return savedTeamData ? JSON.parse(savedTeamData) : [];
  });

  const [bidAmount, setBidAmount] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const exportTeamData = () => {
    const csvRows = [];
    const headers = ["Team", "Player"];
    csvRows.push(headers.join(","));

    teamData.forEach((row) => {
      csvRows.push(Object.values(row).join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "team_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBuyPlayer = (player) => {
    if (!bidAmount || !selectedTeam) {
      alert("Please enter a valid bid and select a team!");
      return;
    }

    const newPrice = parseInt(bidAmount);
    if (newPrice < player.price) {
      alert(
        `Bid amount must be greater than or equal to the base price of $${player.price.toLocaleString()}`
      );
      return;
    }

    if (!boughtPlayers.some((p) => p.id === player.id)) {
      const updatedPlayer = { ...player, price: newPrice, team: selectedTeam };
      const updatedBoughtPlayers = [...boughtPlayers, updatedPlayer];

      setBoughtPlayers(updatedBoughtPlayers);
      setTeamData([
        ...teamData,
        { team: selectedTeam, player: updatedPlayer.Name },
      ]);

      localStorage.setItem(
        "boughtPlayers",
        JSON.stringify(updatedBoughtPlayers)
      );
      localStorage.setItem(
        "teamData",
        JSON.stringify([
          ...teamData,
          { team: selectedTeam, player: updatedPlayer.Name },
        ])
      );
    } else {
      alert(`${player.Name} is already sold!`);
    }

    setBidAmount("");
    setSelectedTeam("");
  };

  // effect to update localStorage whenever boughtPlayers or teamData changes
  useEffect(() => {
    localStorage.setItem("boughtPlayers", JSON.stringify(boughtPlayers));
    localStorage.setItem("teamData", JSON.stringify(teamData));
  }, [boughtPlayers, teamData]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box>
      <Box
        sx={{
          maxWidth: "95%",
          width: "100%",
          margin: "auto",
        }}
      >
        {/* <Typography
          variant="h4"
          gutterBottom
          sx={{ marginTop: "0", color: "#FFFFFF", fontWeight: "bold" }}
        >
          Players Available for Auction
        </Typography>
        <TextField
          label="Search Player"
          variant="outlined"
          fullWidth
          style={{ marginBottom: "20px" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        /> */}
        <Slider {...settings}>
          {Players
            .filter(
              (player) =>
                !boughtPlayers.some((p) => p.id === player.id) &&
                player.Name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((player, index) => (
              <Box
                key={player.id}
                sx={{
                  maxWidth: "95%",
                  width: "100%",
                  margin: "auto",
                }}
              >
                <Card
                  className="fade-in"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    background: "linear-gradient(to right, #6a11cb, #2575fc)",
                    borderRadius: "20px",
                    padding: "20px",
                    color: "#ffffff",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                    gap: "20px",
                    width: "90%",
                    margin: "auto",
                  }}
                >
                  <CardContent sx={{ width: "55%" }}>
                    <Box sx={{ position: "relative", marginBottom: "35px" }}>
                      <img alt="Rotating" className="rotating-image" />
                      <Box
                        sx={{
                          width: "300px",
                          height: "300px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          margin: "auto",
                          position: "relative",
                        }}
                      >
                        <img
                          src={player.Photo ? player.Photo : playerImage}
                          alt={`${player.Name}-Image`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        marginTop: "50px",
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          // fontSize: "4rem",
                          color: "#ffffff",
                        }}
                      >
                        {player.Name}
                      </Typography>

                      <Typography variant="h4">{player.role}</Typography>
                    </Box>
                  </CardContent>
                  <CardContent sx={{ width: "45%" }}>
                    <Typography variant="h3">
                      Base Price: &#8377;{player.price.toLocaleString()}
                    </Typography>
                    <Box
                      sx={{
                        marginTop: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                      }}
                    >
                      <Typography variant="h5" className="belowborder">
                        Matches: {player.stats.matches}
                      </Typography>
                      <Typography variant="h5" className="belowborder">
                        Runs: {player.stats.runs}
                      </Typography>
                      <Typography variant="h5" className="belowborder">
                        Best Score: {player.stats.bestscore}
                      </Typography>
                    </Box>
                    <FormControl fullWidth style={{ marginTop: "10px" }}>
                      <TextField
                        label="Bid Amount"
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: "15px",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#1976d2",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1565c0",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0d47a1",
                            },
                          },
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth style={{ marginTop: "10px" }}>
                      <InputLabel>Team</InputLabel>
                      <Select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: "15px",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#1976d2",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1565c0",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0d47a1",
                            },
                          },
                        }}
                      >
                        {teams.map((team) => (
                          <MenuItem key={team} value={team}>
                            {team}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ marginTop: "10px" }}
                      onClick={() => handleBuyPlayer(player)}
                    >
                      Bid Player
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
        </Slider>

        {/* <Typography variant="h4" gutterBottom style={{ marginTop: "20px" }}>
        Sold Players
      </Typography>
      <Grid container spacing={3} padding={2}>
        {boughtPlayers
          .sort((a, b) => b.price - a.price) // Sort sold players by price (descending)
          .map((player) => (
            <Grid item xs={12} sm={6} md={4} key={player.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {player.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Team: {player.team}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sold Price: ${player.price.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid> */}

        <Button variant="contained" color="secondary" onClick={handleOpenModal}>
          Show Team Data
        </Button>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Team Data
            </Typography>
            <TeamTable teamData={teamData} teams={teams} />
            <Button
              onClick={handleCloseModal}
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={exportTeamData}
              sx={{ marginTop: "20px" }}
            >
              Export Team Data
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default PlayerAuction;
