import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "../mainPage/mainPage";
import DefaultLayout from "./defaultLayout";
import MyPage from "../myPage/myPage";
import SearchPage from "../searchPage/searchPage";
import ReservationPage from "../reservationPage/reservationPage";
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
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
