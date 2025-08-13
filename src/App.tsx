import { Routes, Route, Navigate } from 'react-router-dom'
import MainPage from './pages/MainPage'
import UserPage from './pages/UserPage'
import ModalDelete from './components/modals/ModalDelete'
import ModalCreate from './components/modals/ModalCreate'
import ModalEdit from './components/modals/ModalEdit'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/users" element={<MainPage />} />
        <Route path="/users/:userId" element={<UserPage />} />
        <Route path="/*" element={<Navigate to='/users' />}/>
      </Routes>
      <ToastContainer />
      <ModalDelete />
      <ModalCreate />
      <ModalEdit />
    </>
  );
}

export default App;