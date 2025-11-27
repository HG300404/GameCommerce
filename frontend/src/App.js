// import React, { Fragment, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { routes } from "./routes";
// import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
// import { isJsonString } from "./utils";
// import { jwtDecode } from "jwt-decode";
// import * as UserService from "../src/services/UserService.js";
// import { useDispatch, useSelector } from "react-redux";
// import { updateUser } from "./redux/slides/userSlide";
// function App() {
//   // useEffect(() => {
//   //   fetchApi();
//   // }, []);

//   // const fetchApi = async () => {
//   //   const res = axios.get(
//   //     `${process.env.REACT_APP_API_URL}/game/details/6556355a46c90c0ec03c8ab4`
//   //   );
//   //   console.log("res", res);
//   // };
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
  
//   const handleDecoded = () => {
//     let storageData = localStorage.getItem("access_token");
//     console.log("storageData", storageData);
//     let decoded = {};
//     if (storageData && isJsonString(storageData)) {
//       storageData = JSON.parse(storageData);
//       decoded = jwtDecode(storageData);
//     }
//     return { decoded, storageData };
//   };

//   const handleGetDetailsUser = async (id, token) => {
//     try {
//       const res = await UserService.getDetailsUser(id, token);
//       dispatch(updateUser({ ...res?.data, access_token: token }));
//     } catch (error) {
//       console.error("Error getting user details:", error);
//       // Don't crash the app if API call fails
//     }
//   };

//   useEffect(() => {
//     // Set up axios interceptor only once
//     const interceptor = UserService.axiosJWT.interceptors.request.use(
//       async (config) => {
//         const currentTime = new Date();
//         const { decoded } = handleDecoded();
//         if (decoded?.exp < currentTime.getTime() / 1000) {
//           try {
//             const data = await UserService.refreshToken();
//             config.headers["token"] = `Bearer ${data?.access_token}`;
//           } catch (error) {
//             console.error("Error refreshing token:", error);
//           }
//         }
//         return config;
//       },
//       (err) => {
//         return Promise.reject(err);
//       }
//     );

//     const { storageData, decoded } = handleDecoded();
//     console.log("decoded", decoded);
//     // Chỉ gọi API khi có token hợp lệ và decoded.id tồn tại
//     if (decoded?.id && storageData) {
//       handleGetDetailsUser(decoded?.id, storageData);
//     }

//     // Cleanup interceptor on unmount
//     return () => {
//       UserService.axiosJWT.interceptors.request.eject(interceptor);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   return (
//     <div>
//       <Router>
//         <Routes>
//           {routes.map((route) => {
//             const Page = route.page;
//             const isCheckAuth = !route.isPrivate || (user?.isAdmin ?? false);
//             const Layout = route.isShowHeader ? DefaultComponent : Fragment;
//             return (
//               <Route
//                 path={route.path}
//                 key={route.path}
//                 element={
//                   isCheckAuth ? (
//                     <Layout>
//                       <Page />
//                     </Layout>
//                   ) : null
//                 }
//               />
//             );
//           })}
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;



import React, { Fragment, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // <— dùng Navigate
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "../src/services/UserService.js";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./redux/slides/userSlide";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    try {
      // token thường là chuỗi JWT, không cần JSON.parse
      if (storageData && isJsonString(storageData)) {
        storageData = JSON.parse(storageData);
      }
      if (storageData) decoded = jwtDecode(storageData);
    } catch (e) {
      console.error("decode token error:", e);
    }
    return { decoded, storageData };
  };

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Error getting user details:", error);
    }
  };

  useEffect(() => {
    const interceptor = UserService.axiosJWT.interceptors.request.use(
      async (config) => {
        const now = Date.now() / 1000;
        const { decoded } = handleDecoded();
        if (decoded?.exp && decoded.exp < now) {
          try {
            const data = await UserService.refreshToken();
            if (data?.access_token) {
              config.headers["token"] = `Bearer ${data.access_token}`;
            }
          } catch (err) {
            console.error("refresh token error:", err);
          }
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const { storageData, decoded } = handleDecoded();
    if (decoded?.id && storageData) {
      handleGetDetailsUser(decoded.id, storageData);
    }

    return () => {
      UserService.axiosJWT.interceptors.request.eject(interceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== GUARD ======
  const isAuthenticated = !!user?.access_token || !!user?.id;
  const isAdmin = !!user?.isAdmin;

  return (
    <Routes>
      {routes.map((route) => {
        const Page = route.page;
        const Layout = route.isShowHeader ? DefaultComponent : Fragment;

        // 1) Route chỉ dành cho admin
        if (route.isAdmin) {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                isAuthenticated && isAdmin ? (
                  <Layout>
                    <Page />
                  </Layout>
                ) : (
                  // chưa đăng nhập → signin; đã login nhưng không phải admin → về trang chủ
                  <Navigate to={isAuthenticated ? "/" : "/signin"} replace />
                )
              }
            />
          );
        }

        // 2) Route private (cần đăng nhập)
        if (route.isPrivate) {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                isAuthenticated ? (
                  <Layout>
                    <Page />
                  </Layout>
                ) : (
                  <Navigate to="/signin" replace />
                )
              }
            />
          );
        }

        // 3) Route public
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}

      {/* Fallback để tránh trắng màn hình nếu path không khớp */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
