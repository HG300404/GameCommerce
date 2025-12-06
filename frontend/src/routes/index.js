import SignInPage from "../pages/SignInPage/SignInPage.jsx";
import SignUpPage from "../pages/SignUpPage/SignUpPage.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import AdminPage from "../pages/AdminPage/AdminPage.jsx";
import GameDetailsPage from "../pages/GameDetailsPage/GameDetailsPage.jsx";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivate: true,
  },
  {
    path: "/game-details/:id",
    page: GameDetailsPage,
    isShowHeader: true,
  }
];
