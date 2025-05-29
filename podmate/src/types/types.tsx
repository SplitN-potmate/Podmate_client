export interface PodProps {
    podId: number;
    podName: string;
    podType: string;
    podStatus: string;
    itemUrl: string;
    currentAmount: number;
    goalAmount: number;
    jjim: boolean;
    platform: string | null;
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
