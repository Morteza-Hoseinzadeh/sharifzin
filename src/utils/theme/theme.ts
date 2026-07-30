import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },

  direction: 'rtl',

  typography: {
    fontFamily: '"Dana", "Tahoma", "Vazir", "sans-serif"',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    subtitle1: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    button: { fontWeight: 500 },
  },

  palette: {
    mode: 'light',

    primary: {
      main: '#F97516', // Orange
      light: '#FB923C',
      dark: '#EA580C',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#2055A3', // Blue
      light: '#3B82F6',
      dark: '#1E3A8A',
      contrastText: '#FFFFFF',
    },

    background: {
      default: '#fff', // Main background
      paper: '#EEEEEE', // Cards background
    },

    text: {
      primary: '#0B1D30', // Dark navy
      secondary: '#4B5563',
      disabled: '#8F8F8F',
    },

    divider: '#404040',

    success: {
      main: '#22C55E',
    },

    warning: {
      main: '#F59E0B',
    },

    error: {
      main: '#EF4444',
    },

    info: {
      main: '#3B82F6',
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // دکمه‌ها رو حرفه‌ای‌تر می‌کنه
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        },
      },
    },
  },
});

export default theme;

// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//   breakpoints: {
//     values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
//   },

//   direction: 'rtl',

//   typography: {
//     fontFamily: '"Dana", "Tahoma", "Vazir", "sans-serif"',
//     h1: { fontWeight: 700 },
//     h2: { fontWeight: 700 },
//     h3: { fontWeight: 600 },
//     h4: { fontWeight: 600 },
//     h5: { fontWeight: 500 },
//     h6: { fontWeight: 500 },
//     subtitle1: { fontWeight: 500 },
//     body1: { fontWeight: 400 },
//     button: { fontWeight: 500 },
//   },

//   palette: {
//     mode: 'dark', // ← این باعث می‌شه MUI خودش تعدادی رنگ رو بهینه کنه

//     primary: {
//       main: '#1394b8', // dark-blue – برای hover/active/deep states
//       light: '#67E8F9', // کمی روشن‌تر (auto-generated بهتره اما دستی تنظیم کردم)
//       dark: '#04a4c0', // primary-blue – رنگ اصلی برند
//       contrastText: '#F6F6F6', // contrast-color – روی آبی خیلی خوانا
//     },

//     secondary: {
//       main: '#003970', // می‌تونی یه رنگ مکمل بذاری – اینجا از light blue مشتق شده
//       light: '#2563EB',
//       dark: 'rgb(32, 62, 92)',
//       contrastText: '#F6F6F6',
//     },

//     background: {
//       default: '#F2F2F2', // کمی تیره‌تر از #163172 برای حس عمق
//       paper: '#F7FFFD', // کارت‌ها و پنل‌ها – کمی روشن‌تر از background
//     },

//     text: {
//       primary: '#252525', // contrast-color – متن اصلی روی تاریک
//       secondary: '#e1e1e1', // خاکستری-آبی ملایم برای توضیحات/کم اهمیت
//       disabled: '#c1c7cd',
//     },

//     divider: 'rgba(240, 248, 255, 0.12)', // خیلی ملایم روی dark

//     // اگر می‌خوای error / warning / info / success رو هم تعریف کنی:
//     error: {
//       main: '#EF5350',
//     },
//     warning: {
//       main: '#FFB74D',
//     },
//     info: {
//       main: '#4FC3F7',
//     },
//     success: {
//       main: '#66BB6A',
//     },
//   },

//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none', // دکمه‌ها رو حرفه‌ای‌تر می‌کنه
//           borderRadius: 8,
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
//         },
//       },
//     },
//   },
// });

// export default theme;
