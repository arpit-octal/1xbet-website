import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import AuthProvider from "../context/AuthContext";

const MarketDepth = () => {
  let { setMarketDepth, marketDepth, marketDepthData } =
    useContext(AuthProvider);
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(
    marketDepthData?.array?.length > 0
      ? marketDepthData?.array[0]?.RunnerName
      : ""
  );
  useEffect(() => {
    setSelect(
      marketDepthData?.array?.length > 0
        ? marketDepthData?.array[0]?.RunnerName
        : ""
    );
  }, [marketDepthData]);
  return (
    <div
      id="fancyBetBookLeftSide"
      className="overlay"
      style={{
        display:
          marketDepth && marketDepthData?.array?.length > 0 ? "flex" : "none",
      }}
    >
      <div id="sideWrap" className="side-wrap full-pop">
        <div className="side-head">
          <h3 class="a-depth">
            <img src={process.env.REACT_APP_URL + "/assets/images/home/transparent.gif"} alt={""} />
            Market Depth
          </h3>
          <a
            className="close"
            href="javascript:void(0)"
            onClick={() => {
              setMarketDepth(false);
            }}
          >
            Close
          </a>
        </div>

        {/* page_content */}

        <div className="side-content">
          <div className="path-wrap">
            <ul>
              <li>{marketDepthData?.matchName} - Match Odds</li>
            </ul>
          </div>

          <div className="function-wrap">
            <a
              className="form-select"
              href="javascript:void(0)"
              onClick={() => setOpen(!open)}
              id="runnerSelected"
            >
              {select}
            </a>
            {open && (
              <ul
                className="select-list"
                id="menuList"
                style={{ display: "block" }}
              >
                {marketDepthData?.array?.length > 0 &&
                  marketDepthData?.array?.map((res) => {
                    if (res.RunnerName !== select) {
                      return (
                        <li>
                          <a
                            onClick={() => {
                              setSelect(res.RunnerName);
                              setOpen(false);
                            }}
                            href="javascript:void(0)"
                          >
                            {res.RunnerName}
                          </a>
                        </li>
                      );
                    }
                  })}
              </ul>
            )}
          </div>

          <div className="chart-wrap">
            <h3>Price over time</h3>
            <div className="chart">
              {/* <img src="https://xtsd.betfair.com/LoadRunnerInfoChartAction/?marketId=208478087&amp;selectionId=414464&amp;handicap=0" alt="" id="chartImg"> */}
            </div>
            <ul className="check-list">
              <li>
                <a
                  className="checked"
                  href="javascript:MobileMarketDepthHandler.inverseAxis(1);"
                  id="chart1"
                >
                  Price
                </a>
              </li>
              <li>
                <a
                  className=""
                  href="javascript:MobileMarketDepthHandler.inverseAxis(2);"
                  id="chart2"
                >
                  %Chance
                </a>
              </li>
            </ul>
          </div>

          <div className="matched-wrap">
            <dl className="info-matched">
              <dd>
                <span>Total matched</span>
                <strong id="marketMatched">3,442,244,010</strong>
              </dd>
              <dd>
                <span>Selection Volume</span>
                <strong id="selectionMatched">3,176,186,917</strong>
              </dd>
              <dd>
                <span>Last price</span>
                <strong id="lastPrice">1.11</strong>
              </dd>
            </dl>

            <h3>Traded and Available</h3>

            <ul className="to-BackLay">
              <li>To back</li>
              <li>To lay</li>
            </ul>

            <div className="trade-wrap" id="reportArticle">
              <dl className="trade" id="backLay">
                <dd className="back-3">
                  <p>
                    1.01<span>6,882,753</span>
                  </p>
                </dd>
                <dd className="back-3">
                  <p>
                    1.02<span>5,682,288</span>
                  </p>
                </dd>
                <dd className="back-3">
                  <p>
                    1.03<span>5,698,309</span>
                  </p>
                </dd>
                <dd className="back-3">
                  <p>
                    1.04<span>5,849,754</span>
                  </p>
                </dd>
                <dd className="back-3">
                  <p>
                    1.05<span>5,726,215</span>
                  </p>
                </dd>
                <dd className="back-3">
                  <p>
                    1.06<span>6,404,930</span>
                  </p>
                </dd>
                <dd className="back-3">
                  <p>
                    1.07<span>6,853,926</span>
                  </p>
                </dd>
                <dd className="back-3">
                  <p>
                    1.08<span>4,562,884</span>
                  </p>
                </dd>
                <dd className="back-3">
                  <p>
                    1.09<span>6,595,935</span>
                  </p>
                </dd>
                <dd className="back-3">
                  <p>
                    1.1<span>11,607,002</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.11<span>277,405</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.12<span>1,845,481</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.13<span>4,446,573</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.14<span>552,876</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.15<span>536,893</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.16<span>1,177,778</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.17<span>35,413</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.18<span>38,306</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.19<span>27,206</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.2<span>18,723</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.21<span>27,942</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.22<span>102,088</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.23<span>25,171</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.24<span>172,725</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.25<span>164,844</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.26<span>11,472</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.27<span>20,325</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.28<span>412,432</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.29<span>37,723</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.3<span>123,167</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.31<span>123,278</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.32<span>24,321</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.33<span>7,671</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.34<span>27,289</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.35<span>105,550</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.36<span>2,918</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.37<span>1,039</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.38<span>4,762</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.39<span>3,230</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.4<span>53,101</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.41<span>23,523</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.42<span>36,763</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.43<span>1,338</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.44<span>23,662</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.45<span>55,643</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.46<span>1,120</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.47<span>1,039</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.48<span>50,071</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.49<span>6,479</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.5<span>70,342</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.51<span>8,868</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.52<span>11,670</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.53<span>4,148</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.54<span>506</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.55<span>12,632</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.56<span>17,767</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.57<span>944</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.58<span>8,195</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.59<span>3,202</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.6<span>20,990</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.61<span>17,419</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.62<span>17,921</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.63<span>432</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.64<span>534</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.65<span>8,875</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.66<span>130,595</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.67<span>3,804</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.68<span>18,673</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.69<span>707</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.7<span>24,437</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.71<span>442</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.72<span>9,844</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.73<span>517</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.74<span>2,570</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.75<span>1,165</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.76<span>1,542</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.77<span>184,163</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.78<span>728</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.79<span>705</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.8<span>8,868</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.81<span>346</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.82<span>346</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.83<span>645</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.84<span>19,382</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.85<span>1,290</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.86<span>346</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.87<span>346</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.88<span>8,563</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.89<span>3,842</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.9<span>13,214</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.91<span>346</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.92<span>346</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.93<span>579</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.94<span>346</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.95<span>7,314</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.96<span>1,628</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.97<span>16,539</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.98<span>3,514</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1.99<span>1,248</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2<span>60,790</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.02<span>5,110</span>
                  </p>
                </dd>
                <dd>
                  <p>
                    2.04<span>5,177,128</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.06<span>68,539</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.08<span>1</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.1<span>67,261</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.12<span>167</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.14<span>2,636</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.16<span>2,636</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.18<span>1,951</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.2<span>31,557</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.22<span>5,034</span>
                  </p>
                </dd>
                <dd>
                  <p>
                    2.24<span>4,838</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.26<span>40,832</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.28<span>2,988</span>
                  </p>
                </dd>
                <dd>
                  <p>
                    2.3<span>68,160</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.32<span>1,793</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.34<span>538</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.36<span>12</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.38<span>119</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.4<span>10,881</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.44<span>520</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.46<span>407</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.48<span>1,043</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.5<span>2,951</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.58<span>445</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.62<span>592</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.74<span>592</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.78<span>148</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.84<span>938</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.88<span>1,203</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    2.9<span>585</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    3<span>45,293</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    3.05<span>1,626</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    3.15<span>104</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    3.2<span>171</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    3.4<span>1,912</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    3.6<span>2,272</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    4<span>6,540</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    4.6<span>2,601</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    5<span>11,072</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    5.5<span>56</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    5.6<span>3,902</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    6<span>7,154</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    7<span>276</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    7.8<span>1,626</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    8<span>1,136</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    8.6<span>3,902</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    9<span>94</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    10<span>3,252</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    11<span>325</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    11.5<span>780</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    12.5<span>112</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    13<span>3,902</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    16<span>520</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    17<span>131</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    18<span>568</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    20<span>3,252</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    21<span>335</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    22<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    23<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    24<span>160</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    25<span>335</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    26<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    27<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    28<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    29<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    30<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    32<span>100</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    34<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    36<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    38<span>219</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    40<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    42<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    44<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    46<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    48<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    50<span>100</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    55<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    60<span>237</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    65<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    70<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    75<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    80<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    85<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    90<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    95<span>50</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    100<span>100</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    110<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    120<span>215</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    130<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    140<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    150<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    160<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    170<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    180<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    190<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    200<span>72</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    210<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    220<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    230<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    240<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    250<span>235</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    260<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    270<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    280<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    290<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    300<span>60</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    310<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    320<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    330<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    340<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    350<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    360<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    370<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    380<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    390<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    400<span>60</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    410<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    420<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    430<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    440<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    450<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    460<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    470<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    480<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    490<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    500<span>60</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    510<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    520<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    530<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    540<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    550<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    560<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    570<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    580<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    590<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    600<span>60</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    610<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    620<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    630<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    640<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    650<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    660<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    670<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    680<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    690<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    700<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    710<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    720<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    730<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    740<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    750<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    760<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    770<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    780<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    790<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    800<span>5,692</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    810<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    820<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    830<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    840<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    850<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    860<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    870<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    880<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    890<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    900<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    910<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    920<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    930<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    940<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    950<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    960<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    970<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    980<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    990<span>10</span>
                  </p>
                </dd>
                <dd className="lay-3">
                  <p>
                    1000<span>47</span>
                  </p>
                </dd>
              </dl>
              <dl className="trade-2" id="traded">
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p>13,773</p>
                </dd>
                <dd>
                  <p>77,305,404</p>
                </dd>
                <dd>
                  <p>73,226,353</p>
                </dd>
                <dd>
                  <p>48,738,427</p>
                </dd>
                <dd>
                  <p>163,427,082</p>
                </dd>
                <dd>
                  <p>178,079,539</p>
                </dd>
                <dd>
                  <p>180,168,377</p>
                </dd>
                <dd>
                  <p>107,256,377</p>
                </dd>
                <dd>
                  <p>120,654,581</p>
                </dd>
                <dd>
                  <p>38,481,263</p>
                </dd>
                <dd>
                  <p>41,887,619</p>
                </dd>
                <dd>
                  <p>56,113,653</p>
                </dd>
                <dd>
                  <p>18,307,227</p>
                </dd>
                <dd>
                  <p>21,748,109</p>
                </dd>
                <dd>
                  <p>14,343,960</p>
                </dd>
                <dd>
                  <p>9,671,242</p>
                </dd>
                <dd>
                  <p>40,031,115</p>
                </dd>
                <dd>
                  <p>14,977,090</p>
                </dd>
                <dd>
                  <p>4,720,987</p>
                </dd>
                <dd>
                  <p>38,715,377</p>
                </dd>
                <dd>
                  <p>8,277,105</p>
                </dd>
                <dd>
                  <p>5,172,067</p>
                </dd>
                <dd>
                  <p>11,245,006</p>
                </dd>
                <dd>
                  <p>3,308,580</p>
                </dd>
                <dd>
                  <p>6,583,014</p>
                </dd>
                <dd>
                  <p>197,441,880</p>
                </dd>
                <dd>
                  <p>36,526,403</p>
                </dd>
                <dd>
                  <p>14,587,206</p>
                </dd>
                <dd>
                  <p>1,284,470</p>
                </dd>
                <dd>
                  <p>4,276,171</p>
                </dd>
                <dd>
                  <p>9,408,642</p>
                </dd>
                <dd>
                  <p>16,503,021</p>
                </dd>
                <dd>
                  <p>25,788,575</p>
                </dd>
                <dd>
                  <p>7,028,315</p>
                </dd>
                <dd>
                  <p>5,863,401</p>
                </dd>
                <dd>
                  <p>32,260,056</p>
                </dd>
                <dd>
                  <p>13,967,128</p>
                </dd>
                <dd>
                  <p>9,571,667</p>
                </dd>
                <dd>
                  <p>24,721,955</p>
                </dd>
                <dd>
                  <p>97,414,151</p>
                </dd>
                <dd>
                  <p>126,826,681</p>
                </dd>
                <dd>
                  <p>161,336,132</p>
                </dd>
                <dd>
                  <p>15,052,571</p>
                </dd>
                <dd>
                  <p>8,966,587</p>
                </dd>
                <dd>
                  <p>10,761,018</p>
                </dd>
                <dd>
                  <p>20,437,470</p>
                </dd>
                <dd>
                  <p>54,081,020</p>
                </dd>
                <dd>
                  <p>24,155,919</p>
                </dd>
                <dd>
                  <p>19,289,126</p>
                </dd>
                <dd>
                  <p>7,086,143</p>
                </dd>
                <dd>
                  <p>20,551,323</p>
                </dd>
                <dd>
                  <p>20,269,160</p>
                </dd>
                <dd>
                  <p>50,813,220</p>
                </dd>
                <dd>
                  <p>57,429,288</p>
                </dd>
                <dd>
                  <p>8,786,073</p>
                </dd>
                <dd>
                  <p>8,763,629</p>
                </dd>
                <dd>
                  <p>6,132,586</p>
                </dd>
                <dd>
                  <p>1,217,763</p>
                </dd>
                <dd>
                  <p>3,654,801</p>
                </dd>
                <dd>
                  <p>11,339,685</p>
                </dd>
                <dd>
                  <p>12,547,185</p>
                </dd>
                <dd>
                  <p>13,502,707</p>
                </dd>
                <dd>
                  <p>8,181,662</p>
                </dd>
                <dd>
                  <p>77,727,328</p>
                </dd>
                <dd>
                  <p>55,419,676</p>
                </dd>
                <dd>
                  <p>20,611,512</p>
                </dd>
                <dd>
                  <p>8,985,042</p>
                </dd>
                <dd>
                  <p>4,996,562</p>
                </dd>
                <dd>
                  <p>11,975,212</p>
                </dd>
                <dd>
                  <p>6,518,823</p>
                </dd>
                <dd>
                  <p>7,864,140</p>
                </dd>
                <dd>
                  <p>34,314,320</p>
                </dd>
                <dd>
                  <p>10,495,560</p>
                </dd>
                <dd>
                  <p>193,603,401</p>
                </dd>
                <dd>
                  <p>12,310,763</p>
                </dd>
                <dd>
                  <p>3,937,917</p>
                </dd>
                <dd>
                  <p>6,086,934</p>
                </dd>
                <dd>
                  <p>1,678,073</p>
                </dd>
                <dd>
                  <p>4,007,140</p>
                </dd>
                <dd>
                  <p>2,145,948</p>
                </dd>
                <dd>
                  <p>1,135,390</p>
                </dd>
                <dd>
                  <p>1,941,046</p>
                </dd>
                <dd>
                  <p>1,218,544</p>
                </dd>
                <dd>
                  <p>1,880,027</p>
                </dd>
                <dd>
                  <p>2,314,389</p>
                </dd>
                <dd>
                  <p>1,774,468</p>
                </dd>
                <dd>
                  <p>2,746,830</p>
                </dd>
                <dd>
                  <p>2,959,312</p>
                </dd>
                <dd>
                  <p>1,951,945</p>
                </dd>
                <dd>
                  <p>5,947,793</p>
                </dd>
                <dd>
                  <p>2,817,357</p>
                </dd>
                <dd>
                  <p>9,581,276</p>
                </dd>
                <dd>
                  <p>3,935,951</p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p>75,646,105</p>
                </dd>
                <dd>
                  <p>123,728,081</p>
                </dd>
                <dd>
                  <p>14,213,118</p>
                </dd>
                <dd>
                  <p>3,989,352</p>
                </dd>
                <dd>
                  <p>79,897</p>
                </dd>
                <dd>
                  <p>23</p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p>3,518</p>
                </dd>
                <dd>
                  <p>8,245</p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p>7,260</p>
                </dd>
                <dd>
                  <p>14,870</p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p>39,045</p>
                </dd>
                <dd>
                  <p>7,795</p>
                </dd>
                <dd>
                  <p>38,632</p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
                <dd>
                  <p></p>
                </dd>
              </dl>
            </div>
            <div
              className="trade-wrap"
              id="reportArticleTemplate"
              style={{ display: "none" }}
            >
              <dl className="trade">
                <dd>
                  <p>
                    500040
                    <span>Xl</span>
                  </p>
                </dd>
              </dl>

              <dl className="trade-2">
                <dd>lg</dd>
              </dl>
            </div>
          </div>
          <p className="info-other">
            The information on this page may be slightly delayed.
          </p>
        </div>

        {/* end_page_content */}
      </div>
    </div>
  );
};

export default MarketDepth;
