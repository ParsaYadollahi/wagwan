export default {
    palette: {
      primary: {
        light: '#ffffff',
        main: '#b3e5fc',
        dark: '#c7c7c7',
        contrastText: '#000',
      },
      secondary: {
        light: '#63a4ff',
        main: '#1976d2',
        dark: '#004ba0',
        contrastText: '#fff',
      }
    },
    typography: {
      useNextVariants: true
    },

    spreadThis: {
      form: {
        textAlign: 'center'
      },
      image: {
          height: 60,
          margin: '20px auto 10px auto'
      },
      pageTitle: {
          margin: '10px auto 10px auto'
      },
      TextField: {
          margin: '10px auto 10px auto'
      },
      button: {
          marginTop: 20,
          position: 'relative'
      },
      LoginError: {
          color: 'red',
          fontSize: '12px',
          marginTop: '10px'
      },
      loading: {
          position: 'absolute'
      },
      invisibleSep: {
        border: 'none',
        margin: 4
      },
      visibleSep: {
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0,0.1)',
        marginBottom: '5px'
      },
      paper: {
        padding: 20
      },
      profile: {
        '& .image-wrapper': {
          textAlign: 'center',
          position: 'relative',
          '& button': {
            position: 'absolute',
            top: '80%',
            left: '70%'
          }
        },
        '& .profile-image': {
          width: 200,
          height: 200,
          objectFit: 'cover',
          maxWidth: '100%',
          borderRadius: '50%'
        },
        '& .profile-details': {
          textAlign: 'center',
          '& span, svg': {
            verticalAlign: 'middle'
          },
          '& a': {
            color: "#b3e5fc"
          }
        },
        '& hr': {
          border: 'none',
          margin: '0 0 10px 0'
        },
        '& svg.button': {
          '&:hover': {
            cursor: 'pointer'
          }
        }
      },
      buttons: {
        textAlign: 'center',
        '& a': {
          margin: '20px 10px'
        }
      },
      commentImage: {
        maxWidth: '100%',
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    commentData: {
        marginLeft: 20
    }
    }
  }
