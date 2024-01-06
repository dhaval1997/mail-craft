import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Inbox from "./Pages/Inbox";
import Starred from "./Pages/Starred";
import Sent from "./Pages/Sent";
import Drafts from "./Pages/Drafts";
import Trash from "./Pages/Trash";
import Root from "./Pages/Root";
import Auth from "./Pages/Auth";
import Profile from "./Pages/Profile";
import { AuthAction } from "./Store/AuthSlice";
import LoadingSpinner from "./Components/Container/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "./Store/authActions";

const App = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.general.isLoading);

  useEffect(() => {
    const storedToken = localStorage.getItem("idToken");
    if (storedToken) {
      dispatch(getUserInfo(storedToken));
    }
  }, [dispatch]);
  return (
    <>
      {loading && <LoadingSpinner />}
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Inbox />} />
          <Route path="/starred" element={<Starred />} />
          <Route path="/sent" element={<Sent />} />
          <Route path="/drafts" element={<Drafts />} />
          <Route path="/trash" element={<Trash />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </>
  );
};

export default App;
