import { isEmpty } from "lodash";
import React, { useContext, useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { toast } from "wc-toast";
import AuthProvider from "../context/AuthContext";
import BetSlipContext from "../context/BetSlipContext";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";

function Setting() {
  let { setSettingToogle, settingToogle, setProfileData, user } =
    useContext(AuthProvider);
  let { setBetSelectionObj, betSelectionObj, setDefaultStake, setDefaultOdds } =
    useContext(BetSlipContext);
  const [stakedata, setStakeData] = useState([]);
  const location = useLocation();
  const [editShown, setEditShown] = useState(false);
  const [mainStake, setMainStake] = useState([]);
  const [isLoader, setLoader] = useState(false);
  const [binaryChecked, setBinaryChecked] = useState(false);
  const [sportsBookChecked, setSportsBookChecked] = useState(false);
  const [fancyBetChecked, setFancyBetChecked] = useState(false);
  const [oddsChecked, setOddsChecked] = useState(false);
  const [okShown, setOkShown] = useState(true);
  const [bid, setBid] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({});
  useEffect(() => {
    if (location.pathname.split("/")[1] == "match-details") {
      setBetSelectionObj({ ...betSelectionObj, bidPrice: bid });
    }
  }, [location]);

  const myProfile = async () => {
    if (!isEmpty(user)) {
      const { status, data: response_users } = await apiGet(
        apiPath.userProfile
      );
      if (status === 200) {
        if (response_users.success) {
          setProfileData(response_users?.results);
          setValue("defaultStake", response_users?.results?.defaultStake);
          let stakeD = response_users?.results?.editStake;
          stakeD.sort((a, b) => a - b);
          setStakeData(stakeD);
          var commonstake = response_users?.results?.stake.filter((i) =>
            stakeD.includes(i)
          );

          setDefaultStake(response_users?.results?.defaultStake);
          setBid(response_users?.results?.defaultStake);
          setBetSelectionObj({
            ...betSelectionObj,
            bidPrice: response_users?.results?.defaultStake,
            expectany: response_users?.results?.fancyBet,
          });
          setDefaultOdds(response_users?.results?.fancyBet);
          setMainStake(commonstake);
          setOddsChecked(response_users?.results?.odds);

          setSportsBookChecked(response_users?.results?.sportsBook);
          setFancyBetChecked(response_users?.results?.fancyBet);
          setBinaryChecked(response_users?.results?.binary);
        }
      }
    }
  };
  useEffect(() => {
    myProfile();
  }, []);
  const onSubmit = async (request) => {
    setLoader(true);
    if (!isEmpty(mainStake) && mainStake.length > 4) {
      try {
        const { status, data: response_users } = await apiPost(
          apiPath.userProfileUpdate,
          {
            defaultStake: request.defaultStake,
            fancyBet: fancyBetChecked,
            sportsBook: sportsBookChecked,
            binary: binaryChecked,
            odds: oddsChecked,
            stake: mainStake,
          }
        );
        if (status === 200) {
          if (response_users.success) {
            setLoader(false);
            setDefaultStake(request.defaultStake);
            setBetSelectionObj({
              ...betSelectionObj,
              bidPrice: request.defaultStake,
              expectany: response_users?.results?.fancyBet,
            });
            setDefaultOdds(response_users?.results?.fancyBet);
            setBid(request.defaultStake);
            // setDefaultStake(response_users?.results?.defaultStake);
            setMainStake(response_users?.results?.stake);
            setOddsChecked(response_users?.results?.odds);
            setSportsBookChecked(response_users?.results?.sportsBook);
            setFancyBetChecked(response_users?.results?.fancyBet);
            setBinaryChecked(response_users?.results?.binary);
            toast.success(response_users.message);
            // setDropDownShow(false);
            // loginUserDetail();
            myProfile();
            setSettingToogle(false);
          } else {
            setLoader(false);
            toast.error(response_users.message);
          }
        }
        setLoader(false);
      } catch (err) {
        setLoader(false);
        toast.error(err.response.data.message);
      }
    } else {
      setLoader(false);
      toast.error("please select at least 5 stake");
    }
  };
  const handleEditClick = (event) => {
    setEditShown(true);
    setOkShown(false);
  };
  const handleStake = (e, i) => {
    let values = [...stakedata];
    values[i] = parseInt(Number(e.target.value));
    setStakeData(values);
  };
  const handleOkClick = async (event) => {
    try {
      const { status, data: response_users } = await apiPost(
        apiPath.userEditStake,
        { editStake: stakedata }
      );
      if (status === 200) {
        if (response_users.success) {
        } else {
        }
      }
    } catch (err) { }

    stakedata.sort((a, b) => a - b);
    setOkShown(true);
    setEditShown(false);
  };
  const setStakeShow = (value) => {
    let main = [...mainStake];
    const index = main.indexOf(value);
    if (mainStake.length < 6) {
      if (index === -1) {
        main.push(value);
      } else {
        main.splice(index, 1);
      }
    } else {
      if (index === -1) {
        main.sort((a, b) => a - b);
        main.shift();
        main.push(value);
      } else {
        main.splice(index, 1);
      }
    }
    setMainStake(main);
  };
  return (
    <>
      <div
        className="overlay right-side"
        id="settingDiv"
        style={{ display: settingToogle ? "block" : "none" }}
      >
        <div className="side-wrap setting-wrap" id="settingSlide">
          <div className="side-head">
            <h3 className="a-setting">
              <img
                src={
                  process.env.REACT_APP_URL +
                  "/assets/images/home/transparent.gif"
                }
                alt={""}
              />
              Setting
            </h3>
            <a
              className="close ui-link"
              onClick={() => setSettingToogle(false)}
              href="javascript:void(0)"
              id="settingClose"
            ></a>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div id="coinList" className="side-content">
              <h3>Stake</h3>
              <dl className="setting-block">
                <dt>
                  Default stake
                  <input
                    type="number"
                    id="userCoin"
                    // pattern="[0-9]*"
                    // data-role="none"
                    {...register("defaultStake")}
                  />
                </dt>
              </dl>
              {okShown && (
                <dl id="stakeSet" className="setting-block stake-setting">
                  <dt>Quick Stakes</dt>
                  {stakedata &&
                    stakedata.map((item, index) => {
                      return (
                        <dd key={index + 1}>
                          <a
                            href="javascript:void(0)"
                            id={"coin_" + index + 1}
                            className={
                              mainStake.includes(item) ? "btn select" : "btn"
                            }
                            onClick={(event) => setStakeShow(item)}
                          >
                            {item}
                          </a>
                        </dd>
                      );
                    })}
                  <dd className="col-stake_edit">
                    <Button
                      className="btn-edit ui-link"
                      onClick={handleEditClick}
                    >
                      Edit
                      <i className="ms-1 fas fa-pencil"></i>
                    </Button>
                  </dd>
                </dl>
              )}

              {editShown && (
                <dl
                  id="editCustomizeStakeList"
                  className="setting-block stake-setting"
                  style={{ display: "flex" }}
                >
                  <dt>Quick Stakes</dt>

                  {stakedata &&
                    stakedata.map((item, index) => {
                      return (
                        <dd>
                          <div
                            key={index + 1}
                            className="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"
                          >
                            <input
                              id="stakeEdit_1"
                              type="text"
                              name="stake[]"
                              pattern="[0-9]*"
                              value={item}
                              onChange={(e) => handleStake(e, index)}
                            />
                          </div>
                        </dd>
                      );
                    })}

                  <dd className="col-stake_edit">
                    <Button
                      className="btn-send ui-link w-100"
                      onClick={handleOkClick}
                    >
                      OK
                    </Button>
                  </dd>
                </dl>
              )}

              <h3>Odds</h3>
              <dl className="setting-block">
                <dt>Highlight when odds change</dt>
                <dd>
                  <a
                    className={oddsChecked ? "switch_on" : "switch_off"}
                    onClick={() => setOddsChecked(!oddsChecked)}
                    href="javascript:void(0)"
                    id="enableSparkCheck"
                  >
                    <input type="hidden" id="sparkValue" value="0" />
                    <span></span>
                  </a>
                </dd>
              </dl>

              <h3>FancyBet</h3>
              <dl className="setting-block">
                <dt>Accept Any Odds</dt>
                <dd>
                  <a
                    className={fancyBetChecked ? "switch_on" : "switch_off"}
                    onClick={() => setFancyBetChecked(!fancyBetChecked)}
                    href="javascript:void(0)"
                    id="enableSparkCheck"
                  >
                    <input type="hidden" id="sparkValue" value="0" />
                    <span></span>
                  </a>
                </dd>
                {/* <dd>
                  <p className="switch_on" id="enableSparkCheck">
                    <Form.Check
                      onChange={(e) => setFancyBetChecked(!fancyBetChecked)}
                      checked={fancyBetChecked}
                      type="hidden"
                      id="sparkValue"
                      value="1"
                    />
                    <span></span>
                  </p>
                </dd> */}
              </dl>

              <h3>SportsBook</h3>
              <dl className="setting-block">
                <dt>Accept Any Odds</dt>
                <dd>
                  <a
                    className={sportsBookChecked ? "switch_on" : "switch_off"}
                    onClick={() => setSportsBookChecked(!sportsBookChecked)}
                    href="javascript:void(0)"
                    id="enableSparkCheck"
                  >
                    <input type="hidden" id="sparkValue" value="0" />
                    <span></span>
                  </a>
                </dd>
                {/* <dd>
                  <p className="switch_on" id="enableSparkCheck">
                    <Form.Check
                      onChange={(e) => setSportsBookChecked(!sportsBookChecked)}
                      checked={sportsBookChecked}
                      type="hidden"
                      id="sparkValue"
                      value="1"
                    />
                    <span></span>
                  </p>
                </dd> */}
              </dl>
              <h3>Binary</h3>
              <dl className="setting-block">
                <dt>Accept Any Price</dt>
                <dd>
                  <a
                    className={binaryChecked ? "switch_on" : "switch_off"}
                    onClick={() => setBinaryChecked(!binaryChecked)}
                    href="javascript:void(0)"
                    id="enableSparkCheck"
                  >
                    <input type="hidden" id="sparkValue" value="0" />
                    <span></span>
                  </a>
                </dd>
                {/* <dd>
                  <p className="switch_on" id="enableSparkCheck">
                    <Form.Check
                      onChange={(e) => setBinaryChecked(!binaryChecked)}
                      checked={binaryChecked}
                      type="hidden"
                      id="sparkValue"
                      value="1"
                    />
                    <span></span>
                  </p>
                </dd> */}
              </dl>
              <ul className="btn-list">
                <li>
                  <Button
                    onClick={() => setSettingToogle(false)}
                    disabled={editShown ? true : ""}
                    id="settingCancel"
                    className="btn ui-link w-100"
                  >
                    Cancel
                  </Button>
                </li>
                <li>
                  <Button
                    disabled={editShown ? true : ""}
                    id="settingSave"
                    className="btn-send ui-link w-100"
                    type="submit"
                  >
                    {isLoader ? "Loading..." : "Save"}
                  </Button>
                </li>
              </ul>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Setting;
