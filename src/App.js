import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import React from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import AuthService from "src/__services__/AuthService";
import StyleWrapper from "src/StyleWrapper";
import "./style.css";
require('dotenv').config()


const App = () => {
  const currentUser = AuthService.getCurrentUser();
  const routing = useRoutes(routes(currentUser));
  return (
    <Provider store={configureStore()}>
      <StyleWrapper>
        {routing}
      </StyleWrapper>
    </Provider>
  );
};

export default App;
