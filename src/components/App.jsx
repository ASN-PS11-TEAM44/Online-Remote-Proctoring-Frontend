import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./Login.jsx";
import { Registration } from "./Registration.jsx";
import { Home } from "./Home.jsx";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/register" exact>
          <Registration />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
