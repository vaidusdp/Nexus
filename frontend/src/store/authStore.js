import { create } from 'zustand';
import API from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),

  checkAuth: async () => {
    try {
      set({ loading: true });
      const response = await API.get('/users/current-user'); 
      if (response.data?.success) {
        set({ user: response.data.data, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({loading: true});
  
      const response = await API.post("/users/login", {email, password});
  
      if(response.data?.success){
        try {
          set({
            user: response.data.data,
            isAuthenticated: true
          });
          return { success: true };
        } catch (error) {
          console.error("Login Network/Auth Error: ", error.response?.data || error.message);
          const errorMessage = error.response?.data?.message || "Invalid email or password";

          set({ user: null, isAuthenticated: false });
          
          return {
            success: false,
            message: errorMessage
          }
        } finally {
          set({ loading: false });
        }
      }
    } catch (error) {
      
    }
  },

  logout: async () => {
    try {
      await API.post('/users/logout'); 
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  }
}));