import { Button, Container, Stack, Typography, Avatar, Card, CardContent, Box } from '@mui/material'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../slices';
import { setDeleteModal, setEditModal } from '../slices/modalsSlice'
import { setActiveUser } from '../slices/activeUserSlice'

const formatDate = (iso: string) =>{
  return new Intl.DateTimeFormat('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
}
  

const UserPage = () => {
  const activeUser = useSelector((state: RootState) => state.activeUser.activeUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch(setDeleteModal(true));
    dispatch(setActiveUser(activeUser));
  }

  return (
    <>
      <Header hideCreateButton={true}/>
      <Container maxWidth="lg" sx={{ py: 4, pt: 12 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')}>На главную</Button>
        </Stack>
        {activeUser && (
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '160px 1fr' },
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Box display="flex" justifyContent="center">
                  <Avatar
                    src={activeUser.avatar}
                    alt={`${activeUser.firstName} ${activeUser.lastName}`}
                    sx={{ width: 128, height: 128 }}
                  />
                </Box>
                <Stack spacing={1.5}>
                  <Typography variant="h5" fontWeight={700}>
                    {activeUser.firstName} {activeUser.lastName}
                  </Typography>
                  <Typography color="text.secondary">Возраст: {activeUser.age}</Typography>
                  <Typography color="text.secondary">Дата создания: {formatDate(activeUser.createdAt)}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        dispatch(setEditModal(true));
                      }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleOpen}
                    >
                      Удалить
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}

export default UserPage;