import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header';
import './myCartItems.css';
import { useEffect, useState } from 'react';
import { getCartItems, postCartItems } from '../../api/userApi';
import { CartItem, StoreItem } from '../../types/types';
import StoredItem from './cart/StoredItem';

export default function MyCartItems() {
    const location = useLocation();
    const navigate = useNavigate();
    const platformId = location.state?.platformInfoId;
    // console.log('platformId', platformId);
    // const [productInputs, setProductInputs] = useState<CartItem[]>([{ optionText: '', quantity: 0, itemUrl: '' }]);
    const [productInputs, setProductInputs] = useState<StoreItem[]>([]);
    const [inputFields, setInputFields] = useState<CartItem[]>([{ optionText: '', quantity: 0, itemUrl: '' }]);

    const getCartItemsData = async () => {
        try {
            const res = await getCartItems(platformId);
            console.log('res', res.cartItemDtos);
            setProductInputs(res.cartItemDtos);
            // // 빈 배열이면 기본 1세트 보여주기
            // if (!res.cartItemDtos || res.cartItemDtos.length === 0) {
            //     setProductInputs([{ optionText: '', quantity: 0, itemUrl: '' }]);
            // } else {
            //     //
            // }
        } catch (err) {
            console.error('API 호출 실패:', err);
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
        setInputFields([...inputFields, { optionText: '', quantity: 0, itemUrl: '' }]);
    };
    const handleInputFieldChange = (index: number, field: keyof CartItem, value: string | number) => {
        const updated = [...inputFields];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setInputFields(updated);
    };

    const handleStoredItemChange = (index: number, field: keyof CartItem, value: string | number) => {
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

    return (
        <div className="myCartItems-container">
            <Header pageName="장바구니 작성" />
            <div className="myCartItems-div">
                {/* 저장된 장바구니 항목 보여주기 */}
                {productInputs.length > 0 && productInputs[0].optionText !== '' && (
                    <StoredItem items={productInputs} refreshItems={getCartItemsData} />
                )}

                {/* 사용자 입력을 위한 input 필드 */}
                {inputFields.map((product, index) => (
                    <div key={index} className="myorder-write-div">
                        <input
                            placeholder="옵션"
                            value={product.optionText}
                            onChange={(e) => handleInputFieldChange(index, 'optionText', e.target.value)}
                        />
                        <input
                            // type="number"
                            placeholder="수량"
                            value={product.quantity}
                            onChange={(e) => handleInputFieldChange(index, 'quantity', Number(e.target.value))}
                        />
                        <input
                            placeholder="상품 URL"
                            value={product.itemUrl}
                            onChange={(e) => handleInputFieldChange(index, 'itemUrl', e.target.value)}
                        />
                    </div>
                ))}
                <button className="myCartItems-plus-button" onClick={handleAddProduct}>
                    +
                </button>
            </div>

            <div className="myCartItems-submit-button-div">
                <button className="myCartItems-submit-button" onClick={() => navigate('/my/myCart')}>
                    취소
                </button>
                <button className="myCartItems-submit-button" onClick={handleSubmitCartItems}>
                    저장
                </button>
            </div>
        </div>
    );
}
