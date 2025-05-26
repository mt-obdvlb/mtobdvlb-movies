import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import store from './redux/store.ts'
import {Provider} from 'react-redux'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router'
import Home from './pages/Home.tsx'
import Login from './pages/Auth/Login.tsx'
import Register from './pages/Auth/Register.tsx'
import PrivateRoute from './pages/Auth/PrivateRoute.tsx'
import Profile from './pages/User/Profile.tsx'
import AdminRoute from './pages/Admin/AdminRoute.tsx'
import GenreList from './pages/Admin/GenreList.tsx'
import CreateMovie from './pages/Admin/CreateMovie.tsx'
import AdminMoviesList from './pages/Admin/AdminMoviesList.tsx';
import UpdateMovie from './pages/Admin/UpdateMovie.tsx';
import AllMovies from './pages/Movies/AllMovies.tsx';
import MovieDetail from './pages/Movies/MovieDetail.tsx';
import AllComments from './pages/Admin/AllComments.tsx';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index={true} path={'/'} element={<Home/>}/>
      <Route path={'/login'} element={<Login/>}/>
      <Route path={'/movies'} element={<AllMovies/>}/>
      <Route path={'/register'} element={<Register/>}/>
      <Route path={''} element={<PrivateRoute/>}>
        <Route path={'/movies/:id'} element={<MovieDetail/>}/>

        <Route path={'/profile'} element={<Profile/>}/>
      </Route>
      <Route path={''} element={<AdminRoute/>}>
        <Route path={'/admin/movies/genre'} element={<GenreList/>}/>
        <Route path={'/admin/movies/create'} element={<CreateMovie/>}/>
        <Route path={'/admin/movies-list'} element={<AdminMoviesList/>}/>
        <Route path={'/admin/movies/update/:id'} element={<UpdateMovie/>}/>
        <Route path='/admin/movies/comments' element={<AllComments/>}/>
        <Route path='/admin/movies/dashboard' element={<AdminDashboard/>}/>
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)
