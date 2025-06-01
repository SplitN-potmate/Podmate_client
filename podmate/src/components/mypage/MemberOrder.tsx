import { useLocation } from 'react-router-dom';
import Header from '../Header';
import StoredItem from './cart/StoredItem';
import { useEffect, useState } from 'react';
import { getMemberOrder } from '../../api/userApi';
import MemberCart from './cart/MemberCart';

export default function MemberOrder() {
    const location = useLocation();
    const podId = location.state?.podId;
    const memberId = location.state?.userId;
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!podId || !memberId) return;
        getMemberOrder(podId, memberId).then((result) => {
            if (result) {
                setItems(result.items);
            }
        });
    }, []);
    return (
        <>
            <Header pageName="팟원 주문서" />
            <MemberCart items={items} />
        </>
    );
}
