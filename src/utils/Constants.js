export const summaryLink =
  "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQGMwv4tEoSbTjgtSht6LZ5Vxlwb0Y4Lm1z5Pp0tuBcSaZE9AMTY_isyio7Sc-_C8LHsfv_xMptHeqA/pubhtml";

export const appScriptURL =
  "https://script.google.com/a/uw.edu/macros/s/AKfycbzdeg0uAW8TFykGSnDPjMxYhAayyAfcQEnuByZm7ykEKiXJbdk/exec";

export const MODE = {
  color: [
    {
      rise: "red",
      fall: "green",
    },
    { rise: "green", fall: "red" },
  ],
};

export const singleStockColumns = [
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
  {
    title: "行為",
    dataIndex: "action",
    key: "action",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      let style = { textAlign: "right" };
      let action;
      if (text === "buy") {
        style.color = "red";
        action = "買";
      } else if (text === "sell") {
        style.color = "green";
        action = "賣";
      }
      const currentDate = new Date(row.current.date);
      const predictDate = new Date(row.predict.date);
      if (predictDate < currentDate) {
        style.color = "gray";
      }
      return (
        <p style={style}>
          <span>{action}</span>
        </p>
      );
    },
  },
  {
    title: "漲速(週)",
    dataIndex: "speed",
    key: "speed",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      const priceDiff = row.predict.price - row.current.price;
      const dateDiffMillis =
        new Date(row.predict.date) - new Date(row.current.date);
      const dateDiff = dateDiffMillis / (1000 * 60 * 60 * 24);
      let speed, speedPct;
      if (dateDiff <= 0) {
        speed = 0;
        speedPct = 0;
      } else {
        speed = Math.round((priceDiff / ((dateDiff / 7) * 5)) * 100) / 100;
        speedPct = Math.round((speed / dateDiff) * 10000) / 100;
      }

      let style = { textAlign: "right" };
      const currentDate = new Date(row.current.date);
      const predictDate = new Date(row.predict.date);
      if (predictDate < currentDate) {
        style.color = "gray";
      }

      return (
        <p style={style}>
          <span>{speedPct}%</span>
          <br />
          <small>{speed}</small>
        </p>
      );
    },
    defaultSortOrder: "descend",
    sorter: (a, b) => {
      const currentDate = new Date(a.current.date);
      const aPredictDate = new Date(a.predict.date);
      const bPredictDate = new Date(b.predict.date);

      if (aPredictDate <= currentDate && bPredictDate <= currentDate) {
        return aPredictDate - bPredictDate;
      } else if (aPredictDate <= currentDate) {
        return -1;
      } else if (bPredictDate <= currentDate) {
        return 1;
      }

      const aPriceDiff = a.predict.price - a.current.price;
      const aDateDiffMillis =
        new Date(a.predict.date) - new Date(a.current.date);
      const aDateDiff = aDateDiffMillis / (1000 * 60 * 60 * 24);
      const aSpeed =
        Math.round((aPriceDiff / ((aDateDiff / 7) * 5)) * 100) / 100;
      const aSpeedPct = aSpeed / aDateDiff;

      const bPriceDiff = b.predict.price - b.current.price;
      const bDateDiffMillis =
        new Date(b.predict.date) - new Date(b.current.date);
      const bDateDiff = bDateDiffMillis / (1000 * 60 * 60 * 24);
      const bSpeed =
        Math.round((bPriceDiff / ((bDateDiff / 7) * 5)) * 100) / 100;
      const bSpeedPct = bSpeed / bDateDiff;

      return aSpeedPct - bSpeedPct;
    },
  },
  {
    title: "獲利空間",
    dataIndex: "gain",
    key: "gain",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      let style = { textAlign: "right" };
      const currentDate = new Date(row.current.date);
      const predictDate = new Date(row.predict.date);
      if (predictDate < currentDate) {
        style.color = "gray";
      }

      return (
        <p style={style}>
          <span>{row.gain.price}</span>
          <br />
          <small>{row.gain.percentage}</small>
        </p>
      );
    },
    sorter: (a, b) => {
      const currentDate = new Date(a.current.date);
      const aPredictDate = new Date(a.predict.date);
      const bPredictDate = new Date(b.predict.date);

      if (aPredictDate <= currentDate && bPredictDate <= currentDate) {
        return aPredictDate - bPredictDate;
      } else if (aPredictDate <= currentDate) {
        return -1;
      } else if (bPredictDate <= currentDate) {
        return 1;
      }
      return a.gain.price - b.gain.price;
    },
  },
  {
    title: "起漲點",
    dataIndex: "start",
    key: "start",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      let style = { textAlign: "right" };

      const currentDate = new Date(row.current.date);
      const predictDate = new Date(row.predict.date);
      if (predictDate < currentDate) {
        style.color = "gray";
      }
      return (
        <p style={style}>
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
      let style = { textAlign: "right" };
      const currentDate = new Date(row.current.date);
      const predictDate = new Date(row.predict.date);
      if (predictDate < currentDate) {
        style.color = "gray";
      }
      return (
        <p style={style}>
          <span>{row.middle.price}</span>
          <br />
          <small>
            ({row.middle.difference.points}, {row.middle.difference.percentage}
            %)
          </small>
          <br />
          <small>{row.middle.date}</small>
        </p>
      );
    },
  },
  // {
  //   title: "現價",
  //   dataIndex: "currentPrice",
  //   key: "currentPrice",
  //   align: "right",
  //   width: 100,
  //   render: (text, row, index) => {
  //     let style = {};
  //     if (row.current.difference.points < 0) {
  //       style.color = "green";
  //     } else {
  //       style.color = "red";
  //     }
  //     return (
  //       <p style={{ textAlign: "right" }}>
  //         <span style={style}>{row.current.price}</span>
  //         <br />
  //         <span>{row.current.difference.percentage}%</span>
  //         <br />
  //         <small>{row.current.date}</small>
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
    width: 100,
    render: (text, row, index) => {
      const currentDate = new Date(row.current.date);
      const predictDate = new Date(row.predict.date);
      let style = {};
      if (predictDate < currentDate) {
        style.color = "gray";
      }
      
      return (
        <p style={style}>
          <span>{row.predict.price}</span>
          <br />
          <small>{row.predict.date}</small>
        </p>
      );
    },
    sorter: (a, b) => a.predict.price - b.predict.price,
  },
];

export const tabName = {
  new: "今日新增",
  hold: "持有",
  alert: "警戒",
  temp: "觀察",
};
