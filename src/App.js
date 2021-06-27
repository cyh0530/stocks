import React, { useState, useEffect, useRef } from "react";
import { Select, Row, Col, message } from "antd";
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import { parse } from "node-html-parser";
import { decode } from "html-entities";
import Single from "./single/Single";
import Main from "./main/Main";
import { appScriptURL, summaryLink } from "./utils/Constants";

function App() {
  let stockDataInitial = {};
  for (let exchange in summaryLink) {
    stockDataInitial[exchange] = { notFetched: true };
  }
  const [stockData, setStockData] = useState(stockDataInitial);

  // eslint-disable-next-line no-unused-vars
  const stockDataTemplate = {
    exchange: {
      date: "2021/01/01",
      data: {},
    },
  };

  const [mainLastActiveTab, setMainLastActiveTab] = useState({
    exchange: "TW",
    subTab: 0,
  });

  useEffect(() => {
    // get summary exchange web url
    for (let exchange in summaryLink) {
      // skeleton on
      // const data = fetchData(summaryLink[exchange]);

      const start = new Date();
      axios
        .get(summaryLink[exchange])
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          const html = parse(res);

          const viewport = html.querySelector("#sheets-viewport");
          const lastDayTab =
            viewport.childNodes[viewport.childNodes.length - 1];
          const id = lastDayTab.id;
          const sheetMenu = html.querySelector("#sheet-menu");

          const date = sheetMenu.querySelector(`#sheet-button-${id}`)
            .childNodes[0].innerText;
          const tableBody = viewport.querySelector(`#${id} table tbody`);

          let data = {};

          data.date = date;

          for (let i = 1; i < tableBody.childNodes.length; i++) {
            const tr = tableBody.childNodes[i];

            for (let j = 1; j < tr.childNodes.length; j++) {
              const td = tr.childNodes[j];
              const text = decode(td.innerText);
              if (text === "") continue;
              const parsedText = JSON.parse(text);
              data.data = { ...data.data, ...parsedText };
            }
          }
          console.log("Fetch took " + (new Date() - start) / 1000 + "s");
          console.log(data);

          setStockData((s) => {
            return { ...s, [exchange]: data };
          });
        })
        .catch((err) => {
          console.error(err);
          setStockData((s) => {
            return {
              ...s,
              [exchange]: {
                error: "Something went wrong. Please try again later",
              },
            };
          }) 
        });

      // skeleton off
    }
  }, []);

  return (
    <div style={{ padding: 10 }}>
      <HashRouter>
        <Header />
        <div style={{ width: "95%", margin: "auto" }}>
          <Switch>
            <Route exact path={["/v0/:country/:symbol", "/:country/:symbol"]} component={Single} />
            <Route exact path={["/", "/v0"]}>
              <Main
                stockData={stockData}
                setStockData={setStockData}
                activeTab={mainLastActiveTab}
                setActiveTab={setMainLastActiveTab}
              />
            </Route>
          </Switch>
        </div>
      </HashRouter>
    </div>
  );
}

const Header = () => {
  const { Option } = Select;
  const [options, setOptions] = useState([]);
  const selectRef = useRef();

  useEffect(() => {
    fetchStockList();
  }, []);

  const fetchStockList = async () => {
    try {
      const data = await axios({
        url: appScriptURL,
        params: { mode: "stock-list" },
      }).then((res) => {
        return res.data;
      });

      setOptions(data);
    } catch (err) {
      console.error(err);
      message.error("Search Function will not work");
    }
  };
  // eslint-disable-next-line no-unused-vars
  const template = [
    { exchange: "NASDAQ", symbol: "AAPL", fullName: "Apple Inc." },
  ];

  const onSelect = (value) => {
    window.location.href = "/stocks/#/" + value;
    selectRef.current.blur();
  };

  const filterOption = (input, option) => {
    return (
      option.symbol.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      option.fullName.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  };

  const filterSort = (optionA, optionB) => {
    const symbolCompare = optionA.symbol
      .toLowerCase()
      .localeCompare(optionB.symbol.toLowerCase());
    if (symbolCompare !== 0) {
      return symbolCompare;
    }
    return optionA.fullName
      .toLowerCase()
      .localeCompare(optionB.fullName.toLowerCase());
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "95%", margin: "auto" }}>
        <Row>
          <Col xs={8} sm={8} md={6} lg={6} xl={5} xxl={4}>
            <h1>
              <Link to="/" style={{ color: "black" }}>
                Stocks
              </Link>
            </h1>
          </Col>
          <Col
            xs={16}
            sm={16}
            md={18}
            lg={18}
            xl={19}
            xxl={20}
            style={{ textAlign: "right", paddingTop: 6 }}
          >
            <Select
              ref={selectRef}
              showSearch
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={filterOption}
              filterSort={filterSort}
              onSelect={onSelect}
              notFoundContent={null}
              placeholder="Search..."
              style={{ maxWidth: "250px", width: "100%", textAlign: "left" }}
            >
              {options.map((option) => (
                <Option
                  key={`${option.country}/${option.symbol}`}
                  value={`${option.country}/${option.symbol}`}
                  symbol={option.symbol}
                  fullName={option.fullName}
                >
                  <span>
                    {option.symbol} ({option.country})
                  </span>
                  <br />
                  <small>{option.fullName}</small>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default App;
