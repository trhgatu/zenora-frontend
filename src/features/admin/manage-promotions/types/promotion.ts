export interface Promotion {
    id: string;
    promotionName: string;
    description: string;
    discountAmount: number;
    discountPercent: number;
    quantity: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    rankIds: string[];
}

export interface CreatePromotionRequest {
    promotionName: string;
    description: string;
    discountAmount: number;
    discountPercent: number;
    quantity: number;
    startDate: string;
    endDate: string;
    rankIds: string[];
}