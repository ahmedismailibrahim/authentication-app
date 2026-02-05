import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import themeReducer from '../features/theme/themeSlice';

export const store = configureStore({
  reducer: {
        user: userReducer,  
        theme: themeReducer,
    },
    devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});