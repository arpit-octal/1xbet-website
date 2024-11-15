import React, { useContext } from "react";
import BetSlipContext from "../../context/BetSlipContext";

const PriceList = ({ stake }) => {
  let { inputType, setBetSelectionObj, betSelectionObj } =
    useContext(BetSlipContext);
  // console.log(betSelectionObj?.inputType, "betSelectionObj?.inputType");
  return (
    <>
      <ul id="stakePopupList" className="coin-list">
        {(stake?.length > 0 ? stake : price).map((res) => {
          return (
            <li
              onClick={() => {
                return betSelectionObj?.inputType == "odds"
                  ? setBetSelectionObj({ ...betSelectionObj, oddsSelect: res })
                  : betSelectionObj?.inputType == "price"
                  ? setBetSelectionObj({ ...betSelectionObj, bidPrice: res })
                  : "";
              }}
            >
              <a id="selectStake_1" href="javascript:void(0)">
                {res}
              </a>
            </li>
          );
        })}
      </ul>

      <div id="keyboard" className="keyboard-wrap">
        <ul id="numPad" className="btn-tel">
          {keyboard.map((res) => {
            return res.value !== "." ? (
              <li
                onClick={() => {
                  return betSelectionObj?.inputType == "odds"
                    ? setBetSelectionObj({
                        ...betSelectionObj,
                        oddsSelect: betSelectionObj?.oddsSelect + res.value,
                      })
                    : betSelectionObj?.inputType == "price"
                    ? setBetSelectionObj({
                        ...betSelectionObj,
                        bidPrice: String(betSelectionObj?.bidPrice) + String(res.value),
                      })
                    : "";
                }}
              >
                <a href="javascript:void(0)">{res.value}</a>
              </li>
            ) : (
              <li>
                <a href="javascript:void(0)">{res.value}</a>
              </li>
            );
          })}
        </ul>
        <a
          id="delete"
          className="btn-delete"
          onClick={() => {
            if (betSelectionObj?.inputType == "odds") {
              setBetSelectionObj({
                ...betSelectionObj,
                oddsSelect:
                  betSelectionObj?.oddsSelect.length > 0
                    ? betSelectionObj?.oddsSelect.slice(
                        0,
                        betSelectionObj?.oddsSelect.length - 1
                      )
                    : "",
              });
            } else if (betSelectionObj?.inputType == "price") {
              setBetSelectionObj({
                ...betSelectionObj,
                bidPrice:
                  String(betSelectionObj?.bidPrice)?.length > 0
                    ? String(betSelectionObj?.bidPrice)?.slice(
                        0,
                        String(betSelectionObj?.bidPrice).length - 1
                      )
                    : "",
              });
            }
            // return betSelectionObj?.inputType == "odds"
            //   ? setBetSelectionObj({
            //       ...betSelectionObj,
            //       oddsSelect:
            //         betSelectionObj?.oddsSelect.length > 0
            //           ? betSelectionObj?.oddsSelect.slice(
            //               0,
            //               betSelectionObj?.oddsSelect.length - 1
            //             )
            //           : "",
            //     })
            //   : betSelectionObj?.inputType == "price"
            //   ? setBetSelectionObj({
            //       ...betSelectionObj,
            //       bidPrice:
            //         betSelectionObj?.bidPrice.length > 0
            //           ? betSelectionObj?.bidPrice.slice(
            //               0,
            //               betSelectionObj?.bidPrice.length - 1
            //             )
            //           : "",
            //     })
            //   : "";
          }}
          href="javascript:void(0)"
        ></a>
      </div>
    </>
  );
};

export default PriceList;
const keyboard = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 9 },
  { value: 0 },
  { value: "00" },
  { value: "." },
];
const price = [5, 100, 250, 300, 1000, 2000];
