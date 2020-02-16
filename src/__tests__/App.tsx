import React from 'react';
import { BrowserRouter, Router } from 'react-router-dom';

import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import App from '../App';

jest.mock('../useAuthentication', () => {
  const useAuthenticationModule = jest.requireActual('../useAuthentication');
  return {
    ...useAuthenticationModule,
    __esModule: true,
    default: () => {
      return {
        isFetching: false,
        error: null,
        accessToken: 'access_token',
        renewAccessToken: jest.fn(),
      };
    },
  };
});

jest.mock('react-router-dom', () => {
  const reactRouterDomModule = jest.requireActual('react-router-dom');
  return { ...reactRouterDomModule, BrowserRouter: jest.fn() };
});

const MockedBrowserRouter = BrowserRouter as jest.Mock;

describe('App', () => {
  it('redirects the user to home if the user tries to access undefined routes.', () => {
    const history = createMemoryHistory({ initialEntries: ['/undefined/path'] });
    MockedBrowserRouter.mockImplementation(({ children }) => <Router history={history}>{children}</Router>);

    expect(history.entries).toMatchObject([{ pathname: '/undefined/path' }]);
    render(<App />);
    expect(history.entries).toMatchObject([{ pathname: '/' }]);
  });
});
