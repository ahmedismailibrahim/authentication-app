import { Route, createBrowserRouter, createRoutesFromElements,Navigate } from 'react-router-dom';
import './App.css';
import RootLayout from './components/RootLayout';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Dashboard from './pages/auth/Dashboard';
import { RouterProvider } from 'react-router-dom';
import Cookies from 'js-cookie';
import RequireAuth from './components/auth/RequireAuth';

function App() {
  const accessToken = Cookies.get("accessToken");
  // if (!accessToken) {
  //   return <Navigate to="/auth/login" replace />;
  // }


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<h2>Welcome to Auth App</h2>} />
        <Route path="auth">
          <Route path="login" element={
            accessToken? <Navigate to="/dashboard" replace />:<Login />} />
          <Route path="signup" element={
            accessToken? <Navigate to="/dashboard" replace />:<Signup />} />
        </Route>
        <Route path="dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
          } />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
