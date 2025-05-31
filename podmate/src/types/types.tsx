export interface PodProps {
    podId: number;
    podName: string;
    podType: string;
    platform: string;
    itemUrl: string;
    currentAmount: number;
    goalAmount: number;
    jjim: boolean;
    latitude?: number;
    longitude?: number;
    road_address?: string | null;
    roadAddress?: string | null;
    addressId?: number | null;
    podStatus: string;
}
export interface MapBounds {
    swLat: number;
    swLng: number;
    neLat: number;
    neLng: number;
}

interface AddressInfo {
    main: string;
    sub: string;
}

export interface MapState {
    map: any | null;
    isLoading: boolean;
    isMapLoading: boolean;
    isContainerReady: boolean;
    pods: PodProps[];
    currentAddress: AddressInfo;
    bounds: MapBounds | null;
    markers: any[];
    selectedPod: PodProps | null;
}

export interface HeaderButtonProps {
    type1: string;
    type2: string;
    activeType: string;
}

export type postPodMinOrderProps = {
    podName: string;
    platform: string;
    addressId: number;
    endDate: Date | null;
    totalAmount: number;
    description: string | null;
};

export type postPodGroupBuyProps = {
    podName: string;
    addressId: number;
    endDate: Date | null;
    totalAmount: number;
    itemUrl: string;
    description: string | null;
    unitQuantitiy: number;
    unitPrice: number;
    totalQuantity: number;
};

export interface postPodAddressProps {
    roadAddress: string;
    latitude: number;
    longitude: number;
}

export type placeProps = {
    address: string;
    detailedAddress: number | string;
    latitude: number;
    longitude: number;
};

export interface postCartItemsProps {
    platformInfoId: number;
    itemList: CartItem[];
}

export type CartItem = {
    quantity: number;
    itemUrl: string;
    optionText: string;
};

export type StoreItem = CartItem & {
    itemName: string;
    itemId: number;
};


export interface ReviewTarget {
    podId: number;
    recipientId: number;
    options: string[];

export interface PodDetail {
  currentAmount: number;
  goalAmount: number;
  jjim: boolean;
  platform: string;
  podId: number;
  podLeader: {
    description: string;
    nickname: string;
    profileImageUrl: string;
  };
  podName: string;
  podType: string;

}
