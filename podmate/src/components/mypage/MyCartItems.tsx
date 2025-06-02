import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import "./myCartItems.css";
import { useEffect, useState } from "react";
import { getCartItems, postCartItems, postOrderForm } from "../../api/userApi";
import { CartItem, StoreItem } from "../../types/types";
import StoredItem from "./cart/StoredItem";
import styled from "styled-components";
import Modal from "../Modal";

const SubmitButtonContainer = styled.div<{ disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 335px;
  height: 48px;
  margin: 60px auto 20px;
  background: ${(props) => (props.disabled ? "#E5E5E5" : "#52d4e0")};
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  font-family: "Wanted Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 120%;
  color: #ffffff;
  text-align: center;
  letter-spacing: -0.02em;
`;

const Container = styled.div`
  padding-bottom: 88px; // 신청하기 버튼의 높이 + 여백
`;

export default function MyCartItems() {
  const location = useLocation();
  const navigate = useNavigate();
  const platformId = location.state?.platformInfoId;
  const podId = location.state?.podId;
  console.log(podId);
  // console.log('platformId', platformId);
  // const [productInputs, setProductInputs] = useState<CartItem[]>([{ optionText: '', quantity: 0, itemUrl: '' }]);
  const [productInputs, setProductInputs] = useState<StoreItem[]>([]);
  const [inputFields, setInputFields] = useState<CartItem[]>([
    { optionText: "", quantity: 0, itemUrl: "" },
  ]);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const getCartItemsData = async () => {
    try {
      const res = await getCartItems(platformId);
      console.log("res", res.cartItemDtos);
      setProductInputs(res.cartItemDtos);
      // // 빈 배열이면 기본 1세트 보여주기
      // if (!res.cartItemDtos || res.cartItemDtos.length === 0) {
      //     setProductInputs([{ optionText: '', quantity: 0, itemUrl: '' }]);
      // } else {
      //     //
      // }
    } catch (err) {
      console.error("API 호출 실패:", err);
      // setProductInputs([{ optionText: '', quantity: 0, itemUrl: '' }]); // 오류 시에도 최소 1세트
    }
  };

  const postCartItemsData = async () => {
    const res = await postCartItems({
      platformInfoId: platformId,
      itemList: inputFields, // 새로 입력한 값만 전송
    });
    console.log(res);
  };

  useEffect(() => {
    if (!platformId) return;
    getCartItemsData();
  }, [platformId]);

  const handleAddProduct = () => {
    setInputFields([
      ...inputFields,
      { optionText: "", quantity: 0, itemUrl: "" },
    ]);
  };
  const handleInputFieldChange = (
    index: number,
    field: keyof CartItem,
    value: string | number
  ) => {
    const updated = [...inputFields];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setInputFields(updated);
  };

  const handleStoredItemChange = (
    index: number,
    field: keyof CartItem,
    value: string | number
  ) => {
    const updated = [...productInputs];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setProductInputs(updated);
  };

  const handleSubmitCartItems = () => {
    postCartItemsData();
  };

  const handleItemCheck = (itemId: number, isChecked: boolean) => {
    if (isChecked) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== itemId));
    }
  };

  const handleSubmitSelectedItems = async () => {
    try {
      const selectedItemIds = productInputs
        .filter((item) => checkedItems.includes(item.itemId))
        .map((item) => item.itemId);

      if (podId) {
        const res = await postOrderForm(podId, selectedItemIds);
        if (res) {
          setModalMessage("신청이 완료되었습니다.");
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      console.error("아이템 신청 중 오류 발생:", error);
      setModalMessage("신청 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return location.pathname === "/my/cartItems" ? (
    <>
      <Container>
        <div className="myCartItems-container">
          <Header pageName="장바구니 작성" />
          <div className="myCartItems-div">
            {/* 저장된 장바구니 항목 보여주기 */}
            {productInputs.length > 0 && productInputs[0].optionText !== "" && (
              <StoredItem
                items={productInputs}
                refreshItems={getCartItemsData}
                onItemCheck={handleItemCheck}
                checkedItems={checkedItems}
              />
            )}

            {/* 사용자 입력을 위한 input 필드 */}
            {inputFields.map((product, index) => (
              <div key={index} className="myorder-write-div">
                <input
                  placeholder="옵션"
                  value={product.optionText}
                  onChange={(e) =>
                    handleInputFieldChange(index, "optionText", e.target.value)
                  }
                />
                <input
                  // type="number"
                  placeholder="수량"
                  value={product.quantity}
                  onChange={(e) =>
                    handleInputFieldChange(
                      index,
                      "quantity",
                      Number(e.target.value)
                    )
                  }
                />
                <input
                  placeholder="상품 URL"
                  value={product.itemUrl}
                  onChange={(e) =>
                    handleInputFieldChange(index, "itemUrl", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              className="myCartItems-plus-button"
              onClick={handleAddProduct}
            >
              +
            </button>
          </div>

          <div className="myCartItems-submit-button-div">
            <button
              className="myCartItems-submit-button"
              onClick={() => navigate("/my/myCart")}
            >
              취소
            </button>
            <button
              className="myCartItems-submit-button"
              onClick={handleSubmitCartItems}
            >
              저장
            </button>
          </div>
        </div>
        <SubmitButtonContainer
          onClick={
            checkedItems.length > 0 ? handleSubmitSelectedItems : undefined
          }
          disabled={checkedItems.length === 0}
        >
          신청하기
        </SubmitButtonContainer>
      </Container>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message={modalMessage}
      />
    </>
  ) : (
    <>
      <Container>
        <div className="myCartItems-container">
          <Header pageName="장바구니 작성" />
          <div className="myCartItems-div">
            {/* 저장된 장바구니 항목 보여주기 */}
            {productInputs.length > 0 && productInputs[0].optionText !== "" && (
              <StoredItem
                items={productInputs}
                refreshItems={getCartItemsData}
                onItemCheck={handleItemCheck}
                checkedItems={checkedItems}
              />
            )}

            {/* 사용자 입력을 위한 input 필드 */}
            {inputFields.map((product, index) => (
              <div key={index} className="myorder-write-div">
                <input
                  placeholder="옵션"
                  value={product.optionText}
                  onChange={(e) =>
                    handleInputFieldChange(index, "optionText", e.target.value)
                  }
                />
                <input
                  // type="number"
                  placeholder="수량"
                  value={product.quantity}
                  onChange={(e) =>
                    handleInputFieldChange(
                      index,
                      "quantity",
                      Number(e.target.value)
                    )
                  }
                />
                <input
                  placeholder="상품 URL"
                  value={product.itemUrl}
                  onChange={(e) =>
                    handleInputFieldChange(index, "itemUrl", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              className="myCartItems-plus-button"
              onClick={handleAddProduct}
            >
              +
            </button>
          </div>

          <div className="myCartItems-submit-button-div">
            <button
              className="myCartItems-submit-button"
              onClick={() => navigate("/pod/join/mini")}
            >
              취소
            </button>
            <button
              className="myCartItems-submit-button"
              onClick={handleSubmitCartItems}
            >
              저장
            </button>
          </div>
        </div>
        <SubmitButtonContainer
          onClick={
            checkedItems.length > 0 ? handleSubmitSelectedItems : undefined
          }
          disabled={checkedItems.length === 0}
        >
          신청하기
        </SubmitButtonContainer>
      </Container>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message={modalMessage}
      />
    </>
  );
}
