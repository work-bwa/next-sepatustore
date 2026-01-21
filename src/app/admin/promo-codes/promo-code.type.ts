// Types untuk PromoCode
export interface PromoCode {
  id: string;
  code: string;
  discountAmount: number;
}

export interface PromoCodeFormData {
  code: string;
  discountAmount: number;
}
