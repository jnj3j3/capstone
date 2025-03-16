import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "../mainPage/mainPage";
import DefaultLayout from "./defaultLayout";
import MyPage from "../myPage/myPage";
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
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
