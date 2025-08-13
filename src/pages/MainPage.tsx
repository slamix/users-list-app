import Header from '../components/Header'
import { Container, Stack, Typography } from '@mui/material'
import UsersTable from '../components/UsersTable'

const MainPage = () => {
  return (
    <>
      <Header hideCreateButton={false}/>
      <Container maxWidth="lg" sx={{ py: 4, pt: 12 }} >
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>Список пользователей</Typography>
        </Stack>
        <UsersTable />
      </Container>
    </>
  );
}

export default MainPage;
