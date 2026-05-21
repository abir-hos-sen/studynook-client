import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Rooms from "../pages/Rooms";
import RoomDetails from "../pages/RoomDetails";
import AddRoom from "../pages/AddRoom";
import MyListings from "../pages/MyListings";
import UpdateRoom from "../pages/UpdateRoom";
import MyBookings from "../pages/MyBookings";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Profile";
import ProfileSettings from "../pages/ProfileSettings";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/rooms",
                element: <Rooms />,
            },
            {
                path: "/rooms/:id",
                element: (
                    <PrivateRoute>
                        <RoomDetails />
                    </PrivateRoute>
                ),
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/add-room",
                element: (
                    <PrivateRoute>
                        <AddRoom />
                    </PrivateRoute>
                ),
            },
            {
                path: "/my-listings",
                element: (
                    <PrivateRoute>
                        <MyListings />
                    </PrivateRoute>
                ),
            },
            {
                path: "/update-room/:id",
                element: (
                    <PrivateRoute>
                        <UpdateRoom />
                    </PrivateRoute>
                ),
            },
            {
                path: "/my-bookings",
                element: (
                    <PrivateRoute>
                        <MyBookings />
                    </PrivateRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                ),
            },
            {
                path: "/profile/settings",
                element: (
                    <PrivateRoute>
                        <ProfileSettings />
                    </PrivateRoute>
                ),
            }
        ]
    }
]);

export default router;
