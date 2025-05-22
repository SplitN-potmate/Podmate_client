import { useNavigate } from 'react-router-dom';
import './header.css';

interface HeaderProps {
    pageName: string;
}

export default function Header({ pageName }: HeaderProps) {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // 이전 페이지로 이동
    };
    return (
        <>
            <div className="header_container">
                <div className="header">
                    <img src="/header/icn.png" className="header_icn_img" onClick={goBack} />
                    <p className="header_text">{pageName}</p>
                    <img src="/header/bell.png" className="header_bell_img" />
                </div>
            </div>
        </>
    );
}
