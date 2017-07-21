import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface AppProps extends RouteComponentProps<{}> {

}

const App = (props: AppProps) => (
  <div>
    Let's get started!
  </div>
);

export default App;
