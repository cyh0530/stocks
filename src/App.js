import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Single from "./single/Single"
import Main from "./main/Main";

function App() {
  const dataURL =
    "https://script.google.com/a/uw.edu/macros/s/AKfycbzdeg0uAW8TFykGSnDPjMxYhAayyAfcQEnuByZm7ykEKiXJbdk/exec?";
  const [stockData, setStockData] = useState({});
  useEffect(() => {
    /*
    fetch(dataURL + "mode=custom-single&symbol=tsla", {
      mode: "no-cors"
    })
      .then((res) => {
        console.log(res)
        return res.json();
      })
      .then((data) => {
        console.log(data)
        setStockData(data);
      })
      .catch((err) => {
        console.error(err);
        message.error("Something went wrong, please come back later");
      });
      */
  }, []);
  return (
    <div style={{ padding: 10 }}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/:symbol" component={Single} />
          <Route exact path="/" component={Main} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
