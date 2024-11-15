import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { toast } from "wc-toast";
import { Button } from "react-bootstrap";
import Slider from "react-slick";
import ReactPaginate from "react-paginate";
function CasinoGames() {
  const location = useLocation();
  const [vendors, setVendors] = useState();
  const [vendor, setVendor] = useState();
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(21);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    pageSize: 21,
  });

  const settings = {
    dots: true, // Show dots at the bottom
    infinite: true, // Enable infinite scrolling
    speed: 500, // Transition speed
    slidesToShow: 4, // Number of slides to show at once
    slidesToScroll: 4, // Number of slides to scroll at once
    responsive: [
      {
        breakpoint: 1024, // Screen width at which settings will apply
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          initialSlide: 5,
        },
      },
      {
        breakpoint: 600, // Screen width at which settings will apply
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480, // Screen width at which settings will apply
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          variableWidth: true,
        },
      },
    ],
  };

  const handlePageClick = (event) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
  };

  const navigate = useNavigate();
  let { user, setCasinoGameUrl, setLoader, user_coins, loader, setSearchToogleCasino } = useContext(AuthProvider);

  const casinoVenders = async () => {
    try {
      setLoader(true);
      const { status, data: response } = await apiGet(apiPath.casinoVendors);
      if (status === 200) {
        if (!response.error) {
          if (response.data) {
            let data = [];
            if (response.data.length > 0) {
              data = response.data.map((item) => {
                if (item.providerName != "") {
                  return {
                    name: item.providerName,
                    image: `/assets/images/home/${item.providerName.toLowerCase()}.jpeg`,
                    labelName: item.labelName,
                  };
                } else {
                  return {
                    name: item.providerName,
                    image: "/assets/images/home/vendor.png",
                    labelName: item.labelName,
                  };
                }
              });
            }
            if (data.length > 0) setVendor(data[0].name);
            setVendors(data);
            setLoader(false);
          }
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const casinoGamesList = async (vendor) => {
    console.log("vendor: ", vendor);
    try {
      setLoader(true);
      const { status, data: response } = await apiGet(apiPath.casinoGamesList, { provider: vendor, pageSize });
      if (status === 200) {
        if (!response.error) {
          if (response.data) {
            setLoader(false);
            setGames(response.data);
            setPageCount(response.totalPages);
            if (response.hasNextPage) {
              setShowLoadMore(true);
            } else {
              setShowLoadMore(false);
            }
          }
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const casinoGameURL = async (gameId, providerName) => {
    try {
      setLoader(true);
      const data = {
        gameId,
        providerName,
        balance: user_coins?.totalCoins,
      };
      console.log("data====>>>", data);
      const { status, data: response } = await apiPost(apiPath.casinoGameLogin, data);
      console.log("response", response.url);
      if (status === 200) {
        if (response.status == 0) {
          if (response) {
            setCasinoGameUrl(response.url);
            setLoader(false);
            navigate("/casino-game-play");
          }
        } else {
          setLoader(false);
          toast.error(response.errorDescripion);
        }
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    casinoGamesList(vendor);
  }, [vendor, search_params, pageSize]);
  useEffect(() => {
    casinoVenders();
  }, []);
  return (
    <div>
      <div className="ProviderGameInnerCasino">
        <Slider {...settings} className="GameSlider">
          <div></div>
          {vendors?.length > 0
            ? vendors.map((item, index) => {
                if (item != "") {
                  return (
                    <div key={index} className="gameCTG">
                      <a
                        className={item.name == vendor ? "entrance active" : "entrance"}
                        href="javascript:void(0)"
                        onClick={() => {
                          if (item.name == "Evolution Gaming") {
                            setVendor("DC");
                          } else {
                            setVendor(item.name);
                          }
                        }}
                      >
                        {/* <span><img src={item?.name == vendor ? `/assets/images/casino/${item?.name?.toUpperCase()}_gold.png` : `/assets/images/casino/${item?.name?.toUpperCase()}_gray.png`} alt=""/></span> */}
                        <dt style={{ fontSize: "14px", marginBottom: "0", fontWeight: "700" }}>{item?.labelName}</dt>
                      </a>
                    </div>
                  );
                }
              })
            : ""}
        </Slider>
      </div>
      <div className="casinoSearchRow">
        <a className="a-search innerSearch " onClick={() => setSearchToogleCasino(true)} href="javascript:void(0)">
          Search
        </a>
        <h2>Search your favourite games</h2>
      </div>

      <div id="page">
        <div className="mian-wrap">
          <div className="gamehall innerPageList2 homepageList">
            {games.length > 0
              ? games.map((item, index) => {
                  return (
                    <div className="CardsThumbnail">
                      <a
                        key={index}
                        className="entrance-half"
                        href="javascript:void(0)"
                        onClick={() => {
                          if (!isEmpty(user)) {
                            casinoGameURL(item?.game_id, item?.provider_name);
                          } else {
                            navigate("/login");
                          }
                        }}
                        neua="Blackjack Banner"
                      >
                        {/* <dl className="entrance-title">
                        <dt>{item.game_name}</dt>
                        <dd>Play Now</dd>
                      </dl> */}
                        <img style={{ height: "100%" }} src={item?.url_thumb} alt="" />
                      </a>
                      <h5 style={{ textAlign: "center" }}>{item?.game_name}</h5>
                    </div>
                  );
                })
              : ""}
          </div>
          {showLoadMore && (
            <div style={{ display: "flex" }}>
              <Button type="submit" className="loadmore-btn" onClick={() => setPageSize(pageSize + 20)}>
                {loader ? "Loading..." : "Load more..."}
              </Button>
            </div>
          )}
          {/* <div className="bottom-pagination">
            <ReactPaginate
              breakLabel="..."
              nextLabel=" >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              previousLabel="< "
              renderOnZeroPageCount={null}
              activeClassName="p-0"
              activeLinkClassName="pagintion-li"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default CasinoGames;
