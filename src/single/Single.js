import React, { useState, useEffect } from "react";
import { Rate, Table, message, Descriptions } from "antd";
import { singleStockColumns } from "../utils/Constants";
import { useParams } from "react-router-dom";
import { appScriptURL } from "../utils/Constants";

export default function Single() {
  const { exchange, symbol } = useParams();
  const [fullName, setFullName] = useState("");
  const [oldDataSource, setOldDataSource] = useState([]);
  const [currentDataSource, setCurrentDataSource] = useState([]);

  useEffect(() => {
    fetch(appScriptURL + `mode=single&exchange=${exchange}&symbol=${symbol}`)
      .then((res) => {
        if (res.ok) return res.data;
      })
      .then((res) => {
        // eslint-disable-next-line no-unused-vars
        const template = {
          fullName: "",
          old: [],
          current: [],
        };
        document.title = `${symbol} - ${res.fullName} | Stocks`;
        setFullName(res.fullName);
        setOldDataSource(res.old);
        setCurrentDataSource(res.current);
      })
      .catch((err) => {
        console.error(err);
        message.error("Unable to fetch data. Please try again later.");
      });
  }, [exchange, symbol]);

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
      {fullName} ({symbol}) <Rate count={1} onChange={onFavoriteChange} />
    </>
  );
  return (
    <div>
      <div>
        <Descriptions title={symbolTitle}>
          <Descriptions.Item label="準確率">95%</Descriptions.Item>
          <Descriptions.Item label="策略">買/賣</Descriptions.Item>
          <Descriptions.Item label="股價狀態">漲/跌</Descriptions.Item>
        </Descriptions>
      </div>
      <div>
        <Table columns={singleStockColumns} dateSource={currentDataSource} />
      </div>
      <div>
        <h3>過往紀錄</h3>
        <Table columns={singleStockColumns} dateSource={oldDataSource} />
      </div>
    </div>
  );
}
