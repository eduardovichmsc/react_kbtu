export declare class CreateContactRequestDto {
    type: 'QUOTE' | 'CONSULTATION' | 'ORDER';
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
    productId?: number;
    productName?: string;
    packageName?: string;
}
