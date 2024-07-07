import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useDispatch } from 'react-redux';
import { loginUser, logoutUser } from './features/user/userSlice';
import { router, queryClient } from './router';
import Loading from './Loading';

const App = () => {
  const { isLoading, isAuthenticated, user, getIdTokenClaims } = useAuth0();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const syncAuth0WithRedux = async () => {
      if (isAuthenticated) {
        const claims = await getIdTokenClaims();
        dispatch(loginUser({
          name: user.name,
          email: user.email,
          picture: user.picture,
          token: claims.__raw,
        }));
      } else {
        dispatch(logoutUser());
      }
    };

    syncAuth0WithRedux();
  }, [isAuthenticated, user, dispatch, getIdTokenClaims]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
