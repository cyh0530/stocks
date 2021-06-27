import React, { useState, useEffect } from "react";
import { Rate, Table, Descriptions, Skeleton } from "antd";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { singleStockColumns } from "../utils/Constants";
import { useParams, useLocation } from "react-router-dom";
import { appScriptURL } from "../utils/Constants";

export default function Single() {
  let { country, symbol } = useParams();
  const location = useLocation();
  const [header, setHeader] = useState(<></>);
  const [dataSource, setDataSource] = useState({});
  const [error, setError] = useState({});
  const [finishFetching, setFinishFetching] = useState(false);

  country = country.toUpperCase();
  symbol = symbol.toUpperCase();

  const fetchData = async () => {
    try {
      setFinishFetching(false);
      setError({});
      let mode = location.pathname.includes("v0") ? "single-old" : "single";
      const data = await axios({
        url: appScriptURL,
        params: {
          mode: mode,
          country: country.toUpperCase(),
          symbol: symbol.toUpperCase(),
        },
      }).then((res) => {
        return res.data;
      });

      console.log(data);
      if (data.error) {
        console.error(data.error);

        setError({
          error: (
            <div>
              <h2>{data.error}</h2>
            </div>
          ),
        });
        return;
      }

      document.title = `${symbol} - ${data.profile.fullName} | Stocks`;
      setDataSource({ ...data.data });
      const profile = data.profile;

      // eslint-disable-next-line no-unused-vars
      const profileTemplate = {
        profile: {
          fullName: "",
          accuracy: {
            success: 0,
            total: 0,
            percentage: "",
          },
          price: 0,
          date: new Date(),
          difference: {
            points: 0,
            percentage: 0,
          },
          // action: "",
          // status: "",
        },
        data: {
          old: [],
          current: [],
        },
      };

      let price;

      if (profile.difference.points < 0) {
        price = (
          <span style={{ color: "green" }}>
            {profile.price} {"  "} {profile.difference.points} (
            {profile.difference.percentage}%)
          </span>
        );
      } else if (profile.difference.points > 0) {
        price = (
          <span style={{ color: "red" }}>
            {profile.price} {"  "} +{profile.difference.points} (+
            {profile.difference.percentage}%)
          </span>
        );
      } else {
        price = (
          <span>
            {profile.price}
            {"  "} +{profile.difference.points} (+
            {profile.difference.percentage}%)
          </span>
        );
      }

      let yahooLink;
      if (country !== "US") {
        yahooLink = `https://finance.yahoo.com/chart/${symbol}.${country}`;
      } else {
        yahooLink = `https://finance.yahoo.com/chart/${symbol}`;
      }

      const symbolTitle = (
        <>
          {profile.fullName} ({symbol}){" "}
          <Rate count={1} onChange={onFavoriteChange} />{" "}
          <a
            href={yahooLink}
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: "RGB(103, 37, 245)" }}
          >
            Yahoo Finance <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
          <br />
          {price}
          <br />
          <small>{new Date(profile.date).toLocaleDateString()}</small>
        </>
      );
      setHeader(
        <div>
          <Descriptions title={symbolTitle}>
            <Descriptions.Item label="準確率">
              {profile.accuracy.percentage}% ({profile.accuracy.success} /{" "}
              {profile.accuracy.total})
            </Descriptions.Item>
            {/* <Descriptions.Item label="策略">買/賣</Descriptions.Item>
        <Descriptions.Item label="股價狀態">漲/跌</Descriptions.Item> */}
          </Descriptions>
        </div>
      );
      setFinishFetching(true);
    } catch (e) {
      console.error(e);
      setError({
        error: (
          <div>
            <h2>Unable to fetch data. Please try again later.</h2>
          </div>
        ),
      });
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (Object.keys(error).length > 0) {
    return error.error;
  }

  return (
    <div>
      {finishFetching ? header : <Skeleton active />}
      {finishFetching ? (
        <div>
          <Table
            columns={singleStockColumns}
            dataSource={dataSource.current}
            size="small"
            pagination={{ defaultPageSize: 5 }}
            scroll={{ x: 400 }}
          />
        </div>
      ) : (
        <Skeleton active />
      )}
      {finishFetching ? (
        <div>
          <h3>過往紀錄</h3>
          <Table
            columns={oldStockColumns}
            dataSource={dataSource.old}
            size="small"
            sortDirections={["descend", "ascend"]}
            scroll={{ x: 480 }}
          />
        </div>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
}

const oldStockColumns = [
  {
    title: "訊息",
    dataIndex: "message",
    key: "message",
    align: "right",
    fixed: "left",
    width: 100,
    render: (text, row, index) => {
      let style = {};
      if (row.success) {
        style.color = "red";
      } else {
        style.color = "green";
      }
      return <span style={style}>{text}</span>;
    },
  },
  {
    title: "獲利",
    dataIndex: "gain",
    key: "gain",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      let style = {};
      if (row.gain.price > 0) {
        style.color = "red";
      } else {
        style.color = "green";
      }
      return (
        <span style={style}>
          <span>
            {row.gain.price > 0 ? "+" : ""}
            {row.gain.price}
          </span>
          <br />
          <small>
            {row.gain.price > 0 ? "+" : ""}
            {(row.gain.percentage * 100).toFixed(2)}%
          </small>
        </span>
      );
    },
  },
  {
    title: "買點",
    dataIndex: "buy",
    key: "buy",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      return (
        <span style={{ textAlign: "right" }}>
          <span>{row.buy.price}</span>
          <br />
          <small>{row.buy.date}</small>
        </span>
      );
    },
    sorter: (a, b) => {
      const aDate = new Date(a.buy.date);
      const bDate = new Date(b.buy.date);
      return aDate - bDate;
    },
  },
  {
    title: "賣點",
    dataIndex: "sell",
    key: "sell",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      return (
        <span style={{ textAlign: "right" }}>
          <span>{row.sell.price}</span>
          <br />
          <small>{row.sell.date}</small>
        </span>
      );
    },
  },
  {
    title: "目標價",
    dataIndex: "predict",
    key: "predict",
    align: "right",
    width: 100,
    defaultSortOrder: "descend",
    render: (text, row, index) => {
      const currentDate = new Date(row.current.date);
      const predictDate = new Date(row.predict.date);
      let style = {};
      if (predictDate < currentDate) {
        style.color = "red";
      }
      return (
        <span style={{ textAlign: "right" }}>
          <span>{row.predict.price}</span>
          <br />
          <small style={style}>{row.predict.date}</small>
        </span>
      );
    },
    sorter: (a, b) => {
      const dateA = new Date(a.predict.date);
      const dateB = new Date(b.predict.date);
      return dateA - dateB;
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
        <span style={{ textAlign: "right" }}>
          <span>{row.start.price}</span>
          <br />
          <small>{row.start.date}</small>
        </span>
      );
    },
  },
  {
    title: "中間值",
    dataIndex: "middle",
    key: "middle",
    align: "right",
    width: 120,
    render: (text, row, index) => {
      return (
        <span style={{ textAlign: "right" }}>
          <span>{row.middle.price}</span>
          <br />
          <small>
            ({row.middle.difference.points}, {row.middle.difference.percentage}
            %)
          </small>
          <br />
          <small>{row.middle.date}</small>
        </span>
      );
    },
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
  buy: {
    date: "1/15/2021",
    price: 40.1,
    difference: {
      points: "-0.85",
      percentage: "-2.08",
    },
    index: 3691,
  },
  sell: {
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
