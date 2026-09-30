import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },

  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#E53935",
        },
        secondary: {
          main: "#FFB300",
        },
        background: {
          default: "#F5F5F7",
          paper: "#FFFFFF",
        },
      },
    },

    dark: {
      palette: {
        primary: {
          main: "#FF5252",
        },
        secondary: {
          main: "#FFC107",
        },
        background: {
          default: "#0D0D0F",
          paper: "#19191D",
        },
      },
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    h1: {
      fontWeight: 800,
    },

    h2: {
      fontWeight: 800,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: "hidden",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",

          "&:hover": {
            transform: "translateY(-4px)",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
  },
});

export default theme;
