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
  const [searchKey, setSearchKey] = useState(location?.state?.searchKey ? "Evolution Top Games" : "");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(21);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    pageSize: 21,
  });

  var settings = {
    dots: false,
    infinite: false,
    centerMode: false,
    navigator: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: true,
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
  let { user, setCasinoGameUrl, setLoader, user_coins, loader } = useContext(AuthProvider);

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
                  };
                } else {
                  return {
                    name: item.providerName,
                    image: "/assets/images/home/vendor.png",
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
      const { status, data: response } = await apiGet(apiPath.casinoGamesList, { provider: vendor, searchKey, pageSize });
      if (status === 200) {
        if (!response.error) {
          if (response.data) {
            setLoader(false);
            // if (searchKey) {
            //     setGames(response.data);
            // } else {
            setGames(response.data);
            setPageCount(response.totalPages);
            // }
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
  }, [vendor, searchKey, search_params, pageSize]);

  const getTopCasinoGames = async () => {
    let path = apiPath.getTopCasinoGames;
    try {
      const response = await apiGet(path);
      if (response && response?.data?.success) {
        setVendors(response?.data?.results);
      } else {
        toast.error(response?.message || "Something went wrong", {
          className: "bg-danger theme-color",
        });
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong", {
        className: "bg-danger theme-color",
      });
    }
  };

  useEffect(() => {
    // casinoVenders();
    getTopCasinoGames();
  }, []);
  return (
    <div className="TopGameWrap">
      <h2 className="sectionHead">Top Games</h2>

      <Slider {...settings} className="GameSlider topGameSlider2">
        {vendors?.length > 0
          ? vendors.map((item, index) => {
              if (item != "") {
                return (
                  <div className="gameCTG topGameImage">
                    <a
                      key={index}
                      className={item.game_name == vendor ? "entrance active" : "entrance"}
                      href="javascript:void(0)"
                      onClick={() => {
                        if (!isEmpty(user)) {
                          casinoGameURL(item?.game_id, item?.provider_name);
                        } else {
                          navigate("/login");
                        }
                      }}
                    >
                      {/* <span><img src={item?.url_thumb} alt=""/></span> */}
                      <dt className="TopGameTabs text-bold">{item?.game_name}</dt>
                    </a>
                  </div>
                );
              }
            })
          : ""}
      </Slider>
    </div>
  );
}

export default CasinoGames;
