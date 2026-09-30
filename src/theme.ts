import { createTheme } from "@mui/material/styles";

/**
 * App theme with light and dark color schemes.
 * Brand colors come from the logo: popcorn gold (primary) + cinema red (secondary).
 * MUI stores the chosen mode in localStorage and switches CSS variables.
 */
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },

  colorSchemes: {
    light: {
      palette: {
        primary: {
          // Darker gold so text/links on white still have enough contrast
          main: "#C27803",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#E11D48",
        },
        background: {
          default: "#FAF7F2", // warm off-white, like popcorn paper
          paper: "#FFFFFF",
        },
      },
    },

    dark: {
      palette: {
        primary: {
          main: "#FFB224", // popcorn gold
          contrastText: "#1A1200",
        },
        secondary: {
          main: "#FF4D6D",
        },
        background: {
          default: "#0A0C10", // deep blue-black (feels richer than plain grey)
          paper: "#151922",
        },
      },
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Helvetica", "Arial", sans-serif',

    h1: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },

    h2: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },

    h3: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },

    h4: {
      fontWeight: 800,
      letterSpacing: "-0.01em",
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          // Subtle gold "spotlight" glow at the top of the page in dark mode
          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(1000px 500px at 50% -150px, rgba(255, 178, 36, 0.12), transparent)",
            backgroundRepeat: "no-repeat",
          }),
        },
      }),
    },

    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          overflow: "hidden",
          backgroundImage: "none",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",

          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[8],
          },

          // Gold glow on hover in dark mode
          ...theme.applyStyles("dark", {
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 178, 36, 0.35)",
            },
          }),
        }),
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999, // pill buttons
          paddingInline: 18,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
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
