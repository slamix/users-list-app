import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  CircularProgress
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../slices/index';
import { setUsers, addUsers, updatePage } from '../slices/usersSlice'
import { setDeleteModal, setEditModal } from '../slices/modalsSlice'
import { setActiveUser } from '../slices/activeUserSlice'
import axios from 'axios'
import { scrollRef } from '../utils/scrollRef';

const fetchUsers = async (page: number) => {
  try {
    const { data } = await axios.get('https://6899ced8fed141b96ba0cce6.mockapi.io/users', {
      params: {
        page,
        limit: 8
      }
    });
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const UsersTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.list);
  const page = useSelector((state: RootState) => state.users.page);

  const [hasData, setHasData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (users.length === 0) {
      const loadUsers = async () => {
        setIsLoading(true);
        try {
          const data = await fetchUsers(1);
          if (data.length === 0) {
            setHasData(false);
            return;
          }
          dispatch(setUsers(data));
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoading(false);
        }
      };
      loadUsers();
    }
  }, [dispatch, users.length]);

  const handleLoadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers(page);
      if (data.length === 0) {
        setHasData(false);
        return;
      }
      dispatch(addUsers(data));
      dispatch(updatePage());
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  const isFirstPageLoading = isLoading && users.length === 0;
  const isMoreLoading = isLoading && users.length > 0;
  const noUsers = !isLoading && users.length === 0;
  const canLoadMore = !isLoading && hasData && users.length > 0;
  const allLoaded = !isLoading && !hasData && users.length > 0;

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 2,
          overflowX: { xs: 'auto', sm: 'visible' },
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Table
          size="medium"
          aria-label="users table"
          sx={{ tableLayout: 'fixed', minWidth: { xs: 720, sm: 'auto' } }}
        >
          <colgroup>
            <col style={{ width: '10%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '35%' }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Имя</TableCell>
              <TableCell align="center">Фамилия</TableCell>
              <TableCell align="center">Возраст</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFirstPageLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : noUsers ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Пользователей нет
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Но вы можете создать их
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    dispatch(setActiveUser(user));
                    navigate(`/users/${user.id}`);
                  }}
                >
                  <TableCell align="center">{user.id}</TableCell>
                  <TableCell align="center">{user.firstName}</TableCell>
                  <TableCell align="center">{user.lastName}</TableCell>
                  <TableCell align="center">{user.age}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setActiveUser(user));
                          dispatch(setEditModal(true));
                        }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setActiveUser(user));
                          dispatch(setDeleteModal(true));
                        }}
                      >
                        Удалить
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        {isMoreLoading && <CircularProgress />}
        {canLoadMore && (
          <Button variant="outlined" onClick={handleLoadUsers}>
            Показать ещё
          </Button>
        )}
        {allLoaded && (
          <Typography variant="body2" color="text.secondary">
            Все пользователи загружены
          </Typography>
        )}
        <div ref={scrollRef}/>
      </Box>
    </>
  );
};

export default UsersTable;
