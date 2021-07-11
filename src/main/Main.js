import React, { useEffect, useState } from "react";
import { Table, Tabs, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { singleStockColumns, tabName } from "../utils/Constants";

export default function Main({ stockData, activeTab, setActiveTab }) {
  const [tabPanes, setTabPanes] = useState([
    { key: "TPE", exchanges: "TPE", notFetched: true },
    { key: "NYSE", exchanges: "NYSE", notFetched: true },
    { key: "NASDAQ", exchanges: "NASDAQ", notFetched: true },
    { key: "HKG", exchanges: "HKG", notFetched: true },
  ]);
  const { TabPane } = Tabs;
  document.title = "Stocks";
  useEffect(() => {
    const exchangesToCountry = {
      TPE: "TW",
      NASDAQ: "US",
      NYSE: "US",
      HKG: "HK",
    };
    
    // parse raw data to website required format
    let tabs = tabPanes.slice(0, tabPanes.length);
    for (let exchanges in stockData) {
      const subTabs = [];

      if (stockData[exchanges].notFetched) continue;
      const exchangesAllData = stockData[exchanges].data;

      if (!exchangesAllData) continue;
      const date = stockData[exchanges].date;
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
              country: exchangesToCountry[exchanges],
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
      const tabIndex = tabs.findIndex((t) => t.exchanges === exchanges);
      tabs[tabIndex] = {
        exchanges,
        date,
        subTabs,
      };
    }

    /*
    const templateTab = [
      {
        exchanges: "TPE",
        date: "12/12/2020",
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
    */
    setTabPanes(tabs);
  }, [stockData]);

  const changeTab = (key) => {
    setActiveTab({ exchanges: key, subTab: 0 });
  };

  const changeSubTab = (key) => {
    setActiveTab({ ...activeTab, subTab: key });
  };
  return (
    <Tabs defaultActiveKey={activeTab.exchanges} onChange={changeTab}>
      {tabPanes.map((tab) => (
        <TabPane tab={tab.exchanges} key={tab.exchanges}>
          {tab.notFetched ? (
            <Skeleton active />
          ) : tab.error ? (
            <h2>{tab.error}</h2>
          ) : (
            <Tabs defaultActiveKey={activeTab.subTab} onChange={changeSubTab}>
              {tab.subTabs.map((subTab, index2) => (
                <TabPane tab={subTab.tabName} key={index2}>
                  <div style={{ margin: "auto", maxWidth: "1200px" }}>
                    <h4>最後更新: {tab.date}</h4>
                    <h5>點擊各行以檢視詳細資料</h5>
                    <Table
                      key={index2}
                      size="small"
                      columns={columns}
                      bordered
                      dataSource={subTab.dataSource}
                      pagination={{
                        defaultPageSize: 20,
                        hideOnSinglePage: true,
                      }}
                      expandable={{
                        expandedRowRender,
                        expandRowByClick: true,
                        indentSize: 0,
                        expandIconColumnIndex: -1,
                      }}
                      scroll={{ x: 600 }}
                      sortDirections={["descend", "ascend"]}
                    />
                  </div>
                </TabPane>
              ))}
            </Tabs>
          )}
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

  return (
    <div style={{ margin: "10px 0px" }}>
      <Table
        size="small"
        columns={singleStockColumns}
        dataSource={dataSource}
        bordered
        pagination={{ defaultPageSize: 20, hideOnSinglePage: true }}
        scroll={{ x: 600 }}
        sortDirections={["descend", "ascend"]}
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
    // width: 100,
    fixed: "left",
    render: (text, row, index) => {
      const allData = row.subDataSource;

      let style = {};

      let fullName = row.fullName;
      // if (fullName.length > 25) {
      //   fullName = fullName.substring(0, 25) + "...";
      // }
      let differencePoint = 0,
        differencePct = 0;
      if (allData.length > 0 && allData[0].current.difference) {
        differencePoint = allData[0].current.difference.points;
        differencePct = allData[0].current.difference.percentage + "%";
      }

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
      let yahooLink;
      if (row.country !== "US") {
        yahooLink = `https://finance.yahoo.com/chart/${row.stock}.${row.country}`;
      } else {
        yahooLink = `https://finance.yahoo.com/chart/${row.stock}`;
      }

      return (
        <span>
          <Link to={`/${row.country}/${row.stock}`}>{text.padEnd(6)}</Link>
          {"  "}
          <a
            href={yahooLink}
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: "RGB(103, 37, 245)" }}
          >
            <strong>
              <em>Y</em>
            </strong>
          </a>
          <br />
          <Link to={`/${row.country}/${row.stock}`}>{fullName}</Link>
          <br />
          <span style={style}>
            ${allData[0].current.price}{" "}
            <span style={actionStyle}>{action}</span>
            <br />({differencePoint}, {differencePct})
            <br />
          </span>
        </span>
      );
    },
    sorter: (a, b) => a.stock.localeCompare(b.stock),
  },
  {
    title: "最大漲速(週)",
    dataIndex: "speed",
    key: "speed",
    align: "right",
    // width: 80,
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
            Math.round((currentPriceDiff / (currentDateDiff / 7)) * 100) / 100;
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
            Math.round((expectPriceDiff / (expectDateDiff / 7)) * 100) / 100;
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
          <small>+{maxSpeed} / wk</small>
        </span>
      );
    },
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
    // width: 80,
    defaultSortOrder: "descend",
    render: (text, row, index) => {
      const allData = row.subDataSource;
      let min = allData[0].gain.price;
      let minPct = allData[0].gain.percentage;
      let max = allData[0].gain.price;
      let maxPct = allData[0].gain.percentage;
      const currentDate = new Date(allData[0].current.date);

      for (let data of allData) {
        const dataPredictDate = new Date(data.predict.date);
        if (dataPredictDate <= currentDate) continue;

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
      const pctToDouble = (pct) => {
        if (typeof pct === "number") return pct;
        return parseFloat(pct.substring(0, pct.length - 1));
      };
      // sort by max profit gain
      const aAllData = a.subDataSource;
      let aMin = pctToDouble(aAllData[0].gain.percentage);
      let aMax = pctToDouble(aAllData[0].gain.percentage);
      const currentDate = new Date(aAllData[0].current.date);

      for (let data of aAllData) {
        const dataPredictDate = new Date(data.predict.date);
        if (dataPredictDate <= currentDate) continue;
        aMin = Math.min(pctToDouble(data.gain.percentage), aMin);
        aMax = Math.max(pctToDouble(data.gain.percentage), aMax);
      }

      const bAllData = b.subDataSource;
      let bMin = pctToDouble(bAllData[0].gain.percentage);
      let bMax = pctToDouble(bAllData[0].gain.percentage);
      for (let data of bAllData) {
        const dataPredictDate = new Date(data.predict.date);
        if (dataPredictDate <= currentDate) continue;
        bMin = Math.min(pctToDouble(data.gain.percentage, bMin));
        bMax = Math.max(pctToDouble(data.gain.percentage, bMax));
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
    // width: 90,
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
