import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import NotesList from './features/notes/NotesList'
import UsersList from './features/users/UsersList'

function App() {
  return (
   <Routes>
    {/* This handles routes after our domain then a "/" */}
    <Route path="/" element={<Layout />}>

      {/* A route to the public component */}
      <Route index element={<Public/>} />

      {/* A route to the login page */}
      <Route path="login" element={<Login/>} />

      {/* If the route is /dash then we will see the Welcome component*/}
      <Route path="dash" element={<DashLayout />}>

        <Route index element={<Welcome />} />

        {/* This is for domain/dash/notes */}
        <Route path="notes">
          <Route index element={<NotesList />} />
        </Route>

        {/* domain/dash/users */}
        <Route path="users">
          <Route index element={<UsersList />} />
        </Route>

      </Route>
    </Route>
  </Routes>
  );
}

export default App;
