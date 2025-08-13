import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import type { UserFormValues } from '../../types/types'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateModal } from '../../slices/modalsSlice'
import type { RootState } from '../../slices'
import { setActiveUser } from '../../slices/activeUserSlice'
import axios from 'axios'
import { addUser } from '../../slices/usersSlice'
import { toast } from 'react-toastify'
import { scrollRef } from '../../utils/scrollRef'

const ModalCreate = () => {
  const dispatch = useDispatch();
  const createModalStatus = useSelector((state: RootState) => state.modals.createModalStatus);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, clearErrors } = useForm<UserFormValues>({
    mode: 'onSubmit',
    defaultValues: { firstName: '', lastName: '', age: '' },
  });

  const notify = (name: string, lastName: string) => toast.success(`Пользователь ${name} ${lastName} успешно создан`);

  const submit = handleSubmit(async ({ firstName, lastName, age }) => {
    firstName = firstName.replace(/\s+/g, ' ').trim();
    lastName = lastName.replace(/\s+/g, ' ').trim();
    const validName = firstName[0].toUpperCase() + firstName.slice(1).toLowerCase();
    const validLastName = lastName[0].toUpperCase() + lastName.slice(1).toLowerCase();
    const validAge = Number(age);
    const createdAt = new Date().toISOString();
    try {
      const { data } = await axios.post('https://6899ced8fed141b96ba0cce6.mockapi.io/users', { firstName: validName, lastName: validLastName, age: validAge, createdAt });
      dispatch(addUser(data));
      notify(validName, validLastName);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(setCreateModal(false));
      reset();
    }
  })

  const handleClose = () => {
    dispatch(setActiveUser(null));
    dispatch(setCreateModal(false));
    reset();
    clearErrors();
  }

  return (
    <Dialog open={createModalStatus} onClose={handleClose} fullWidth maxWidth="sm" disableRestoreFocus>
      <DialogTitle>Создание пользователя</DialogTitle>
      <DialogContent>
        <form id="create-user-form" onSubmit={submit}>
          <Stack spacing={2} sx={{ py: 1 }}>
            <TextField
              label="Имя"
              {...register('firstName', {
                validate: (v) => {
                  const trimmed = v.trim();
                  if (trimmed === '') return 'Введите имя';
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
                  if (trimmed === '') return 'Введите фамилию';
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
              {...register('age', {
                validate: (v) => {
                  const trimmed = v.trim();
                  if (trimmed === '') return 'Введите возраст';
                  const num = Number(trimmed);
                  if (!Number.isFinite(num) || num < 0) return 'Некорректный возраст';
                  return true;
                },
              })}
              error={!!errors.age}
              helperText={errors.age?.message}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="text" color="primary" sx={{ minWidth: 140 }}>
          Закрыть
        </Button>
        <Button type="submit" form="create-user-form" variant="contained" sx={{ minWidth: 140 }} disabled={isSubmitting}>
          {isSubmitting ? 'Создание...' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalCreate;
