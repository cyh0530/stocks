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
  const [date, setDate] = useState("");
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

      const viewport = html.querySelector("#sheets-viewport");
      const tableBody = viewport.querySelector("#0 table tbody");
      const columnsNameRow = tableBody.childNodes[0];
      let columnsName = [];
      for (let i = 0; i < columnsNameRow.childNodes.length; i++) {
        columnsName.push(columnsNameRow.childNodes[i].innerText);
      }
      let data = {};

      // read all days
      /*
        for (let i = 0; i < tableBody.childNodes.length; i++) {
          const tr = tableBody.childNodes[i];
          let rowData = {};
          const date = tr.childNodes[1].innerText;

          for (let j = 2; j < tr.childNodes.length; j++) {
            const td = tr.childNodes[j];
            const text = td.innerText.replace(/&quot;/g, '"');
            rowData[columnsName[j]] = text;
          }
          data[date] = rowData;
        }*/

      // read the last day
      let exchangeHasContent = {};
      for (let i = 1; i < columnsName.length; i++) {
        exchangeHasContent[columnsName[i]] = false;
      }
      let minusIndex = 1;
      let date;

      const allDone = () => {
        for (let exchange in exchangeHasContent) {
          if (!exchangeHasContent[exchange]) return false;
        }
        return true;
      };
      while (!allDone() && tableBody.childNodes.length - minusIndex > 1) {
        const tr =
          tableBody.childNodes[tableBody.childNodes.length - minusIndex];
        date = tr.childNodes[1].innerText;
        for (let j = 2; j < tr.childNodes.length; j++) {
          if (exchangeHasContent[columnsName[j]]) continue;
          const td = tr.childNodes[j];
          const text = td.innerText.replace(/&quot;/g, '"');
          if (text === "{}") continue;
          const parsedText = JSON.parse(text);
          data[columnsName[j]] = parsedText;
          exchangeHasContent[columnsName[j]] = true;
        }
        minusIndex++;
      }

      setStockData(data);
      setDate(date);
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
        <Header date={date}></Header>
        <div style={{ width: "95%", margin: "auto" }}>
          <Switch>
            <Route exact path="/:exchange/:symbol" component={Single} />
            <Route exact path="/">
              <Main stockData={stockData} />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

const Header = ({ date }) => {
  const { Option } = Select;
  const [options, setOptions] = useState([]);
  useEffect(() => {
    fetchStockList();
  }, []);

  const fetchStockList = async () => {
    try {
      const data = await axios
        .get(appScriptURL + "?mode=stock-list")
        .then((res) => {
          if (res.ok) return res.data;
        })
        .then((data) => {
          return data;
        });

      setOptions([]);
      // setOptions(data)
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
            <small>{date}</small>
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
                  key={`${option.exchange}/${option.symbol}`}
                  value={`${option.exchange}/${option.symbol}`}
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
