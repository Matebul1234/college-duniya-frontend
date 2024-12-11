
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import UserNotes from './components/User_Notes';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        {/* <Route path='/notes' element={<UserNotes />} /> */}
        <Route path='/notes' element={
          <ProtectedRoute>
            <UserNotes />
          </ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
