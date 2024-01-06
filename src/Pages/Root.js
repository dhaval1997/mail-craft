import React, { useEffect } from "react";
import MainContainer from "../Components/Container/MainContainer";
import NavBar from "../Components/NavItems/NavBar";
import { Navigate, Outlet } from "react-router-dom";
import ComposeButton from "../Components/Container/ComposeButton";
import { useDispatch, useSelector } from "react-redux";
import { stopLoading } from "../Store/GeneralSlice";
import ComposeBox from "../Components/Compose/ComposeBox";
import NotificationCompose from "../Components/Compose/NotificationCompose";
import MailRead from "../Components/Read/MailRead";
import LoadingSpinner from "../Components/Container/LoadingSpinner";

const Root = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isReading = useSelector((state) => state.general.isReading);
  const isComposing = useSelector((state) => state.general.isComposing);
  const editorStartContent = useSelector(
    (state) => state.general.editorStartContent
  );
  const isLoading = useSelector((state) => state.general.isLoading);

  useEffect(() => {
    dispatch(stopLoading());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!userInfo.idToken) {
    return <Navigate to={"/auth"} />;
  }

  return (
    <>
      <MainContainer>
        {isComposing && <ComposeBox />}
        {editorStartContent.mini && <NotificationCompose />}
        <NavBar />
        <div
          className={`relative p-3 grid grid-rows-20 h-full overflow-hidden bg-zinc-800 bg-opacity-20 ${
            isReading ? "hidden sm:grid col-span-6" : "col-span-10"
          }  sm:col-span-5`}
        >
          <Outlet />
        </div>
        <div className="hidden relative p-2  h-full overflow-hidden col-span-5 bg-zinc-200 bg-opacity-40 rounded-e-lg sm:grid grid-rows-12">
          {!isReading && (
            <div className=" text-slate-800 text-opacity-95 group hover:text-opacity-100 row-start-5 row-span-4 flex flex-col justify-center items-center  p-2 mx-auto">
              <p className=" mt-1 headFont text-xl font-medium">MailCraft</p>
              <p className=" -mt-1 font-medium">Your MailBox</p>
            </div>
          )}
          {isReading && <MailRead />}
        </div>
        {isReading && (
          <div className="sm:hidden relative p-2 h-full overflow-hidden col-span-12 bg-white bg-opacity-70 rounded-lg grid grid-rows-12">
            <MailRead />
          </div>
        )}
      </MainContainer>
      {!isComposing && <ComposeButton />}
    </>
  );
};

export default Root;
