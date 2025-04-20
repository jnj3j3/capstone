import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "../mainPage/mainPage";
import DefaultLayout from "./defaultLayout";
import MyPage from "../myPage/myPage";
import SearchPage from "../searchPage/searchPage";
import ReservationPage from "../reservationPage/reservationPage";
import { Login } from "../loginPage/component/login";
import CreateTicketPage from "../ticketPage/create/createTicketPage";
import TicketPage from "../ticketPage/ticket/ticketPage";
const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/myPage",
        element: <MyPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/reservation",
        element: <ReservationPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/ticket/create",
        element: <CreateTicketPage />,
      },
      {
        path: "/ticket/:id",
        element: <TicketPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
