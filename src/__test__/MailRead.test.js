import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import MailRead from "../Components/Read/MailRead";

const mockStore = configureStore();

const initialState = {
  auth: {
    userInfo: {
      networkEmail: "test@example.com",
    },
  },
  general: {
    readingIndex: 0,
  },
  mail: {
    sentMails: [
      [
        /* sent mail data */
      ],
    ],
    inboxMails: [
      [
        /* inbox mail data */
      ],
    ],
    trashMails: [
      [
        /* trash mail data */
      ],
    ],
  },
};

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

describe("MailRead component", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it("renders MailRead component correctly", () => {
    render(
      <Provider store={store}>
        <MailRead />
      </Provider>
    );

    expect(screen.getByText("Read Mail")).toBeInTheDocument();
  });

  it("dispatches actions when buttons are clicked", () => {
    render(
      <Provider store={store}>
        <MailRead />
      </Provider>
    );

    // Mock readingContent for testing
    const readingContent = {
      editorContent: {
        subject: "Test Subject",
        to: "test@example.com",
        content: "<p>Test Content</p>",
      },
      senderInfo: {
        name: "John Doe",
        photoUrl: "/path/to/photo.jpg",
      },
      isFavorite: false,
    };

    useSelector.mockReturnValue(readingContent);

    fireEvent.click(screen.getByText("Favorite"));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UPDATE_MAILS",
        payload: expect.objectContaining({
          isFavorite: true,
        }),
      })
    );
  });
});
