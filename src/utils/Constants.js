export const summaryLink = {
  v0: {
    TPE: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTICqnaz9FpFBdfQtoM4yhfWVudIxvBgp5s6EolSVN-RRq2wD4dPz3yWIH-5D29QBx-krn71isP4Lmn/pubhtml",
    NYSE: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFJ5ulGKfVIGPvKG_QL5Tr2CkV4Qjjm4jQb5LmIwQ-obbUao7SYDCBlO5qtF2VuznRuWY1pejrTB8j/pubhtml",
    NASDAQ:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzS1M2eoYGYH-g7Y_u1SCvcwTiAo4CxCjVwkGQzQpz7aQEY7aK3Wow47tpirw6mgKA384CKXU_QlWS/pubhtml",
    HKG: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLf9h7gj6CAlqRPAdwuWNvLBNmDzH1SJVexVAoZi_QRkaTDXIaUOK1NUKH-kQIAgl8twlvZjri_hL3/pubhtml",
  },
  latest: {
    TPE: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTzxFkoyT1UVa9rNWmyvxSi2Ioy0fEcfx8CD3vwajaVJwLsvCznU_b9BcnVhJi_A1H2Dnt-RiRGmnmK/pubhtml",
    NYSE: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTi87QTV9HZdcdNA6kmSSOwEFBx_uzX130j5pj8Efl6Yio68w3eP-sXEToK2q_LIeRc26nRYBxAFyQi/pubhtml",
    NASDAQ:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRudTTgDVo7o4RwuuzE0SyCSAr9ujsYrNZOfBvfLFWOwlwOjybvfDOHawX_MEqij1DgntvPp6Quva8F/pubhtml",
    HKG: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGvjUjUAXd6-QcSqyntcDKVnzW5Q7wohWSNfv_vVc3WvC-OYVGAg3xa_ywiuF-a0dmZy6iqwo0Pt5l/pubhtml",
  },
};

export const appScriptURL =
  "https://script.google.com/macros/s/AKfycbwsfAHpjGv-NdN14ZE2xQj_wMLBq4z1opf9DQ8g8tQh_Z-iZNkKC1IUK2SqKK4nVNdE/exec";

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
    fixed: "left",
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
          Math.round((currentPriceDiff / (currentDateDiff / 7)) * 100) / 100;
        currentSpeedPct =
          Math.round((currentSpeed / currentDateDiff) * 10000) / 100;
      }

      /*
      const pctToDouble = (pct) => {
        if (typeof pct === "number") return pct;
        try {
          return parseFloat(pct.substring(0, pct.length - 1));
        } catch (e) {
          console.error(row);
          return 0;
        }
      };
      */

      const expectPriceDiff = row.predict.price - row.current.price;
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
      if (row.index === 3675 && row.predict.date === "3/1/2022") {
        console.log(expectPriceDiff);
        console.log(expectDateDiff);
        console.log(expectSpeed);
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
  } /*
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
  },*/,
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
          <span>
            (+{row.gain.price}, {row.gain.percentage})
          </span>
          <br />
          <small>{row.predict.date}</small>
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
      return a.predict.price - b.predict.price;
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
];

export const tabName = {
  new: "今日新增",
  hold: "持有",
  alert: "警戒",
  temp: "觀察",
};
