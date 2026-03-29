// API Configuration and helper functions

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

// Get the auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Set the auth token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Remove the auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

// Get user from localStorage
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Logout user
export const logout = () => {
  removeAuthToken();
  window.location.href = "/login";
};

// Registration API
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login API
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Get Authorization header with token
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
