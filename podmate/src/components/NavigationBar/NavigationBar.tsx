import React, { useState } from "react";
import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";

const NavigationBar = (): React.ReactElement => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      icon: ({ isActive, isHover }: { isActive: boolean; isHover: boolean }) =>
        isActive || isHover ? (
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3 12V20H17.3C17.8305 20 18.3392 19.7893 18.7143 19.4142C19.0893 19.0391 19.3 18.5304 19.3 18V8.99997C19.3001 8.70904 19.2367 8.42159 19.1143 8.15768C18.9918 7.89378 18.8133 7.65976 18.591 7.47197L11.591 1.47297C11.2301 1.16788 10.7727 1.00049 10.3 1.00049C9.82741 1.00049 9.37003 1.16788 9.00905 1.47297L2.00905 7.47197C1.78685 7.65976 1.60829 7.89378 1.48584 8.15768C1.36338 8.42159 1.29998 8.70904 1.30005 8.99997V18C1.30005 18.5304 1.51076 19.0391 1.88584 19.4142C2.26091 19.7893 2.76962 20 3.30005 20H7.30005V12C7.30005 11.7348 7.40541 11.4804 7.59294 11.2929C7.78048 11.1053 8.03483 11 8.30005 11H12.3C12.5653 11 12.8196 11.1053 13.0072 11.2929C13.1947 11.4804 13.3 11.7348 13.3 12Z"
              fill="#27C3D8"
              stroke="#27C3D8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.3 21V13C15.3 12.7348 15.1947 12.4804 15.0072 12.2929C14.8196 12.1053 14.5653 12 14.3 12H10.3C10.0348 12 9.78048 12.1053 9.59294 12.2929C9.40541 12.4804 9.30005 12.7348 9.30005 13V21M3.30005 9.99997C3.29998 9.70904 3.36338 9.42159 3.48584 9.15768C3.60829 8.89378 3.78685 8.65976 4.00905 8.47197L11.009 2.47297C11.37 2.16788 11.8274 2.00049 12.3 2.00049C12.7727 2.00049 13.2301 2.16788 13.591 2.47297L20.591 8.47197C20.8133 8.65976 20.9918 8.89378 21.1143 9.15768C21.2367 9.42159 21.3001 9.70904 21.3 9.99997V19C21.3 19.5304 21.0893 20.0391 20.7143 20.4142C20.3392 20.7893 19.8305 21 19.3 21H5.30005C4.76962 21 4.26091 20.7893 3.88584 20.4142C3.51076 20.0391 3.30005 19.5304 3.30005 19V9.99997Z"
              stroke="#2F3337"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ),
    },
    {
      path: "/register",
      icon: <img src="/navigator/registerIcon.png" className="register_icon" />,
    },
    {
      path: "/mypage",
      icon: ({ isActive, isHover }: { isActive: boolean; isHover: boolean }) =>
        isActive || isHover ? (
          <svg
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.69995 11C11.4614 11 13.7 8.76142 13.7 6C13.7 3.23858 11.4614 1 8.69995 1C5.93853 1 3.69995 3.23858 3.69995 6C3.69995 8.76142 5.93853 11 8.69995 11Z"
              fill="#27C3D8"
            />
            <path
              d="M16.7 19C16.7 16.8783 15.8571 14.8434 14.3568 13.3431C12.8565 11.8429 10.8217 11 8.69995 11C6.57822 11 4.54339 11.8429 3.0431 13.3431C1.54281 14.8434 0.699951 16.8783 0.699951 19"
              fill="#27C3D8"
            />
            <path
              d="M8.69995 11C11.4614 11 13.7 8.76142 13.7 6C13.7 3.23858 11.4614 1 8.69995 1C5.93853 1 3.69995 3.23858 3.69995 6C3.69995 8.76142 5.93853 11 8.69995 11ZM8.69995 11C10.8217 11 12.8565 11.8429 14.3568 13.3431C15.8571 14.8434 16.7 16.8783 16.7 19H0.699951C0.699951 16.8783 1.54281 14.8434 3.0431 13.3431C4.54339 11.8429 6.57822 11 8.69995 11Z"
              stroke="#27C3D8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6997 13C15.4611 13 17.6997 10.7614 17.6997 8C17.6997 5.23858 15.4611 3 12.6997 3C9.93828 3 7.69971 5.23858 7.69971 8C7.69971 10.7614 9.93828 13 12.6997 13ZM12.6997 13C14.8214 13 16.8563 13.8429 18.3566 15.3431C19.8569 16.8434 20.6997 18.8783 20.6997 21M12.6997 13C10.578 13 8.54314 13.8429 7.04285 15.3431C5.54256 16.8434 4.69971 18.8783 4.69971 21"
              stroke="currentColor"
              strokeWidth="2.23881"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
    },
  ];

  return (
    <>
      <TopBar>
        <AlarmItem onClick={() => setDrawerOpen(true)}>
          <BellIcon />
        </AlarmItem>
      </TopBar>
      <DrawerBackdrop open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <NotificationDrawer open={drawerOpen}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>알림</h3>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              fontSize: 20,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ marginTop: 24 }}>알림 목록을 예정</div>
      </NotificationDrawer>
      <NavContainer>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <IconWrapper>
              {typeof item.icon === "function"
                ? item.icon({
                    isActive: location.pathname === item.path,
                    isHover: false,
                  })
                : item.icon}
            </IconWrapper>
          </NavItem>
        ))}
      </NavContainer>
    </>
  );
};

export default NavigationBar;

const TopBar = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 50px;
  left: 0px;
  top: 0px;
  background: #ffffff;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 4px;
`;

const NavContainer = styled.nav`
  position: absolute;
  bottom: 0;
  left: 48%;
  transform: translateX(-48%);
  height: 60px;
  width: 390px; // 고정 모바일 프레임 크기
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  border-top: 1px solid #e5e5e5;
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
  color: ${(props) => (props.isActive ? "#27C3D8" : "#2F3337")};
  transition: all 0.2s ease;

  &:hover {
    color: #27c3d8;

    svg path {
      stroke: #27c3d8;
    }
  }

  //   svg path {
  //     stroke: ${(props) => (props.isActive ? "#27C3D8" : "#2F3337")};
  //     transition: all 0.2s ease;
  //   }
`;

const AlarmItem = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  width: fit-content;
  height: fit-content;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BellIcon = () => (
  <img
    src="/header/bell.png"
    alt="알림"
    style={{ width: 22, height: 24, display: "block" }}
  />
);

const NotificationDrawer = styled.div<{ open: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 250px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 200;
  transform: translateX(${(props) => (props.open ? "0" : "100%")});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
`;

const DrawerBackdrop = styled.div<{ open: boolean }>`
  display: ${(props) => (props.open ? "block" : "none")};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 150;
`;
