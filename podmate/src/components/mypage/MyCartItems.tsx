import { useLocation } from 'react-router-dom';
import Header from '../Header';
import './myCartItems.css';
import { useEffect, useState } from 'react';
import { getCartItems } from '../../api/userApi';

type ProductInputProps = {
    name: string;
    option: string;
    quantity: string;
    url: string;
};

export default function MyCartItems() {
    const location = useLocation();
    const platformId = location.state?.platfromInfoId;
    const [productInputs, setProductInputs] = useState<ProductInputProps[]>([
        { name: '', option: '', quantity: '', url: '' },
    ]);

    const getCartItemsData = async () => {
        try {
            const res = await getCartItems(platformId);
            console.log('res', res);

            // 빈 배열이면 기본 1세트 보여주기
            if (!res || res.length === 0) {
                setProductInputs([{ name: '', option: '', quantity: '', url: '' }]);
            } else {
                setProductInputs(res);
            }
        } catch (err) {
            console.error('API 호출 실패:', err);
            setProductInputs([{ name: '', option: '', quantity: '', url: '' }]); // 오류 시에도 최소 1세트
        }
    };

    useEffect(() => {
        if (!platformId) return;
        console.log(platformId);
        getCartItemsData();
    }, [platformId]);

    const handleAddProduct = () => {
        setProductInputs([...productInputs, { name: '', option: '', quantity: '', url: '' }]);
    };

    const handleInputChange = (index: number, field: keyof ProductInputProps, value: string) => {
        const updated = [...productInputs];
        updated[index][field] = value;
        setProductInputs(updated);
    };

    return (
        <div className="myCartItems-container">
            <Header pageName="장바구니 작성" />
            <div className="myCartItems-div">
                {productInputs?.map((product, index) => (
                    <div key={index} className="myorder-write-div">
                        <input
                            placeholder="상품명"
                            value={product.name}
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                        />
                        <input
                            placeholder="옵션"
                            value={product.option}
                            onChange={(e) => handleInputChange(index, 'option', e.target.value)}
                        />
                        <input
                            placeholder="수량"
                            value={product.quantity}
                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                        />
                        <input
                            placeholder="상품 URL"
                            value={product.url}
                            onChange={(e) => handleInputChange(index, 'url', e.target.value)}
                        />
                    </div>
                ))}
                <button className="myCartItems-plus-button" onClick={handleAddProduct}>
                    +
                </button>
            </div>

            <div className="myCartItems-submit-button-div">
                <button className="myCartItems-submit-button">취소</button>
                <button className="myCartItems-submit-button">저장</button>
            </div>
        </div>
    );
}
