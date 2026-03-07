import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/LoginContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import RootLayout from './components/common/RootLayout.jsx';
import TotalBlogsPage from './components/common/TotalBlogsPage.jsx';
import AddToWishlist from './components/common/AddToWishlist.jsx'
import BlogPage from './components/common/BlogPage.jsx';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import  Home from './components/common/Home.jsx';
import AddPost from './components/writer/AddPost.jsx';
import WriterBlogs from './components/writer/WriterBlogs.jsx';
import UserProfile from './components/user/UserProfile.jsx';
import WriterProfile from './components/writer/WriterProfile.jsx'
import UserDashboard from './components/user/UserDashboard.jsx';
import WriterDashboard from './components/writer/WriterDashboard.jsx';
import EditProfile from './components/user/EditProfile.jsx';
import Register from './components/common/Register.jsx';
import Login from './components/common/Login.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [

      // ✅ HOME PAGE
      {
        index: true,
        element: <Home />
      },

      {
        path: "signin",
        element: <Login />
      },
      {
        path: "signup",
        element: <Register />
      },

      // ================= USER =================
      {
        path: "user",
        element: <UserProfile />,
        children: [
          {
            index: true,
            element: <UserDashboard />
          },
          {
            path: "profile",
            element: <UserDashboard />
          },
          {
            path: "edit-profile",
            element: <EditProfile />
          },
          {
            path: "totalblogspage",
            element: <TotalBlogsPage />
          },
          {
            path: "wishlist",
            element: <AddToWishlist />
          },
          {
            path: ":blogpageid",
            element: <BlogPage />
          }
        ]
      },

      // ================= WRITER =================
      {
        path: "writer",
        element: <WriterProfile />,
        children: [
          {
            index: true,
            element: <WriterDashboard />
          },
          {
            path: "profile",
            element: <WriterDashboard />
          },
          {
            path: "edit-profile",
            element: <EditProfile />
          },
          {
            path: "totalblogspage",
            element: <TotalBlogsPage />
          },
          {
            path: "wishlist",
            element: <AddToWishlist />
          },
          {
            path: ":blogpageid",
            element: <BlogPage />
          },
          {
            path: "addpost",
            element: <AddPost />
          },
          {
            path: "writerblogs",
            element: <WriterBlogs />
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </ThemeProvider>
)
