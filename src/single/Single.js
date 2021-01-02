import React, { useState, useEffect } from "react";
import { Rate, Table, message } from "antd";
import { singleStockColumns } from "../utils/Constants";
import { useParams } from "react-router-dom";

export default function Single() {
  const { exchange, symbol } = useParams();
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    // fetch("url")
    //   .then((res) => {
    //     if (res.ok) return res.json();
    //   })
    //   .then((res) => {
    //     if ("stock not exist") {
    //       window.location.href = "/";
    //     }
    //     setDataSource(res);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     message.error("Something went wrong. Please try again later.");
    //   });
  }, []);

  const onFavoriteChange = (value) => {
    const rawFavorite = localStorage.getItem("favorite");
    const favorite = rawFavorite ? JSON.parse(rawFavorite): {};
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
  return (
    <>
      <h1>
        Stock <Rate count={1} onChange={onFavoriteChange} />
      </h1>
      <Table columns={singleStockColumns} dateSource={dataSource} />
    </>
  );
}
