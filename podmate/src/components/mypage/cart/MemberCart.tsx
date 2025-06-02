import { useState } from 'react';

import { StoreItem } from '../../../types/types';

import './storedItem.css';

interface StroedItemProps {
    items: StoreItem[];
}

export default function MemberCart({ items }: StroedItemProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    return (
        <>
            <div className="storedItem-div">
                {items.map((item, index) => (
                    <div key={index} className="storedItem-container">
                        <div className="storeItem-top">
                            <p className="storedItem-itemName">{item.itemName}</p>
                            <img src="/mypage/Trash.png" className="storeItem-trashImg" />
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
        </>
    );
}
