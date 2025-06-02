import axios from "axios";
import {
  postCartItemsProps,
  postPodAddressProps,
  postPodGroupBuyProps,
  postPodMinOrderProps,
  ReviewTarget,
} from "../types/types";

const userAxios = axios.create({
  baseURL: "http://3.37.242.204:8081",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// export const testUser = async () => {
//   const res = await userAxios.get("/api/auth/test-token?userId=2");
//   const accessToken = res.data.accessToken;
//   const refreshToken = res.data.refreshToken;
//   localStorage.setItem("accessToken", accessToken);
//   localStorage.setItem("refreshToken", refreshToken);
//   return res.data;
// };

export const getUser = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};
export const getUserProfile = async (userId: number) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/users/${userId}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("res", res.data.result);
    return res.data.result;
  } catch {}
};

//팟 목록 조회
export const getPodList = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`api/pods`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("res", res.data.result);
    return res.data.result;
  } catch {}
};

//팟 생성 주소 저장 api
export const postPodAddress = async ({
  roadAddress,
  latitude,
  longitude,
}: postPodAddressProps) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await userAxios.post(
    `/api/pods/addresses`,
    {
      roadAddress,
      latitude,
      longitude,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

//최소주문 팟 생성
export const postPodMinOrder = async ({
  podName,
  platform,
  addressId,
  endDate,
  totalAmount,
  description,
}: postPodMinOrderProps) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.post(
      `/api/pods/minimum-order`,
      {
        podName: podName,
        platform: platform,
        addressId: addressId,
        deadline: endDate,
        goalAmount: totalAmount,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("res", res.data);

    return res.data;
  } catch {}
};

export const getPods = async (params: {
  lat1: number;
  lat2: number;
  lng1: number;
  lng2: number;
}) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/pods/map`, {
      params: {
        lat1: params.lat1,
        lng1: params.lng1,
        lat2: params.lat2,
        lng2: params.lng2,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};

//물품 공동구매 팟 생성
export const postPodGroupBuy = async ({
  podName,
  addressId,
  endDate,
  itemUrl,
  totalAmount,
  totalQuantity,
  description,
  unitPrice,
  unitQuantitiy,
}: postPodGroupBuyProps) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.post(
      `/api/pods/group-buy`,
      {
        podName: podName,
        addressId: addressId,
        deadline: endDate,
        totalAmount: totalAmount,
        totalQuantity: totalQuantity,
        itemUrl: itemUrl,
        description: description,
        unitQuantitiy: unitQuantitiy,
        unitPrice: unitPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//나의 팟 내역_진행 중인 팟 목록
export const getInProgressMyPods = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`api/mypage/inprogress/mypods`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};

//나의 팟 내역_완료된 팟 목록
export const getCompletedMyPods = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`api/mypage/completed/mypods`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};

//참여 팟 내역_진행 중인 팟 목록
export const getInProgressJoinedPods = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`api/mypage/inprogress/joinedpods`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};

//참여 팟 내역_완료된 팟 목록
export const getCompletedJoinedPods = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/mypage/completed/joinedpods`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};

//마이페이지_ 내가 남긴 후기 리스트 조회
export const getMyReviews = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/mypage/reviews/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};

//마이페이지_ 내가 받은 후기 리스트 조회
export const getReceivedReviews = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/mypage/reviews/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};

//??
export const getOrderForms = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/orderforms`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};

//장바구니 생성
export const postCarts = async (platform: string, cartName: string) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.post(
      `/api/carts`,
      {
        platformName: platform,
        cartName: cartName,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch {}
};

//마이페이지_장바구니 목록 조회
export const getCarts = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/mypage/carts/platforms`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch {}
};

type getCartItemsProps = {
  platformInfoId: number;
};
//마이페이지_개별 장바구니 내 상품 목록 조회
export const getCartItems = async (platformInfoId: getCartItemsProps) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(
      `/api/mypage/carts/platforms/${platformInfoId}/cartItems`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data.result;
  } catch {}
};

//개별 장바구니 내 상품 추가
export const postCartItems = async ({
  platformInfoId,
  itemList,
}: postCartItemsProps) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.post(
      `/api/carts/cartItem`,
      {
        platformInfoId: platformInfoId,
        itemList: itemList,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data.result;
  } catch {}
};

//개별 장바구니 내 상품 삭제
export const postDeleteItem = async (itemId: number) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.delete(`/api/carts/cartItems/${itemId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};

//후기 남기기_후기 대상 선택 api
export const getReviewTarget = async (podId: number) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/reviews/${podId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch {}
};

//후기 남기기_후기 등록 api
export const postReviewTarget = async ({
  podId,
  recipientId,
  options,
}: ReviewTarget) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.post(
      `/api/reviews/${recipientId}`,
      {
        podId: podId,
        options: options,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data.result;
  } catch {}
};

export const postJjim = async (podId: number) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.post(
      `/api/jjims`,
      {
        podId: podId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch {}
};

export const patchJjim = async (podId: number) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.patch(
      `/api/jjims`,
      {
        podId: podId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch {}
};

export const getPodDetail = async (podId: number) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/pods/${podId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch (error) {
    console.error("Failed to fetch pod detail:", error);
    return null;
  }
};

export const getNotifications = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/notifications/subscribe`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.result;
  } catch (error) {
    console.error("실패:", error);
    return null;
  }
};

type PostAccountInfoProps = {
  depositAccountBank: string;
  depositAccountNumber: string;
  depositAccountHolder: string;
  podId: number;
};

//팟장의 입금 계좌 입력 api
export const postAccountInfo = async ({
  depositAccountBank,
  depositAccountNumber,
  depositAccountHolder,
  podId,
}: PostAccountInfoProps) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.patch(
      `/api/mypage/inprogress/mypods/${podId}/deposit-account`,
      {
        depositAccountBank: depositAccountBank,
        depositAccountNumber: depositAccountNumber,
        depositAccountHolder: depositAccountHolder,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.error("Failed to fetch pod detail:", error);
    throw error;
  }
};

type PostTrackingNumProps = {
  trackingNum: string;
  courierCompany: string;
  podId: number;
};

//팟장의 운송장 입력 api
export const postTrackingNum = async ({
  trackingNum,
  courierCompany,
  podId,
}: PostTrackingNumProps) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.post(
      `/api/mypage/inprogress/mypods/${podId}`,
      {
        trackingNum: trackingNum,
        courierCompany: courierCompany,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.error("Failed to fetch pod detail:", error);
    throw error;
  }
};

//팟 상태 변경
export const patchPodStatus = async (status: string, podId: number) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.patch(
      `/api/pods/${podId}/status`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.error("Failed to fetch pod detail:", error);
    throw error;
  }
};

//승인 대기 중인 팟원 조회 api
export const getPodMembers = async (podId: number) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(
      `/api/mypage/inprogress/mypods/${podId}/podmembers`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("mem", res.data.result);
    return res.data.result;
  } catch (error) {
    console.error("Failed to fetch pod detail:", error);
    return null;
  }
};

//팟원 승인 api
export const patchApprovalStatus = async (
  memberId: number,
  podId: number,
  isApprovedStatus: string
) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.patch(
      `/api/mypage/inprogress/mypods/${podId}/podmembers/${memberId}/status`,
      {
        isApprovedStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.error("Failed to fetch pod detail:", error);
    throw error;
  }
};

export const getMemberOrder = async (podId: number, memberId: number) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(
      `/api/mypage/mypods/${podId}/${memberId}/order`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res.data.result);
    return res.data.result;
  } catch (error) {
    console.error("Failed to fetch pod detail:", error);
    return null;
  }
};

export const postOrderForm = async (podId: number, items: number[]) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.get(`/api/orderforms`, {
      params: {
        podId: podId,
      },
      data: {
        items: items,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res;
  } catch (error) {
    console.error("Failed to fetch pod detail:", error);
    return null;
  }
};

//팟 참여 api
export const postPodJoin = async (podId: number, quantity: number) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await userAxios.post(
      `/api/pods/${podId}/join`,
      {
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.error("Failed to fetch pod detail:", error);
    throw error;
  }
};
