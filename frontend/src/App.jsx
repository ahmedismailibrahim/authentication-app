import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';
import RootLayout from './components/RootLayout';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import { RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<h2>Welcome to Auth App</h2>} />
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
