import React, { useEffect, useState } from "react";
import { Table, Select, Row, Col, Tabs } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { parse } from "node-html-parser";
import { singleStockColumns, summaryLink } from "../utils/Constants";

export default function Main() {
  const columns = [
    {
      title: "股票",
      dataIndex: "stock",
      key: "stock",
      ellipsis: true,
      render: (text, row, index) => {
        const allData = row.subDataSource;

        let style = { textAlign: "right" };
        // if (row.current.price < row.buy.price) {
        //   style.color = "green";
        // } else {
        //   style.color = "red";
        // }
        let fullName = row.fullName
        if (fullName.length > 17) {
          fullName = fullName.substring(0, 17) + "..."
        }
        return (
          <>
            <p>
              <Link to={`/${row.stock}`} target="_blank" rel="noopener noreferrer">
                {text.padEnd(6)} <span style={style}> - {fullName}</span>
              </Link>
              <br />
              <>${allData[0].current.price} </>
            </p>
          </>
        );
      },
      sorter: (a, b) => a.stock - b.stock,
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
    //       <p>
    //         <span style={style}>{allData[0].current.price} </span>
    //       </p>
    //     );
    //   },
    // },
    // {
    //   title: "買價",
    //   dataIndex: "buy",
    //   key: "buy",
    //   render: (text, row, index) => {
    //     return (
    //       <p style={{ textAlign: "right" }}>
    //         <span>{row.buy.price}</span>
    //         <br />
    //         <small>{row.buy.date}</small>
    //       </p>
    //     );
    //   },
    // },
    // {
    //   title: "起漲點",
    //   dataIndex: "start",
    //   key: "start",
    //   render: (text, row, index) => {
    //     return (
    //       <p style={{ textAlign: "right" }}>
    //         <span>{row.start.price}</span>
    //         <br />
    //         <small>{row.start.date}</small>
    //       </p>
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
    //       <p style={style}>
    //         <span>{(row.current.price - row.buy.price).toFixed(2)}</span>
    //         <br />
    //         <small>{(row.current.price / row.buy.price).toFixed(2)}%</small>
    //       </p>
    //     );
    //   },
    // },
    {
      title: "目標價",
      dataIndex: "predict",
      key: "predict",
      align: "right",

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
          <p>
            <span>{price} </span>
            <br />
            <small>{date} </small>
          </p>
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
          <p style={{ textAlign: "right" }}>
            <span>{max}</span>
            <br />
            <small>{maxDate}</small>
          </p>
        );
      },
      sorter: (a, b) => a.predict.price - b.predict.price,
    },*/,
    {
      title: "獲利空間",
      dataIndex: "gain",
      key: "gain",
      align: "right",

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
          <p>
            <span>{price} </span>
            <br />
            <small>{pct} </small>
          </p>
        );
      },
      sorter: (a, b) => {
        const aAllData = a.subDataSource;
        let aMin = aAllData[0].predict.price;
        let aMax = aAllData[0].predict.price;
        for (let data of aAllData) {
          aMin = Math.min(data.predict.price, aMin);
          aMax = Math.max(data.predict.price, aMax);
        }

        const bAllData = b.subDataSource;
        let bMin = bAllData[0].predict.price;
        let bMax = bAllData[0].predict.price;
        for (let data of bAllData) {
          bMin = Math.min(data.predict.price, bMin);
          bMax = Math.max(data.predict.price, bMax);
        }

        return aMax - bMax;
      },
    },
    {
      title: "最大漲速(週)",
      dataIndex: "speed",
      key: "speed",
      align: "right",

      render: (text, row, index) => {
        const allData = row.subDataSource;
        let maxSpeed = 0,
          maxSpeedPct = 0;
        for (let data of allData) {
          const priceDiff = data.predict.price - data.current.price;
          const dateDiffMillis =
            new Date(data.predict.date) - new Date(data.current.date);
          const dateDiff = dateDiffMillis / (1000 * 60 * 60 * 24);
          const speed =
            Math.round((priceDiff / ((dateDiff / 7) * 5)) * 10000) / 10000;
          const speedPct = Math.round((speed / dateDiff) * 10000) / 100;

          if (speedPct > maxSpeedPct) {
            maxSpeedPct = speedPct;
            maxSpeed = speed;
          }
        }

        return (
          <p>
            <span>{maxSpeedPct}%</span>
            <br />
            <small>{maxSpeed}</small>
          </p>
        );
      },
      sorter: (a, b) => {
        const aAllData = a.subDataSource;

        let aMaxSpeedPct = 0;
        for (let data of aAllData) {
          const priceDiff = data.predict.price - data.current.price;
          const dateDiffMillis =
            new Date(data.predict.date) - new Date(data.current.date);
          const dateDiff = dateDiffMillis / (1000 * 60 * 60 * 24);
          const speed =
            Math.round((priceDiff / ((dateDiff / 7) * 5)) * 100) / 100;
          const speedPct = Math.round((speed / dateDiff) * 100) / 100;

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
          const dateDiff = dateDiffMillis / (1000 * 60 * 60 * 24);
          const speed =
            Math.round((priceDiff / ((dateDiff / 7) * 5)) * 100) / 100;
          const speedPct = Math.round((speed / dateDiff) * 100) / 100;

          if (speedPct > bMaxSpeedPct) {
            bMaxSpeedPct = speedPct;
          }
        }

        return aMaxSpeedPct - bMaxSpeedPct;
      },
    },
  ];
  const [tabPanes, setTabPanes] = useState([]);
  const { Option } = Select;
  const { TabPane } = Tabs;
  const options = [];
  // this.state.data.map((d) => (
  //   <Option key={d.value}>
  //     <Link target="_blank" rel="noopener noreferrer">
  //       {d.text}
  //     </Link>
  //   </Option>
  // ));

  useEffect(() => {
    const wrapper = async () => {
      try {
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
        console.log("columnsName = ", columnsName);
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
        const tr = tableBody.childNodes[tableBody.childNodes.length - 2];
        let lastDayData = {};

        for (let j = 2; j < tr.childNodes.length; j++) {
          const td = tr.childNodes[j];
          const text = td.innerText.replace(/&quot;/g, '"');
          console.log(text);
          lastDayData[columnsName[j]] = JSON.parse(text);
        }
        console.log("lastDayData = ", lastDayData);
        // parse raw data to website required format
        const tabs = [];
        for (let country in lastDayData) {
          const subTabs = [];
          const countryAllData = lastDayData[country];
          const newDataSource = [];
          const holdDataSource = [];
          for (let symbol in countryAllData) {
            const fullName = countryAllData[symbol].fullName;
            const stockData = countryAllData[symbol].data;
            const newData = stockData.new;
            const holdData = stockData.hold;

            if (newData.length > 0) {
              newDataSource.push({
                key: newDataSource.length,
                stock: symbol,
                fullName,
                subDataSource: newData,
              });
            }
            if (holdData.length > 0) {
              holdDataSource.push({
                key: holdDataSource.length,
                stock: symbol,
                fullName,
                subDataSource: holdData,
              });
            }
          }

          subTabs.push({
            tabName: "Today New",
            dataSource: newDataSource,
          });

          subTabs.push({
            tabName: "All",
            dataSource: holdDataSource,
          });

          tabs.push({
            country,
            subTabs,
          });
        }
        console.log(tabs);

        setTabPanes(tabs);
      } catch (err) {
        console.error(err);
      }
    };
    wrapper();
  }, []);

  const onSearch = (value) => {};

  return (
    <>
      <div style={{ width: "100%" }}>
        <Row>
          <Col xs={24} sm={24} md={6} lg={6} xl={5} xxl={4}>
            <h1>Stocks</h1>
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
              filterOption={false}
              onSearch={onSearch}
              notFoundContent={null}
              placeholder="Search..."
              style={{ width: "150px", textAlign: "left" }}
            >
              {options}
            </Select>
          </Col>
        </Row>
      </div>
      <Tabs defaultActiveKey="0">
        {tabPanes.map((tab, index) => (
          <TabPane tab={tab.country} key={index}>
            <Tabs defaultActiveKey="0">
              {tab.subTabs.map((subTab, index2) => (
                <TabPane tab={subTab.tabName} key={index2}>
                  <Table
                    key={index2}
                    size="small"
                    columns={columns}
                    bordered
                    dataSource={subTab.dataSource}
                    expandable={{ expandedRowRender, expandRowByClick: true }}
                  />
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
    </>
  );
}

const expandedRowRender = (record, index, indent, expanded) => {
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
    <Table
      size="small"
      columns={singleStockColumns}
      dataSource={dataSource}
      bordered
      pagination={{ defaultPageSize: 100, hideOnSinglePage: true }}
    />
  );
};
/*
  for (let stock in raw) {
    for (let i = 0; i < raw[stock].hold.length; i++) {
      const processing = raw[stock].hold[i];
      dataSource.push({
        key: i,
        stock: stock,
        buy: {
          price: 0,
          date: "12/12/2020",
        },
        ...processing,
      });
    }
  }

const raw = {
  長榮海運: {
    new: [],
    hold: [
      {
        signal: "change hand",
        action: "buy",
        gain: {
          price: 7.2,
          percentage: "18.85%",
        },
        start: {
          date: "3/19/2020",
          price: 8.9,
          index: 3484,
        },
        "change hand": {
          date: "12/11/2020",
          price: 27.15,
          index: 3667,
        },
        current: {
          date: "12/30/2020",
          price: 38.2,
          index: 3680,
        },
        predict: {
          date: "9/4/2021",
          price: 45.4,
        },
        index: 3667,
      },
      {
        signal: "change hand",
        action: "buy",
        gain: {
          price: 5.45,
          percentage: "14.27%",
        },
        start: {
          date: "7/14/2020",
          price: 10.65,
          index: 3562,
        },
        "change hand": {
          date: "12/11/2020",
          price: 27.15,
          index: 3667,
        },
        current: {
          date: "12/30/2020",
          price: 38.2,
          index: 3680,
        },
        predict: {
          date: "5/10/2021",
          price: 43.65,
        },
        index: 3667,
      },
      {
        signal: "change hand",
        action: "buy",
        gain: {
          price: 1.3,
          percentage: "3.4%",
        },
        start: {
          date: "9/24/2020",
          price: 14.8,
          index: 3614,
        },
        "change hand": {
          date: "12/11/2020",
          price: 27.15,
          index: 3667,
        },
        current: {
          date: "12/30/2020",
          price: 38.2,
          index: 3680,
        },
        predict: {
          date: "2/27/2021",
          price: 39.5,
        },
        index: 3667,
      },
      {
        signal: "change hand",
        action: "buy",
        gain: {
          price: 10.2,
          percentage: "26.7%",
        },
        start: {
          date: "3/19/2020",
          price: 8.9,
          index: 3484,
        },
        "change hand": {
          date: "12/15/2020",
          price: 28.65,
          index: 3669,
        },
        current: {
          date: "12/30/2020",
          price: 38.2,
          index: 3680,
        },
        predict: {
          date: "9/12/2021",
          price: 48.4,
        },
        index: 3669,
      },
      {
        signal: "change hand",
        action: "buy",
        gain: {
          price: 8.45,
          percentage: "22.12%",
        },
        start: {
          date: "7/14/2020",
          price: 10.65,
          index: 3562,
        },
        "change hand": {
          date: "12/15/2020",
          price: 28.65,
          index: 3669,
        },
        current: {
          date: "12/30/2020",
          price: 38.2,
          index: 3680,
        },
        predict: {
          date: "5/18/2021",
          price: 46.65,
        },
        index: 3669,
      },
      {
        signal: "change hand",
        action: "buy",
        gain: {
          price: 4.3,
          percentage: "11.26%",
        },
        start: {
          date: "9/24/2020",
          price: 14.8,
          index: 3614,
        },
        "change hand": {
          date: "12/15/2020",
          price: 28.65,
          index: 3669,
        },
        current: {
          date: "12/30/2020",
          price: 38.2,
          index: 3680,
        },
        predict: {
          date: "3/7/2021",
          price: 42.5,
        },
        index: 3669,
      },
      {
        signal: "change hand",
        action: "buy",
        gain: {
          price: 13.3,
          percentage: "34.82%",
        },
        start: {
          date: "3/19/2020",
          price: 8.9,
          index: 3484,
        },
        "change hand": {
          date: "12/22/2020",
          price: 30.2,
          index: 3674,
        },
        current: {
          date: "12/30/2020",
          price: 38.2,
          index: 3680,
        },
        predict: {
          date: "9/26/2021",
          price: 51.5,
        },
        index: 3674,
      },
      {
        signal: "change hand",
        action: "buy",
        gain: {
          price: 11.55,
          percentage: "30.24%",
        },
        start: {
          date: "7/24/2020",
          price: 10.65,
          index: 3570,
        },
        "change hand": {
          date: "12/22/2020",
          price: 30.2,
          index: 3674,
        },
        current: {
          date: "12/30/2020",
          price: 38.2,
          index: 3680,
        },
        predict: {
          date: "5/22/2021",
          price: 49.75,
        },
        index: 3674,
      },
      {
        signal: "change hand",
        action: "buy",
        gain: {
          price: 7.4,
          percentage: "19.37%",
        },
        start: {
          date: "9/24/2020",
          price: 14.8,
          index: 3614,
        },
        "change hand": {
          date: "12/22/2020",
          price: 30.2,
          index: 3674,
        },
        current: {
          date: "12/30/2020",
          price: 38.2,
          index: 3680,
        },
        predict: {
          date: "3/21/2021",
          price: 45.6,
        },
        index: 3674,
      },
    ],
    remove: [],
  },
};
*/
