import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { keyframes } from "@emotion/react";

// Keyframe animation for the background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Custom Material-UI theme
const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#87CEEB", // Sky blue tone
    },
    secondary: {
      main: "#483D8B", // Dark violet tone
    },
  },
});

const LandingPage = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)", // Adjust for header height
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          overflow: "hidden",
          px: 2,
          background: "linear-gradient(45deg, #192134, #1B2E59, #25689F, #070815)",
          backgroundSize: "300% 300%",
          animation: `${gradientAnimation} 10s ease infinite`,
        }}
      >
        <Box sx={{ maxWidth: "700px", mx: "auto" }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(to right, #87CEEB, #48CE9B, #FF81FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "3rem", md: "4rem" },
              mb: 3,
            }}
          >
            Welcome to Our Lending Platform
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1.2rem", md: "1.8rem" },
              lineHeight: "1.5",
              color: "rgba(255, 255, 255, 0.85)",
              mb: 4,
            }}
          >
            Experience financial freedom with a secure and transparent system. 
            Our platform offers you cutting-edge tools to lend, borrow, and 
            invest with confidence. Join us in building a smarter financial 
            future.
          </Typography>
          <Button
            onClick={props.connect}
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 2,
              borderRadius: "50px",
              background: "linear-gradient(to right, #87CEEB, #483D8B, #000000)",
              fontWeight: "bold",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.4)",
              transition: "transform 0.2s, background 0.3s",
              color: "white",
              "&:hover": {
                background: "linear-gradient(to right, #483D8B, #87CEEB, #000000)",
                transform: "scale(1.05)",
              },
            }}
          >
            Start Exploring
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
