import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, Avatar, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { UserFormValues } from '../../types/types'
import type { RootState } from '../../slices'
import { useSelector, useDispatch } from 'react-redux'
import { setEditModal } from '../../slices/modalsSlice'
import { setActiveUser } from '../../slices/activeUserSlice'
import { updateUser } from '../../slices/usersSlice'
import axios from 'axios'
import { toast } from 'react-toastify'

const ModalEdit = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.activeUser.activeUser);
  const editModalStatus = useSelector((state : RootState) => state.modals.editModalStatus);
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, clearErrors, reset } = useForm<UserFormValues>({
    mode: 'onSubmit',
    defaultValues: { firstName: '', lastName: '', age: '' },
  });

  const notify = () => toast.success('Пользователь успешно изменён');

  useEffect(() => {
    if (editModalStatus) {
      reset({
        firstName: user?.firstName,
        lastName: user?.lastName,
        age: String(user?.age),
      });
      clearErrors();
    }
  }, [user, editModalStatus, reset, clearErrors]);

  const submit = handleSubmit(async ({ firstName, lastName, age }) => {
    if (!user) return;

    if (firstName.trim().length > 20) {
      setError('firstName', { type: 'custom', message: 'Имя не должно превышать 20 символов' });
      return;
    }
    if (lastName.trim().length > 20) {
      setError('lastName', { type: 'custom', message: 'Фамилия не должна превышать 20 символов' });
      return;
    }

    const trimmedFirst = firstName.replace(/\s+/g, ' ').trim();
    const trimmedLast = lastName.replace(/\s+/g, ' ').trim();

    const prevFirst = user.firstName;
    const prevLast = user.lastName;
    const prevAge = user.age;

    const nextFirstName = trimmedFirst === '' || trimmedFirst === prevFirst ? prevFirst : trimmedFirst;
    const nextLastName = trimmedLast === '' || trimmedLast === prevLast ? prevLast : trimmedLast;
    const nextAge = age === '' || Number(age) === prevAge ? String(prevAge) : age;

    const validFirst = nextFirstName[0].toUpperCase() + nextFirstName.slice(1).toLowerCase();
    const validLast = nextLastName[0].toUpperCase() + nextLastName.slice(1).toLowerCase();
    const validAge = Number(nextAge);

    if (!Number.isFinite(validAge) || validAge < 0) {
      setError('age', { type: 'custom', message: 'Некорректный возраст' });
      return;
    }

    const changed = ( validFirst !== prevFirst || validLast !== prevLast || validAge !== prevAge);

    if (!changed) {
      setError('root', { type: 'custom', message: 'Вы не изменили ни одно поле' });
      return;
    }

    try {
      const { data } = await axios.put(`https://6899ced8fed141b96ba0cce6.mockapi.io/users/${user.id}`, {
        firstName: validFirst,
        lastName: validLast,
        age: validAge,
      });
      dispatch(updateUser(data));
      dispatch(setActiveUser(data));
      notify();
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(setEditModal(false));
      reset();
    }
  })

  const handleClose = () => {
    dispatch(setEditModal(false));
    reset();
  }

  return (
    <Dialog open={editModalStatus} onClose={handleClose} fullWidth maxWidth="sm" disableRestoreFocus>
      <DialogTitle>Редактирование пользователя</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ py: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user?.avatar} />
            <Typography>
              {user?.firstName} {user?.lastName}
            </Typography>
          </Stack>
          <form id="edit-user-form" onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                label="Имя"
                {...register('firstName', {
                  validate: (v) => {
                    const trimmed = v.trim();
                    if (trimmed.length > 20) return 'Имя не должно превышать 20 символов';
                    return true;
                  },
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^а-яёa-z\s-]/gi, '');
                }}
              />
              <TextField
                label="Фамилия"
                {...register('lastName', {
                  validate: (v) => {
                    const trimmed = v.trim();
                    if (trimmed.length > 20) return 'Фамилия не должна превышать 20 символов';
                    return true;
                  },
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^а-яёa-z\s-]/gi, '');
                }}
              />
              <TextField
                label="Возраст"
                type="number"
                inputProps={{ min: 0 }}
                {...register('age')}
                error={!!errors.age}
                helperText={errors.age?.message}
              />
            </Stack>
            {errors.root?.message && (
              <Typography color="error">{errors.root?.message}</Typography>
            )}
          </form>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="text" color="primary" sx={{ minWidth: 140 }}>
          Закрыть
        </Button>
        <Button type="submit" form="edit-user-form" variant="contained" sx={{ minWidth: 140 }} disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalEdit;
