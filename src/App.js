import React, { useState, useEffect } from "react";
import { Select, Row, Col, message } from "antd";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import { parse } from "node-html-parser";
import Single from "./single/Single";
import Main from "./main/Main";
import { appScriptURL, summaryLink } from "./utils/Constants";

function App() {
  const [stockData, setStockData] = useState({});

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      message.loading({ content: "Loading...", key: "loading", duration: 0 });
      const res = await axios
        .get(summaryLink)
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          return res;
        });

      const html = parse(res);
      const tabs = new Map();

      const viewport = html.querySelector("#sheets-viewport");
      viewport.childNodes.forEach((node) => {
        tabs.set(node.id, { id: node.id, key: node.id });
      });

      const sheetMenu = html.querySelector("#sheet-menu");
      tabs.forEach((value, id) => {
        const tabName = sheetMenu.querySelector(`#sheet-button-${id}`)
          .childNodes[0].innerText;
        tabs.set(id, {
          ...tabs.get(id),
          name: tabName,
        });
      });
      let data = {};

      tabs.forEach((value, id) => {
        const tableBody = viewport.querySelector(`#${id} table tbody`);

        let minusIndex = 1;

        while (tableBody.childNodes.length - minusIndex > 1) {
          const tr =
            tableBody.childNodes[tableBody.childNodes.length - minusIndex];
          // date = tr.childNodes[1].innerText;
          let index = 2;
          for (index = 2; index < tr.childNodes.length; index++) {
            const td = tr.childNodes[index];
            const text = td.innerText.replace(/&quot;/g, '"').replace(/&apos;/g, '\'');
            if (text === "") break;
            const parsedText = JSON.parse(text);
            data[value.name] = { ...data[value.name], ...parsedText };
          }
          if (index > 2) break;

          minusIndex++;
        }
      });

      setStockData(data);
      message.success({
        content: "Finish loading",
        key: "loading",
        duration: 0.5,
      });
    } catch (err) {
      console.error(err);
      message.error("Something went wrong. Please try again later");
    }
  };

  return (
    <div style={{ padding: 10 }}>
      <BrowserRouter basename="/stocks">
        <Header></Header>
        <div style={{ width: "95%", margin: "auto" }}>
          <Switch>
            <Route exact path="/:country/:symbol" component={Single} />
            <Route exact path="/">
              <Main stockData={stockData} />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

const Header = () => {
  const { Option } = Select;
  const [options, setOptions] = useState([]);
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
    window.location.href = "/stocks/" + value;
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
          <Col xs={24} sm={24} md={6} lg={6} xl={5} xxl={4}>
            <h1>
              <Link to="/" style={{ color: "black" }}>
                Stocks
              </Link>
            </h1>{" "}
          </Col>
          <Col
            xs={0}
            sm={0}
            md={18}
            lg={18}
            xl={19}
            xxl={20}
            style={{ textAlign: "right" }}
          >
            <Select
              showSearch
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={filterOption}
              filterSort={filterSort}
              onSelect={onSelect}
              notFoundContent={null}
              placeholder="Search..."
              style={{ width: "250px", textAlign: "left" }}
            >
              {options.map((option) => (
                <Option
                  key={`${option.country}/${option.symbol}`}
                  value={`${option.country}/${option.symbol}`}
                  symbol={option.symbol}
                  fullName={option.fullName}
                >
                  <span>{option.symbol}</span>
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
