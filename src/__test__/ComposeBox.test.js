import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ComposeBox from "../Components/Compose/ComposeBox";
import {
  closeCompose,
  changeEditorContent,
  deletingCompose,
} from "../Store/generalSlice";

const mockStore = configureStore([]);

describe("ComposeBox", () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({
      general: {
        editorStartContent: {
          to: "recipient@example.com",
          subject: "Test Subject",
          content: "Test Content",
          draftId: "123456",
        },
        editorContent: {
          to: "recipient@example.com",
          subject: "Test Subject",
          content: "Test Content",
          draftId: "123456",
        },
      },
      mail: {
        fireBase: "https://react-mailbox-3e595-default-rtdb.firebaseio.com/",
      },
      auth: {
        userInfo: {
          email: "sender@example.com",
          networkEmail: "sender@example.com",
        },
      },
    });

    component = render(
      <Provider store={store}>
        <ComposeBox />
      </Provider>
    );
  });

  it("renders with initial values", () => {
    // Add assertions based on your initial state
    expect(screen.getByPlaceholderText(/To/i).value).toBe(
      "recipient@example.com"
    );
    expect(screen.getByPlaceholderText(/Subject/i).value).toBe("Test Subject");
    // Add more assertions as needed
  });

  it("updates editor content on input change", () => {
    // Simulate user typing in the "To" field
    fireEvent.change(screen.getByPlaceholderText(/To/i), {
      target: { value: "new-recipient@example.com" },
    });

    // Assert that the Redux action is dispatched
    expect(store.getActions()).toContainEqual(
      changeEditorContent({ type: "to", to: "new-recipient@example.com" })
    );
  });

  it("closes compose on clicking the close button", () => {
    // Simulate user clicking the close button
    fireEvent.click(
      screen
        .getByText(/New Message/i)
        .closest("div")
        .querySelector("button")
    );

    // Assert that the Redux action is dispatched
    expect(store.getActions()).toContainEqual(closeCompose());
  });

  it("deletes compose on clicking the delete button", () => {
    // Simulate user clicking the delete button
    fireEvent.click(screen.getByTitle("Delete"));

    // Assert that the Redux action is dispatched
    expect(store.getActions()).toContainEqual(deletingCompose());
  });

  // Add more test cases as needed for other interactions and functionalities
});
