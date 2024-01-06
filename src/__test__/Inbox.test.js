import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Inbox from "../Pages/Inbox";
import { BrowserRouter } from "react-router-dom";

// Mocking the Redux store
const mockStore = configureStore([]);
const initialState = {
  mail: {
    inboxMails: [
      [1, { date: "2023-01-01" }],
      [2, { date: "2023-01-02" }],
    ],
  },
};
const store = mockStore(initialState);

test("renders Inbox component", () => {
  const { getByText } = render(
    <BrowserRouter>
      <Provider store={store}>
        <Inbox />
      </Provider>
    </BrowserRouter>
  );

  // Ensure that the component renders properly
  expect(getByText("Inbox")).toBeInTheDocument();
});
