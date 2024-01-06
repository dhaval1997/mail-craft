import authReducer, {
  logInSuccess,
  logInFailure,
  signUpSuccess,
  signUpFailure,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  clearError,
  logOut,
} from "../Store/AuthSlice";

describe("AuthSlice Reducer", () => {
  it("should handle logInSuccess", () => {
    const initialState = { userInfo: {}, error: null, apiToken: "" };
    const action = logInSuccess({
      userInfo: {
        idToken: "someToken",
        name: "John Doe",
        email: "john@example.com",
      },
    });
    const newState = authReducer(initialState, action);

    expect(newState.userInfo.idToken).toEqual("someToken");
    expect(newState.error).toBeNull();
    expect(localStorage.getItem("authToken")).toEqual("someToken");
  });

  it("should handle logInFailure", () => {
    const initialState = { userInfo: {}, error: null, apiToken: "" };
    const action = logInFailure("Login failed");
    const newState = authReducer(initialState, action);

    expect(newState.error).toEqual("Login failed");
  });

  it("should handle signUpSuccess", () => {
    const initialState = { userInfo: {}, error: null, apiToken: "" };
    const action = signUpSuccess({
      userInfo: {
        idToken: "someToken",
        name: "Jane Doe",
        email: "jane@example.com",
      },
    });
    const newState = authReducer(initialState, action);

    expect(newState.userInfo.idToken).toEqual("someToken");
    expect(newState.error).toBeNull();
    expect(localStorage.getItem("authToken")).toEqual("someToken");
  });

  it("should handle signUpFailure", () => {
    const initialState = { userInfo: {}, error: null, apiToken: "" };
    const action = signUpFailure("Sign up failed");
    const newState = authReducer(initialState, action);

    expect(newState.error).toEqual("Sign up failed");
  });

  it("should handle forgotPasswordSuccess", () => {
    const initialState = { userInfo: {}, error: "Some error", apiToken: "" };
    const action = forgotPasswordSuccess();
    const newState = authReducer(initialState, action);

    expect(newState.error).toBeNull();
  });

  it("should handle forgotPasswordFailure", () => {
    const initialState = { userInfo: {}, error: null, apiToken: "" };
    const action = forgotPasswordFailure("Forgot password failed");
    const newState = authReducer(initialState, action);

    expect(newState.error).toEqual("Forgot password failed");
  });

  it("should handle clearError", () => {
    const initialState = { userInfo: {}, error: "Some error", apiToken: "" };
    const action = clearError();
    const newState = authReducer(initialState, action);

    expect(newState.error).toBeNull();
  });

  it("should handle logOut", () => {
    const initialState = {
      userInfo: {
        idToken: "someToken",
        name: "John Doe",
        email: "john@example.com",
      },
      error: null,
      apiToken: "someApiToken",
    };

    const action = logOut();
    const newState = authReducer(initialState, action);

    expect(newState.userInfo.idToken).toEqual("");
    expect(newState.error).toBeNull();
    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
