import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../components/About";
import Blog from "../components/Blog";
import CreateListing from "../components/CreateListing/CreateListing";
import Register from "../components/Register/Register";
import Login from "../components/login/Login";
import Home from "../home/Home";
import HomeAfterLogin from "../home/HomeAfterLogin";
import Shop from "../shop/Shop";
import SingleBook from "../shop/SingleBook";
import ProtectedRoute from "./ProtectedRoute";
import SearchResults from "../components/SearchResults";
import BuyCart from "../components/BuyCart";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/blog",
        element: <Blog />,
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
        path: "/book-sell/:id",
        element: <SingleBook />,
      },
      {
        path: "/create-listing",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <CreateListing />,
          },
        ],
      },
      {
        path: "/HomeAfterLogin",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <HomeAfterLogin />,
          },
        ],
      },
      {
        path: "/search",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <SearchResults />,
          },
        ],
      },
      {
        path: "/view_buy_cart",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <BuyCart />,
          },
        ],
      },
    ],
  },
]);
export default router;
