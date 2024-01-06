import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from '../Store/AuthSlice';
import generalSlice from '../Store/generalSlice';

describe('Redux Store Configuration', () => {
  it('should create a store with auth and general reducers', () => {
    const store = configureStore({
      reducer: { auth: AuthSlice, general: generalSlice },
    });

    // Get the state from the store
    const state = store.getState();

    // Check if the store has the expected structure
    expect(state).toEqual({
      auth: AuthSlice(undefined, { type: 'INITIAL_ACTION' }),
      general: generalSlice(undefined, { type: 'INITIAL_ACTION' }),
    });

    // Dispatch a test action to check if the reducers are working
    store.dispatch({ type: 'TEST_ACTION' });

    // Check if the state is updated after dispatching the action
    const newState = store.getState();
    expect(newState).toEqual({
      auth: AuthSlice(state.auth, { type: 'TEST_ACTION' }),
      general: generalSlice(state.general, { type: 'TEST_ACTION' }),
    });
  });
});
