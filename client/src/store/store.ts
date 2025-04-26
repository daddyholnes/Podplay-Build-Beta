import { configureStore } from '@reduxjs/toolkit';
import { configApi } from '../data-provider/config';
import { userApi } from '../data-provider/user';
import { endpointsApi } from '../data-provider/Endpoints';

const store = configureStore({
  reducer: {
    [configApi.reducerPath]: configApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [endpointsApi.reducerPath]: endpointsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      configApi.middleware,
      userApi.middleware,
      endpointsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
