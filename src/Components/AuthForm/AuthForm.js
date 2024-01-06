import axios from "axios";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthAction } from "../../Store/AuthSlice";
import { startLoading, stopLoading } from "../../Store/GeneralSlice";
import { getMails } from "../../Store/MailAction";

const AuthForm = () => {
  const [isLogging, setIsLogging] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiToken = useSelector((state) => state.auth.apiToken);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const error = useSelector((store) => store.auth.error);

  console.log(userInfo);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(AuthAction.clearError());

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (!isLogging) {
      const name = nameRef.current.value;
      const confirm = confirmRef.current.value;
      if (password === confirm) {
        try {
          const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiToken}`,
            {
              email,
              password,
              returnSecureToken: true,
            }
          );
          const idToken = response.data.idToken;
          await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiToken}`,
            {
              idToken,
              displayName: name,
              returnSecureToken: false,
            }
          );
          e.target.reset();
          setIsLogging(!isLogging);
        } catch (error) {
          console.error("Authentication Error:", error);
          dispatch(
            AuthAction.setError("Authentication Error: " + error.message)
          );
        } finally {
          dispatch(stopLoading());
        }
      } else {
        alert("Password does not match");
      }
    } else {
      dispatch(startLoading());
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiToken}`,
          { email, password, returnSecureToken: true }
        );
        localStorage.setItem("idToken", response.data.idToken);
        // setTimeout(() => {
        //   localStorage.removeItem("isToken");
        // }, 1000 * 60 * 15);
        const reply = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiToken}`,
          { idToken: response.data.idToken }
        );
        const newUserInfo = {
          idToken: response.data.idToken,
          name: reply.data.users[0].displayName,
          email: reply.data.users[0].email,
          emailVerified: reply.data.users[0].emailVerified,
          networkEmail: reply.data.users[0].email.replace(/[^a-zA-Z0-9]/gi, ""),
          photoUrl: reply.data.users[0].photoUrl,
        };
        if (!reply.data.users[0].emailVerified.emailVerified) {
          await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiToken}`,
            { requestType: "VERIFY_EMAIL", idToken: response.data.idToken }
          );
        }
        e.target.reset();
        dispatch(AuthAction.setUser({ userInfo: newUserInfo }));
        dispatch(getMails(newUserInfo.networkEmail, "login"));
        navigate("/");
      } catch (error) {
        console.error("Authentication Error:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const errorCode = error.response.data.error.code;
          const errorMessage = error.response.data.error.message;
          if (errorCode === "auth/email-already-in-use") {
            dispatch(
              AuthAction.setError(
                "Email is already in use. Please use a different email."
              )
            );
          }
        } else {
          dispatch(
            AuthAction.setError("Authentication Error: " + error.message)
          );
        }
      } finally {
        dispatch(stopLoading());
      }
    }
  };

  const forgotPasswordHandler = async () => {
    const email = prompt("Enter your email:");
    if (email) {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiToken}`,
        { requestType: "PASSWORD_RESET", email }
      );
    }
  };

  return (
    <>
      <div
        className="w-screen bg-center bg-cover"
        style={{
          backgroundImage: `url(${"https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"})`,
        }}
      >
        <div className="flex justify-center items-center h-screen bg-opacity-20">
          <div
            className="rounded-lg shadow-2xl p-6 mx-auto relative border border-amber-50 border-opacity-40 backdrop-blur-md"
            style={{ width: "380px" }}
          >
            <h2 className="text-xl text-amber-50 text-center font-semibold">
              Welcome to your MailCraft
            </h2>
            <h2 className="text-2xl text-amber-50 text-center font-semibold">
              {isLogging ? "Log In" : "Sign Up"}
            </h2>
            <div className="my-4">
              <form onSubmit={submitHandler}>
                {error && <h2 className="text-red-900">{error}</h2>}
                {!isLogging && (
                  <div className="mb-3">
                    <input
                      type="text"
                      required
                      ref={nameRef}
                      className="w-full outline-emerald-700 bg-amber-50 rounded text-emerald-800 h-9 p-3"
                      placeholder="Name"
                    />
                  </div>
                )}
                <div className="mb-3">
                  <input
                    type="email"
                    required
                    ref={emailRef}
                    className="w-full outline-emerald-700 bg-amber-50 rounded text-emerald-800 h-9 p-3"
                    placeholder="Email"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    required
                    name="password"
                    ref={passwordRef}
                    minLength={8}
                    className="w-full outline-emerald-700 bg-amber-50 rounded text-emerald-800 h-9 p-3"
                    placeholder="Password"
                  />
                </div>
                {!isLogging && (
                  <div className="mb-3">
                    <input
                      type="password"
                      required
                      name="confirm"
                      ref={confirmRef}
                      minLength={8}
                      className="w-full outline-emerald-700 bg-amber-50 rounded text-emerald-800 h-9 p-3"
                      placeholder="Confirm Password"
                    />
                  </div>
                )}
                <div>
                  <button
                    type="submit"
                    className="bg-emerald-800 w-full border rounded p-1.5 hover:bg-emerald-900 font-semibold text-emerald-50"
                  >
                    {isLogging ? "Log In" : "Sign Up"}
                  </button>
                </div>
              </form>
              {isLogging && (
                <div className="text-center text-emerald-800 hover:text-emerald-900 font-medium">
                  <button className="p-1.5" onClick={forgotPasswordHandler}>
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-emerald-800 w-full border rounded p-1.5 hover:bg-emerald-900 font-semibold text-emerald-50"
              onClick={() => setIsLogging(!isLogging)}
            >
              {isLogging
                ? "Don't have an account? Sign Up"
                : "Have an account? Log In"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
