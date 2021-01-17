import React, { useState, useEffect } from "react";
import { Rate, Table, message, Descriptions } from "antd";
import axios from "axios";
import { singleStockColumns } from "../utils/Constants";
import { useParams } from "react-router-dom";
import { appScriptURL } from "../utils/Constants";

export default function Single() {
  const { country, symbol } = useParams();
  const [profile, setProfile] = useState({});
  const [oldDataSource, setOldDataSource] = useState([]);
  const [currentDataSource, setCurrentDataSource] = useState([]);

  useEffect(() => {
    axios({
      url: appScriptURL,
      params: {
        mode: "single",
        country: country.toUpperCase(),
        symbol: symbol.toUpperCase(),
      },
    })
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        console.log(res);
        if (res.error) {
          console.error(res.error);
          // message.error("Something went wrong. Please try again later");
          return (
            <div>
              <h2>Sorry, we don't have this stock in our database.</h2>
              <h2>Please try other stocks. Thank you!</h2>
            </div>
          );
        }
        // eslint-disable-next-line no-unused-vars
        const resultTemplate = {
          profile: {
            fullName: "",
            accuracy: {
              success: 0,
              total: 0,
              percentage: "",
            },
            // action: "",
            // status: "",
          },
          data: {
            old: [],
            current: [],
          },
        };

        document.title = `${symbol} - ${res.fullName} | Stocks`;
        setProfile(res.profile);
        setOldDataSource(res.data.old);
        setCurrentDataSource(res.data.current);
      })
      .catch((err) => {
        console.error(err);
        message.error("Unable to fetch data. Please try again later.");
      });
  }, [country, symbol]);

  const onFavoriteChange = (value) => {
    const rawFavorite = localStorage.getItem("favorite");
    const favorite = rawFavorite ? JSON.parse(rawFavorite) : {};
    const exchangeList = favorite || [];

    if (value === 0) {
      const symbolIndex = exchangeList.indexOf(symbol);
      if (symbolIndex > -1) {
        exchangeList.splice(symbolIndex, 1);
      }
    } else {
      exchangeList.push(symbol);
    }
    localStorage.setItem("favorite", JSON.stringify(favorite));
  };

  const symbolTitle = (
    <>
      {profile.fullName} ({symbol}){" "}
      <Rate count={1} onChange={onFavoriteChange} />
    </>
  );
  return (
    <div>
      <div>
        <Descriptions title={symbolTitle}>
          <Descriptions.Item label="準確率">
            {/* {profile.accuracy.percentage}% ({profile.accuracy.success} /{" "}
            {profile.accuracy.total}) */}
          </Descriptions.Item>
          {/* <Descriptions.Item label="策略">買/賣</Descriptions.Item>
          <Descriptions.Item label="股價狀態">漲/跌</Descriptions.Item> */}
        </Descriptions>
      </div>
      <div>
        <Table columns={singleStockColumns} dateSource={currentDataSource} />
      </div>
      <div>
        <h3>過往紀錄</h3>
        <Table columns={oldStockColumns} dateSource={oldDataSource} />
      </div>
    </div>
  );
}

const oldStockColumns = [
  {
    title: "獲利",
    dataIndex: "gain",
    key: "gain",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      let style = { textAlign: "right" };
      if (row.success) {
        style.color = "red";
      } else {
        style.color = "green";
      }
      return (
        <p style={style}>
          <span>
            {row.gain.price > 0 ? "+" : ""}
            {row.gain.price}
          </span>
          <br />
          <small>
            {row.gain.price > 0 ? "+" : ""}
            {row.gain.percentage}
          </small>
        </p>
      );
    },
  },
  {
    title: "買點",
    dataIndex: "notifyBuy",
    key: "notifyBuy",
    align: "right",
    width: 100,
    defaultSortOrder: "descend",
    render: (text, row, index) => {
      return (
        <p style={{ textAlign: "right" }}>
          <span>{row.notifyBuy.price}</span>
          <br />
          <small>{row.notifyBuy.date}</small>
        </p>
      );
    },
    sorter: (a, b) => {
      const aDate = new Date(a.notifyBuy.date);
      const bDate = new Date(b.notifyBuy.date);
      return aDate - bDate;
    },
  },
  {
    title: "賣點",
    dataIndex: "notifySell",
    key: "notifySell",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      return (
        <p style={{ textAlign: "right" }}>
          <span>{row.notifySell.price}</span>
          <br />
          <small>{row.notifySell.date}</small>
        </p>
      );
    },
  },
  {
    title: "起漲點",
    dataIndex: "start",
    key: "start",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      return (
        <p style={{ textAlign: "right" }}>
          <span>{row.start.price}</span>
          <br />
          <small>{row.start.date}</small>
        </p>
      );
    },
  },
  {
    title: "中間值",
    dataIndex: "middle",
    key: "middle",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      return (
        <p style={{ textAlign: "right" }}>
          <span>{row.middle.price}</span>
          <br />
          <span>{row.middle.difference.percentage}%</span>
          <br />
          <small>{row.middle.date}</small>
        </p>
      );
    },
  },
  {
    title: "目標價",
    dataIndex: "predict",
    key: "predict",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      const currentDate = new Date(row.current.date);
      const predictDate = new Date(row.predict.date);
      let style = {};
      if (predictDate < currentDate) {
        style.color = "red";
      }
      return (
        <p style={{ textAlign: "right" }}>
          <span>{row.predict.price}</span>
          <br />
          <small style={style}>{row.predict.date}</small>
        </p>
      );
    },
    sorter: (a, b) => a.predict.price - b.predict.price,
  },
];

// eslint-disable-next-line no-unused-vars
const templateOldStockData = {
  signal: "change hand",
  action: "buy",
  gain: {
    price: 0,
    percentage: "%",
    speed: { speed: "", percentage: "" },
  },
  start: {
    date: "",
    price: 0,
    index: 0,
  },
  middle: {
    date: "8/11/2020",
    price: 35.75,
    percentage: "0.86",
    index: 3582,
  },
  current: {
    date: "1/15/2021",
    price: 40.1,
    difference: {
      points: "-0.85",
      percentage: "-2.08",
    },
    index: 3691,
  },
  predict: {
    date: "1/5/2021",
    price: 51.6,
  },
  notifyBuy: {
    date: "1/15/2021",
    price: 40.1,
    difference: {
      points: "-0.85",
      percentage: "-2.08",
    },
    index: 3691,
  },
  notifySell: {
    date: "1/15/2021",
    price: 40.1,
    difference: {
      points: "-0.85",
      percentage: "-2.08",
    },
    index: 3691,
  },
  success: true / false,
  index: 3582,
};