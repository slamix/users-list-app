import { AppBar, Toolbar, Typography, Container, Button, IconButton } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import { useDispatch } from 'react-redux'
import { setCreateModal } from '../slices/modalsSlice'

const Header = ({ hideCreateButton } : { hideCreateButton: boolean}) => {
  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch(setCreateModal(true));
  }

  return (
    <AppBar position="fixed" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            component={RouterLink}
            to="/users"
            variant="h6"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            Users list app
          </Typography>

          {!hideCreateButton ? (
            <>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
              >
                Создать пользователя
              </Button>

              <IconButton
                color="inherit"
                onClick={handleOpen}
                sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
              >
                <AddIcon />
              </IconButton>
            </>
          ): null}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
