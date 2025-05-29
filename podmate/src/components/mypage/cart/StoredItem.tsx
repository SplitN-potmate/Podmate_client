import { useState } from 'react';
import { getCartItems, postDeleteItem } from '../../../api/userApi';
import { CartItem, StoreItem } from '../../../types/types';
import Modal from '../../Modal';
import './storedItem.css';

interface StroedItemProps {
    items: StoreItem[];
    refreshItems: () => void;
}

export default function StoredItem({ items, refreshItems }: StroedItemProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    const handleDeleteItem = async (itemId: number) => {
        try {
            await postDeleteItem(itemId);
            setModalMessage('상품이 장바구니에서 삭제되었습니다.');
            setIsOpen(true);
            refreshItems();
        } catch (err) {
            setModalMessage('삭제 중 오류가 발생했습니다.');
            setIsOpen(true);
        }
    };

    const onCloseModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            <div className="storedItem-div">
                {items.map((item, index) => (
                    <div key={index} className="storedItem-container">
                        <div className="storeItem-top">
                            <p className="storedItem-itemName">{item.itemName}</p>
                            <img
                                src="/mypage/Trash.png"
                                className="storeItem-trashImg"
                                onClick={() => handleDeleteItem(item.itemId)}
                            />
                        </div>
                        <p className="storedItem-itemOption">옵션: {item.optionText}</p>
                        <p className="storedItem-itemOption">수량: {item.quantity}</p>
                        <div>
                            <a href={item.itemUrl} className="storedItem-itemUrl">
                                상품 보러가기
                                <img src="/mypage/arrow.png" className="storedItem-arrowImg" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} message={modalMessage} />
        </>
    );
}
