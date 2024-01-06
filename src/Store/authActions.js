import axios from "axios";
import { startLoading, stopLoading } from "./GeneralSlice";
import { getFastMails, getMails } from "./MailAction";
import { AuthAction } from "./AuthSlice";

export function getUserInfo(idToken) {

  return async (dispatch) => {
    try {
      dispatch(startLoading());
      const reply = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCSn1UD10g4MmeHqeVjTOFRIP00jqDsxwc`,
        { idToken }
      );

      const newUserInfo = {
        idToken,
        name: reply.data.users[0].displayName,
        email: reply.data.users[0].email,
        emailVerified: reply.data.users[0].emailVerified,
        networkEmail: reply.data.users[0].email.replace(/[^a-zA-Z0-9]/gi, ""),
        photoUrl: reply.data.users[0].photoUrl,
      };

      dispatch(getFastMails(newUserInfo.networkEmail));
      dispatch(getMails(newUserInfo.networkEmail, "update"));
      dispatch(AuthAction.setUser({ userInfo: newUserInfo }));
    } catch (error) {
      console.error(error);
    }
    dispatch(stopLoading());
  };
}

export function logoutHandler(networkEmail) {
  return (dispatch) => {
    localStorage.removeItem("idToken");
    dispatch(getMails(networkEmail, "end"));
    dispatch(
      AuthAction.setUser({
        userInfo: {
          idToken: "",
          name: "",
          email: "",
          emailVerified: false,
          networkEmail: "",
          photoUrl: "",
        },
      })
    );
    clearInterval(localStorage.getItem("login"));
    clearInterval(localStorage.getItem("update"));
    localStorage.removeItem("login");
    localStorage.removeItem("update");
  };
}
