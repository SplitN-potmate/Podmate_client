import React from 'react';
import styled from '@emotion/styled';
import { useNavigate, useLocation } from 'react-router-dom';

const NavContainer = styled.nav`
    position: fixed;
    bottom: 60px;
    left: 0;
    right: 0;
    height: 60px;
    width: 390px;
    background-color: white;
    display: flex;
    justify-content: center;
    position: relative;
    align-items: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
`;

const NavItem = styled.button<{ isActive: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 33.33%;
    height: 100%;
    border: none;
    background: none;
    cursor: pointer;
    color: ${(props) => (props.isActive ? '#3498db' : '#666')};
    transition: color 0.2s ease;

    &:hover {
        color: #3498db;
    }
`;

const IconWrapper = styled.div`
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Label = styled.span<{ isActive: boolean }>`
    font-size: 12px;
    font-weight: ${(props) => (props.isActive ? '600' : '400')};
`;

const NavigationBar = (): React.ReactElement => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/main', label: '홈', icon: '🏠' },
        { path: '/register', label: '등록', icon: '➕' },
        { path: '/mypage', label: '마이페이지', icon: '🙎‍♂️' },
    ];

    return (
        <NavContainer>
            {navItems.map((item) => (
                <NavItem key={item.path} isActive={location.pathname === item.path} onClick={() => navigate(item.path)}>
                    <IconWrapper>{item.icon}</IconWrapper>
                    <Label isActive={location.pathname === item.path}>{item.label}</Label>
                </NavItem>
            ))}
        </NavContainer>
    );
};

export default NavigationBar;
