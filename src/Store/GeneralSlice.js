import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isComposing: false,
  isNavOpen: true,
  isReading: false,
  editorStartContent: {
    to: "",
    subject: "",
    content: "",
    draftId: null,
    mini: false,
  },
  editorContent: { to: "", subject: "", content: "" },
  readingIndex: null,
};

const GeneralSlice = createSlice({
  name: "GeneralSlice",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    openNav(states) {
      states.isNavOpen = true;
    },
    closeNav(states) {
      states.isNavOpen = false;
    },
    openCompose: (state) => {
      state.isComposing = true;
      state.editorStartContent.mini = false;
    },
    openComposingDraft: (state, action) => {
      state.editorContent = action.payload.data;
      state.editorStartContent = action.payload.data;
      state.isComposing = true;
    },
    closeCompose: (state) => {
      state.isComposing = false;
      state.editorStartContent = {
        ...state.editorContent,
        mini: true,
        draftId: state.editorStartContent.draftId,
      };
    },
    changeEditorContent: (state, action) => {
      if (action.payload.type === "to") {
        state.editorContent.to = action.payload.to;
      } else if (action.payload.type === "subject") {
        state.editorContent.subject = action.payload.subject;
      } else if (action.payload.type === "content") {
        state.editorContent.content = action.payload.content;
      }
    },
    deletingCompose: (state) => {
      state.isComposing = false;
      state.editorContent = { to: "", subject: "", content: "" };
      state.editorStartContent = {
        to: "",
        subject: "",
        content: "",
        mini: false,
      };
    },
    openReadingIndex: (state, action) => {
      state.readingIndex = action.payload.index;
      state.isReading = true;
      state.isNavOpen = false;
    },
    closeReading: (state) => {
      state.isReading = false;
      state.readingIndex = null;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  openNav,
  closeNav,
  openCompose,
  closeCompose,
  openComposingDraft,
  changeEditorContent,
  deletingCompose,
  openReadingIndex,
  closeReading,
} = GeneralSlice.actions;

export default GeneralSlice.reducer;
