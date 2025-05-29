import { useState } from 'react';
import Header from '../Header';
import './myCartItems.css';
import { shoppingmallList } from '../register/PodRegister';
import { postCarts } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal';

export default function MyCart() {
    const navigate = useNavigate();
    const [platform, setPlatform] = useState<string>('');
    const [cartName, setCartName] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const postNewCart = async () => {
        const res = await postCarts(platform, cartName);
        console.log(res);
        if (res.isSuccess) {
            setIsModalOpen(true);
        }
    };

    const handleSelectPlatForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlatform(e.target.value);
    };

    const handleSubmitCart = () => {
        if (platform) {
            postNewCart();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        navigate('/my/myCart');
    };

    return (
        <>
            <Header pageName="장바구니 생성" />
            <div className="myorder-write-div">
                <h3>장바구니명 입력</h3>
                <input value={cartName} onChange={(e) => setCartName(e.target.value)} />
                <h3>플랫폼 선택</h3>
                <select className="podRegister_select" onChange={handleSelectPlatForm}>
                    {shoppingmallList.map((mall, index) => (
                        <option key={index} value={mall}>
                            {mall}
                        </option>
                    ))}
                </select>
                <button className="myorder-write-plus-button " onClick={handleSubmitCart}>
                    새 장바구니 생성
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} message="장바구니가 생성되었습니다!"></Modal>
        </>
    );
}
