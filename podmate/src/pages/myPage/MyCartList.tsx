import { useEffect, useState } from "react";
import Header from "../../components/Header";
import "./myCartList.css";
import { getCarts } from "../../api/userApi";
import { useLocation, useNavigate } from "react-router-dom";

type orderFrom = {
  cartName: string;
  platformInfoId: number;
  platformName: string;
};

export default function MyCartList() {
  const navigate = useNavigate();
  const pathname = useLocation();
  const [cartList, setCartList] = useState<orderFrom[]>([]);
  const [isJJim, setIsJJim] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState("/mypage/jjim.png"); // 기본 하트
  const getCartsData = async () => {
    try {
      const res = await getCarts();
      console.log("res", res);
      console.log("res", res.result.platformDtos);
      setCartList(res.result.platformDtos);
    } catch {}
  };

  useEffect(() => {
    getCartsData();
  }, []);

  const handleClickCart = (platformInfoId: number) => {
    if (pathname.pathname === "/pod/join/mini") {
      navigate("/pod/join/mini/cartItems", {
        state: {
          platformInfoId,
          podId: pathname.state?.podId,
        },
      });
    } else {
      navigate("/my/cartItems", {
        state: {
          platformInfoId,
        },
      });
    }
    console.log("ss", platformInfoId);
  };

  return (
    <>
      {pathname.pathname === "/pod/join/mini" ? (
        <Header pageName="팟 참여하기" />
      ) : (
        <Header pageName="나의 장바구니" />
      )}
      <div className="myorder-div">
        <button
          className="myorder-write-button"
          onClick={() => {
            navigate("/my/cart");
          }}
        >
          새 장바구니 생성
        </button>

        {cartList
          ? cartList.map((item) => {
              return (
                <div className="myorder-order-container">
                  <div className="myorder-order-top">
                    <div className="myorder-order-title">
                      <p className="myorder-order-no">{item.cartName}</p>
                      <p className="myorder-order-platform ">
                        {item.platformName}
                      </p>
                    </div>
                    <img
                      src={imgSrc}
                      onMouseEnter={() => setImgSrc("/mypage/jjim-active.png")} // 마우스 올리면 경로 변경
                      onMouseLeave={() => setImgSrc("/mypage/jjim.png")} // 마우스 떼면 원래대로
                      className="myorder-order-jjim-img"
                    />
                  </div>
                  <div className="myorder-order-top">
                    <div className="myorder-order-title">
                      {/* <p className="myorder-order-totalAmount"> {item.totalAmount}</p>{' '}
                                          <p className="myorder-order-platform ">원</p> */}
                    </div>
                    <button
                      className="myorder-order-button"
                      onClick={() => handleClickCart(item.platformInfoId)}
                    >
                      장바구니 보기
                    </button>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </>
  );
}
