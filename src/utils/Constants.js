export const summaryLink =
  "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQGMwv4tEoSbTjgtSht6LZ5Vxlwb0Y4Lm1z5Pp0tuBcSaZE9AMTY_isyio7Sc-_C8LHsfv_xMptHeqA/pubhtml";

export const appScriptURL =
  "https://script.google.com/a/uw.edu/macros/s/AKfycbzdeg0uAW8TFykGSnDPjMxYhAayyAfcQEnuByZm7ykEKiXJbdk/exec?";
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
      const speed = Math.round((priceDiff / ((dateDiff / 7) * 5)) * 100) / 100;
      const speedPct = Math.round((speed / dateDiff) * 100) / 100;
      return (
        <p style={{ textAlign: "right" }}>
          <span>{speedPct}%</span>
          <br />
          <small>{speed}</small>
        </p>
      );
    },
    defaultSortOrder: "descend",
    sorter: (a, b) => {
      const aPriceDiff = a.predict.price - a.current.price;
      const aDateDiffMillis =
        new Date(a.predict.date) - new Date(a.current.date);
      const aDateDiff = aDateDiffMillis / (1000 * 60 * 60 * 24);
      const aSpeed =
        Math.round((aPriceDiff / ((aDateDiff / 7) * 5)) * 100) / 100;
      const aSpeedPct = Math.round((aSpeed / aDateDiff) * 100) / 100;

      const bPriceDiff = b.predict.price - b.current.price;
      const bDateDiffMillis =
        new Date(b.predict.date) - new Date(b.current.date);
      const bDateDiff = bDateDiffMillis / (1000 * 60 * 60 * 24);
      const bSpeed =
        Math.round((bPriceDiff / ((bDateDiff / 7) * 5)) * 100) / 100;
      const bSpeedPct = Math.round((bSpeed / bDateDiff) * 100) / 100;

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
      return (
        <p style={{ textAlign: "right" }}>
          <span>{row.gain.price}</span>
          <br />
          <small>{row.gain.percentage}</small>
        </p>
      );
    },
    sorter: (a, b) => a.gain.price - b.gain.price,
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
          <small>{row.middle.date}</small>
        </p>
      );
    },
  },
  {
    title: "現價",
    dataIndex: "currentPrice",
    key: "currentPrice",
    align: "right",
    width: 100,
    render: (text, row, index) => {
      let style = { textAlign: "right" };
      if (row.current.price < row.buy.price) {
        style.color = "green";
      } else {
        style.color = "red";
      }
      return (
        <p style={style}>
          <span>{row.current.price}</span>
          <br />
          <small style={{ color: "black" }}>{row.current.date}</small>
        </p>
      );
    },
  },
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
      return (
        <p style={{ textAlign: "right" }}>
          <span>{row.predict.price}</span>
          <br />
          <small>{row.predict.date}</small>
        </p>
      );
    },
    sorter: (a, b) => a.predict.price - b.predict.price,
  },
];
