import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { setDeleteModal } from '../../slices/modalsSlice';
import type { RootState } from '../../slices';
import axios from 'axios';
import { deleteUser } from '../../slices/usersSlice';
import { setActiveUser } from '../../slices/activeUserSlice';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const ModalDelete = () => {
  const [disabledButtonStatus, setDisabledButtonStatus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const deleteModalStatus = useSelector((state: RootState) => state.modals.deleteModalStatus);
  const activeUser = useSelector((state: RootState) => state.activeUser.activeUser);

  const notify = (name: string, lastName: string) => toast.success(`Пользователь ${name} ${lastName} удалён`);

  const handleDelete = async () => {
    if (!activeUser) return;
    setDisabledButtonStatus(true);
    try {
      await axios.delete(`https://6899ced8fed141b96ba0cce6.mockapi.io/users/${activeUser.id}`);
      dispatch(deleteUser(activeUser));
      dispatch(setActiveUser(null));
      dispatch(setDeleteModal(false));
      navigate('/users');
      if (location.pathname.includes(`/users/${activeUser.id}`)) {
        navigate('/users');
      }
      notify(activeUser.firstName, activeUser.lastName);
    } catch (e) {
      console.log(e);
    } finally {
      setDisabledButtonStatus(false);
    }
  }

  return (
    <Dialog open={deleteModalStatus} onClose={() => dispatch(setDeleteModal(false))} fullWidth maxWidth="sm" disableRestoreFocus>
      <DialogTitle>Вы действительно хотите удалить пользователя?</DialogTitle>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button disabled={disabledButtonStatus} onClick={() => dispatch(setDeleteModal(false))} variant="text" color="primary" sx={{ minWidth: 140 }}>
          Отмена
        </Button>
        <Button disabled={disabledButtonStatus} onClick={handleDelete} variant="contained" color="error" sx={{ minWidth: 140 }}>
          {!disabledButtonStatus ? 'Удалить' : 'Удаление...'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalDelete;