import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Home from './components/Home.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Login/>
      },
      {
        path: "/register",
        element: <Register/>
      },
      {
        path: "/home/:uId",
        element: <Home/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
)
