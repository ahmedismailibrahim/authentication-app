import React from 'react'
import { useGetUsersQuery } from '../../redux/features/users/usersApiSlice'
import { useLogoutMutation } from '../../redux/features/auth/authApiSlice';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const { data, error, isLoading } = useGetUsersQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Optionally, you can also clear any client-side state or cookies related to authentication here
      Cookies.remove("accessToken");
      navigate("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  
  return (<div>
    <h1>Dashboard</h1>
    <button type='button' onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>

    {isLoading && <p>Loading...</p>}
    {error && <p>Error: {error?.data?.message}</p>}
    {data && (
      <ul>
        {data.map(user => (
          <li key={user._id}>{user.first_name} - {user.email}</li>
        ))}
      </ul>
    )}
  </div>)

};

  export default Dashboard;