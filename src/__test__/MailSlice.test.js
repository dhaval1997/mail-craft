import { configureStore } from "@reduxjs/toolkit";
import mailReducer, { MailAction } from "../Store/MailSlice";

// Initialize the store with the mailReducer
const store = configureStore({
  reducer: {
    mail: mailReducer,
  },
});

describe("MailSlice reducer", () => {
  it("should handle initial state", () => {
    expect(mailReducer(undefined, {})).toEqual({
      inboxMails: [],
      sentMails: [],
      favoriteMails: [],
      trashMails: [],
      draftsMails: [],
    });
  });

  it('should handle adding a mail to the inbox', () => {
    const newMail = { subject: 'Test Mail', content: 'This is a test mail.' };
    const action = MailAction.addMailToInbox(newMail);
    const nextState = mailReducer(undefined, action);
    expect(nextState.inboxMails).toHaveLength(1);
  });

  it("should handle marking a mail as favorite", () => {
    const initialState = {
      inboxMails: [{ id: 1, subject: "Test Mail", content: "This is a test mail." }],
      favoriteMails: [],
      sentMails: [],
      trashMails: [],
      draftsMails: [],
    };

    const action = MailAction.someActionToMarkMailAsFavorite(1);
    const nextState = mailReducer(initialState, action);

    expect(nextState.favoriteMails).toHaveLength(1);
    expect(nextState.favoriteMails[0].id).toEqual(1);
  });

  it("should handle deleting a mail", () => {
    const initialState = {
      inboxMails: [{ id: 1, subject: "Test Mail", content: "This is a test mail." }],
      favoriteMails: [],
      sentMails: [],
      trashMails: [],
      draftsMails: [],
    };

    const action = MailAction.someActionToDeleteMail(1);
    const nextState = mailReducer(initialState, action);

    expect(nextState.inboxMails).toHaveLength(0);
  });
});