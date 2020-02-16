import React, { FC, ComponentType, ComponentProps } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Album from './Album';
import Home from './Home';
import useAuthentication, { AuthenticationProvider } from './useAuthentication';
import { NewReleasesProvider } from './useNewReleases';

const withContextProviders = (AppComponent: ComponentType) => (props: ComponentProps<typeof AppComponent>) => (
  <AuthenticationProvider>
    <NewReleasesProvider>
      <AppComponent {...props} />
    </NewReleasesProvider>
  </AuthenticationProvider>
);

const App: FC = () => {
  const { isFetching: isFetchingAccessToken, error: authenticationError } = useAuthentication();

  if (isFetchingAccessToken) {
    return <>Loading...</>;
  }

  if (authenticationError) {
    return <>{authenticationError}</>;
  }

  return (
    <Router>
      <Switch>
        <Route path="/album/:id" component={Album} />
        <Route exact={true} path="/" component={Home} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default withContextProviders(App);
