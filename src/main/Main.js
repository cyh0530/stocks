import React, { useEffect, useState } from "react";
import { Table, Tabs } from "antd";
import { Link } from "react-router-dom";
import { singleStockColumns, tabName } from "../utils/Constants";

export default function Main({ stockData }) {
  const [tabPanes, setTabPanes] = useState([]);
  const { TabPane } = Tabs;

  const temp = {
    TPE: "TW",
    NASDAQ: "US",
    NYSE: "US",
  };

  useEffect(() => {
    // parse raw data to website required format
    const tabs = [];
    for (let exchanges in stockData) {
      const subTabs = [];
      const exchangesAllData = stockData[exchanges];
      let categories = {};
      const firstKey = Object.keys(exchangesAllData)[0];
      const firstData = exchangesAllData[firstKey].data;
      for (let key in firstData) {
        categories[key] = [];
      }

      for (let symbol in exchangesAllData) {
        const fullName = exchangesAllData[symbol].fullName;
        const stockData = exchangesAllData[symbol].data;

        for (let category in stockData) {
          const categoryData = stockData[category];
          if (categoryData.length > 0) {
            categories[category].push({
              key: categories[category].length,
              country: temp[exchanges],
              stock: symbol,
              fullName,
              subDataSource: categoryData,
            });
          }
        }
      }

      for (let category in categories) {
        subTabs.push({
          tabName: tabName[category] || category,
          dataSource: categories[category],
        });
      }

      tabs.push({
        exchanges,
        subTabs,
      });
    }

    // eslint-disable-next-line no-unused-vars
    const templateTab = [
      {
        exchanges: "TPE",
        subTabs: [
          {
            tabName: "Today New",
            dataSource: [
              {
                key: 1,
                exchanges: "TPE",
                stock: "2330",
                fullName: "台積電",
                subDataSource: [
                  {
                    key: 1,
                    start: {},
                    middle: {},
                    current: {},
                    predict: {},
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    setTabPanes(tabs);
  }, [stockData]);

  return (
    <Tabs defaultActiveKey="0">
      {tabPanes.map((tab, index) => (
        <TabPane tab={tab.exchanges} key={index}>
          <Tabs defaultActiveKey="0">
            {tab.subTabs.map((subTab, index2) => (
              <TabPane tab={subTab.tabName} key={index2}>
                <div style={{ margin: "auto" }}>
                  <Table
                    key={index2}
                    size="small"
                    columns={columns}
                    bordered
                    dataSource={subTab.dataSource}
                    pagination={{ defaultPageSize: 20, hideOnSinglePage: true }}
                    expandable={{ expandedRowRender, expandRowByClick: true }}
                    scroll={{ x: 600 }}
                  />
                </div>
              </TabPane>
            ))}
          </Tabs>
        </TabPane>
      ))}
      {/* <TabPane tab="Favorite" key="1">
          <Table
            columns={columns}
            dataSource={dataSource}
            expandable={{ expandedRowRender }}
          />
        </TabPane> */}
    </Tabs>
  );
}

const expandedRowRender = (record) => {
  let dataSource = [];
  // for (let stock in raw) {
  //   for (let i = 0; i < raw[stock].hold.length; i++) {
  //     const processing = raw[stock].hold[i];
  //     dataSource.push({
  //       key: key++,
  //       stock: stock,
  //       buy: {
  //         price: 0,
  //         date: "12/12/2020",
  //       },
  //       ...processing,
  //     });
  //   }
  // }
  for (let i = 0; i < record.subDataSource.length; i++) {
    const processing = record.subDataSource[i];
    dataSource.push({
      key: i,
      stock: record.stock,
      buy: {
        price: 0,
        date: "12/12/2020",
      },
      ...processing,
    });
  }
  console.log(dataSource);
  return (
    <div style={{ margin: "10px 0px" }}>
      <Table
        size="small"
        columns={singleStockColumns}
        dataSource={dataSource}
        bordered
        pagination={{ defaultPageSize: 20, hideOnSinglePage: true }}
        scroll={{ x: 600 }}
      />
    </div>
  );
};

const columns = [
  {
    title: "股票",
    dataIndex: "stock",
    key: "stock",
    ellipsis: true,
    width: 100,
    fixed: "left",
    render: (text, row, index) => {
      const allData = row.subDataSource;

      let style = {};

      let fullName = row.fullName;
      // if (fullName.length > 25) {
      //   fullName = fullName.substring(0, 25) + "...";
      // }
      let differencePoint = allData[0].current.difference.points;
      let differencePct = allData[0].current.difference.percentage + "%";

      if (differencePoint > 0) {
        style.color = "red";
      }

      if (differencePoint >= 0) {
        differencePoint = `+${differencePoint}`;
        differencePct = `+${differencePct}`;
      } else if (differencePoint < 0) {
        style.color = "green";
      }
      let action = "買";
      let actionStyle = { color: "red" };

      for (let data of allData) {
        if (data.action === "賣") {
          action = "賣";
          actionStyle.color = "green";
          break;
        }
      }

      return (
        <span>
          <Link to={`/${row.country}/${row.stock}`}>
            {text.padEnd(6)} <br />
            {fullName}
          </Link>
          <br />
          <span style={style}>
            ${allData[0].current.price} ({differencePoint}, {differencePct})
            <br />
          </span>
          <span style={actionStyle}>{action}</span>
        </span>
      );
    },
    sorter: (a, b) => a.stock - b.stock,
  },
  {
    title: "最大漲速(週)",
    dataIndex: "speed",
    key: "speed",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      const allData = row.subDataSource;
      let maxSpeed = 0,
        maxSpeedPct = 0;
      for (let data of allData) {

        const middleDate = new Date(data.middle.date);
        const currentDate = new Date(data.current.date);
        const predictDate = new Date(data.predict.date);

        const currentPriceDiff = data.current.price - data.middle.price;
        const currentDateDiffMillis = currentDate - middleDate;
        const currentDateDiff = currentDateDiffMillis / (1000 * 60 * 60 * 24);
        let currentSpeed, currentSpeedPct;
        if (currentDateDiff <= 0) {
          currentSpeed = 0;
          currentSpeedPct = 0;
        } else {
          currentSpeed =
            Math.round((currentPriceDiff / ((currentDateDiff / 7) * 5)) * 100) /
            100;
          currentSpeedPct =
            Math.round((currentSpeed / currentDateDiff) * 10000) / 100;
        }

        const expectPriceDiff = data.predict.price - data.middle.price;
        const expectDateDiffMillis = predictDate - middleDate;
        const expectDateDiff = expectDateDiffMillis / (1000 * 60 * 60 * 24);
        let expectSpeed, expectSpeedPct;
        if (expectDateDiff <= 0) {
          expectSpeed = 0;
          expectSpeedPct = 0;
        } else {
          expectSpeed =
            Math.round((expectPriceDiff / ((expectDateDiff / 7) * 5)) * 100) /
            100;
          expectSpeedPct =
            Math.round((expectSpeed / expectDateDiff) * 10000) / 100;
        }

        let speedPct = expectSpeedPct;
        let speed = expectSpeed;

        if (currentDateDiffMillis / expectDateDiffMillis >= 0.1) {
          if (currentSpeedPct < expectSpeedPct) {
            speedPct = currentSpeedPct;
            speed = speedPct;
          }
        }

        if (speedPct > maxSpeedPct) {
          maxSpeedPct = speedPct;
          maxSpeed = speed;
        }
      }

      return (
        <span>
          <span>{maxSpeedPct}%</span>
          <br />
          <small>{maxSpeed}</small>
        </span>
      );
    },
    defaultSortOrder: "descend",
    sorter: (a, b) => {
      // sort by max speed
      const aAllData = a.subDataSource;

      let aMaxSpeedPct = 0;
      for (let data of aAllData) {
        const priceDiff = data.predict.price - data.current.price;
        const dateDiffMillis =
          new Date(data.predict.date) - new Date(data.current.date);
        if (dateDiffMillis <= 0) continue;
        const dateDiff = dateDiffMillis / (1000 * 60 * 60 * 24);
        const speed = priceDiff / ((dateDiff / 7) * 5);
        const speedPct = speed / dateDiff;

        if (speedPct > aMaxSpeedPct) {
          aMaxSpeedPct = speedPct;
        }
      }
      const bAllData = b.subDataSource;

      let bMaxSpeedPct = 0;
      for (let data of bAllData) {
        const priceDiff = data.predict.price - data.current.price;
        const dateDiffMillis =
          new Date(data.predict.date) - new Date(data.current.date);
        if (dateDiffMillis <= 0) continue;

        const dateDiff = dateDiffMillis / (1000 * 60 * 60 * 24);
        const speed = priceDiff / ((dateDiff / 7) * 5);
        const speedPct = speed / dateDiff;

        if (speedPct > bMaxSpeedPct) {
          bMaxSpeedPct = speedPct;
        }
      }

      return aMaxSpeedPct - bMaxSpeedPct;
    },
  },
  {
    title: "獲利空間",
    dataIndex: "gain",
    key: "gain",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      const allData = row.subDataSource;
      let min = allData[0].gain.price;
      let minPct = allData[0].gain.percentage;
      let max = allData[0].gain.price;
      let maxPct = allData[0].gain.percentage;
      for (let data of allData) {
        if (data.gain.price < min) {
          min = data.gain.price;
          minPct = data.gain.percentage;
        }
        if (data.gain.price > max) {
          max = data.gain.price;
          maxPct = data.gain.percentage;
        }
      }

      const price = min === max ? min : `${min} - ${max}`;
      const pct = minPct === maxPct ? minPct : `${minPct} - ${maxPct}`;
      return (
        <span>
          <span>{price} </span>
          <br />
          <small>{pct} </small>
        </span>
      );
    },
    sorter: (a, b) => {
      // sort by max profit gain
      const aAllData = a.subDataSource;
      let aMin = aAllData[0].gain.price;
      let aMax = aAllData[0].gain.price;
      const currentDate = new Date(aAllData[0].current.date);

      for (let data of aAllData) {
        const dataPredictDate = new Date(data.predict.date);
        if (dataPredictDate <= currentDate) continue;
        aMin = Math.min(data.gain.price, aMin);
        aMax = Math.max(data.gain.price, aMax);
      }

      const bAllData = b.subDataSource;
      let bMin = bAllData[0].gain.price;
      let bMax = bAllData[0].gain.price;
      for (let data of bAllData) {
        const dataPredictDate = new Date(data.predict.date);
        if (dataPredictDate <= currentDate) continue;
        bMin = Math.min(data.gain.price, bMin);
        bMax = Math.max(data.gain.price, bMax);
      }

      return aMax - bMax;
    },
  },
  // {
  //   title: "現價",
  //   dataIndex: "currentPrice",
  //   key: "currentPrice",
  //   align: "right",

  //   render: (text, row, index) => {
  //     let style = { textAlign: "right" };
  //     // if (row.current.price < row.buy.price) {
  //     //   style.color = "green";
  //     // } else {
  //     //   style.color = "red";
  //     // }
  //     const allData = row.subDataSource;

  //     return (
  //       <span>
  //         <span style={style}>{allData[0].current.price} </span>
  //       </span>
  //     );
  //   },
  // },
  // {
  //   title: "買價",
  //   dataIndex: "buy",
  //   key: "buy",
  //   render: (text, row, index) => {
  //     return (
  //       <span style={{ textAlign: "right" }}>
  //         <span>{row.buy.price}</span>
  //         <br />
  //         <small>{row.buy.date}</small>
  //       </span>
  //     );
  //   },
  // },
  // {
  //   title: "起漲點",
  //   dataIndex: "start",
  //   key: "start",
  //   render: (text, row, index) => {
  //     return (
  //       <span style={{ textAlign: "right" }}>
  //         <span>{row.start.price}</span>
  //         <br />
  //         <small>{row.start.date}</small>
  //       </span>
  //     );
  //   },
  // },
  // {
  //   title: "現在獲利",
  //   dataIndex: "currentGain",
  //   key: "currentGain",
  //   render: (text, row, index) => {
  //     let style = { textAlign: "right" };
  //     if (row.current.price < row.buy.price) {
  //       style.color = "green";
  //     } else {
  //       style.color = "red";
  //     }
  //     return (
  //       <span style={style}>
  //         <span>{(row.current.price - row.buy.price).toFixed(2)}</span>
  //         <br />
  //         <small>{(row.current.price / row.buy.price).toFixed(2)}%</small>
  //       </span>
  //     );
  //   },
  // },
  {
    title: "目標價",
    dataIndex: "predict",
    key: "predict",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      const allData = row.subDataSource;
      let min = allData[0].predict.price;
      let minDate = allData[0].predict.date;
      let max = allData[0].predict.price;
      let maxDate = allData[0].predict.date;
      for (let data of allData) {
        if (data.predict.price < min) {
          min = data.predict.price;
          minDate = data.predict.date;
        }
        if (data.predict.price > max) {
          max = data.predict.price;
          maxDate = data.predict.date;
        }
      }
      const price = min === max ? min : `${min} - ${max}`;
      const date = min === max ? minDate : `${minDate} - ${maxDate}`;
      return (
        <span>
          <span>{price} </span>
          <br />
          <small>{date} </small>
        </span>
      );
    },
  } /*
    {
      title: "最高目標價",
      dataIndex: "maxPredict",
      key: "maxPredict",
      render: (text, row, index) => {
        const allData = row.subDataSource;
        let max = allData[0].predict.price;
        let maxDate = allData[0].predict.date;
        for (let data of allData) {
          if (data.predict.price > max) {
            max = data.predict.price;
            maxDate = data.predict.date;
          }
        }
        return (
          <span style={{ textAlign: "right" }}>
            <span>{max}</span>
            <br />
            <small>{maxDate}</small>
          </span>
        );
      },
      sorter: (a, b) => a.predict.price - b.predict.price,
    },*/,
];
