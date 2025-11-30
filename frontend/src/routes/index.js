import SignInPage from "../pages/SignInPage/SignInPage.jsx";
import SignUpPage from "../pages/SignUpPage/SignUpPage.jsx";

export const routes = [
  {
    path: "/",
    page: SignInPage,
    isShowHeader: false,
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
];
