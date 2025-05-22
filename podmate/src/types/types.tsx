export interface PodProps {
    podId: number;
    podName: string;
    podType: string;
    itemUrl: string;
    currentAmount: number;
    goalAmount: number;
    jjim: boolean;
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
