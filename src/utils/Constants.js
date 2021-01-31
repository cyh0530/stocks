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
      let action = text;
      if (text === "買") {
        style.color = "red";
      } else if (text === "賣") {
        style.color = "green";
      }
      const currentDate = new Date(row.current.date);
      const predictDate = new Date(row.predict.date);
      if (predictDate < currentDate) {
        style.color = "gray";
      }
      return (
        <p style={style}>
          {action}
          <br />
          {row.message}
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
      const middleDate = new Date(row.middle.date);
      const currentDate = new Date(row.current.date);
      const predictDate = new Date(row.predict.date);

      const currentPriceDiff = row.current.price - row.middle.price;
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

      const expectPriceDiff = row.predict.price - row.middle.price;
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

      let style = { textAlign: "right" };

      if (predictDate < currentDate) {
        style.color = "gray";
      }

      return (
        <p style={style}>
          {currentDateDiffMillis / expectDateDiffMillis >= 0.05 ? (
            <>
              實際: {currentSpeedPct}% <small>({currentSpeed})</small>
              <br />
            </>
          ) : null}
          預期: {expectSpeedPct}% <small>({expectSpeed})</small>
        </p>
      );
    },
    sorter: (a, b) => {
      const currentDate = new Date(a.current.date);
      const aMiddleDate = new Date(a.middle.date);
      const bMiddleDate = new Date(b.middle.date);
      const aPredictDate = new Date(a.predict.date);
      const bPredictDate = new Date(b.predict.date);

      if (aPredictDate <= currentDate && bPredictDate <= currentDate) {
        return aPredictDate - bPredictDate;
      } else if (aPredictDate <= currentDate) {
        return -1;
      } else if (bPredictDate <= currentDate) {
        return 1;
      }

      const aCurrentPriceDiff = a.current.price - a.middle.price;
      const aCurrentDateDiffMillis = currentDate - aMiddleDate;
      const aCurrentDateDiff = aCurrentDateDiffMillis / (1000 * 60 * 60 * 24);
      const aCurrentSpeed =
        Math.round((aCurrentPriceDiff / ((aCurrentDateDiff / 7) * 5)) * 100) /
        100;
      const aCurrentSpeedPct = aCurrentSpeed / aCurrentDateDiff;

      const aExpectPriceDiff = a.predict.price - a.middle.price;
      const aExpectDateDiffMillis = aPredictDate - aMiddleDate;
      const aExpectDateDiff = aExpectDateDiffMillis / (1000 * 60 * 60 * 24);
      const aExpectSpeed =
        Math.round((aExpectPriceDiff / ((aExpectDateDiff / 7) * 5)) * 100) /
        100;
      const aExpectSpeedPct = aExpectSpeed / aExpectDateDiff;

      let aSpeedPct = aExpectSpeedPct;

      if (aCurrentDateDiffMillis / aExpectDateDiffMillis >= 0.1) {
        aSpeedPct = Math.min(aCurrentSpeedPct, aExpectSpeedPct);
      }

      const bCurrentPriceDiff = b.current.price - b.middle.price;
      const bCurrentDateDiffMillis = currentDate - bMiddleDate;
      const bDateDiff = bCurrentDateDiffMillis / (1000 * 60 * 60 * 24);
      const bCurrentSpeed =
        Math.round((bCurrentPriceDiff / ((bDateDiff / 7) * 5)) * 100) / 100;
      const bCurrentSpeedPct = bCurrentSpeed / bDateDiff;

      const bExpectPriceDiff = b.predict.price - b.middle.price;
      const bExpectDateDiffMillis = bPredictDate - bMiddleDate;
      const bExpectDateDiff = bExpectDateDiffMillis / (1000 * 60 * 60 * 24);
      const bExpectSpeed =
        Math.round((bExpectPriceDiff / ((bExpectDateDiff / 7) * 5)) * 100) /
        100;
      const bExpectSpeedPct = bExpectSpeed / bExpectDateDiff;

      let bSpeedPct = bExpectSpeedPct;

      if (bCurrentDateDiffMillis / bExpectDateDiffMillis >= 0.1) {
        bSpeedPct = Math.min(bCurrentSpeedPct, bExpectSpeedPct);
      }

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
    defaultSortOrder: "ascend",
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
