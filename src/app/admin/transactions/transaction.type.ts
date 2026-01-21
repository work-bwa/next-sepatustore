export type ProductTransaction = {
  id: string;
  shoeId: string;
  promoCodeId: string | null;
  shoeSize: string;
  quantity: number;
  price: number;
  subTotalAmount: number;
  discountAmount: number | null;
  grandTotalAmount: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postCode: string;
  bookingTrxId: string;
  isPaid: boolean | null;
  proof: string | null;
  shoe?: {
    id: string;
    name: string;
    thumbnail: string;
    price: number;
    sizes?: Array<{ id: string; size: string }>;
  };
  promoCode?: {
    id: string;
    code: string;
    discountAmount: number;
  } | null;
};

export type ProductTransactionFormData = {
  shoeId: string;
  promoCodeId?: string | null;
  shoeSize: string;
  quantity: number;
  price: number;
  subTotalAmount: number;
  discountAmount: number;
  grandTotalAmount: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postCode: string;
  bookingTrxId: string;
  isPaid: boolean;
  proof?: string | null;
};

export type ShoeOption = {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  sizes: Array<{ id: string; size: string }>;
};

export type PromoCodeOption = {
  id: string;
  code: string;
  discountAmount: number;
};

export type ImageFile = {
  file: File | null;
  preview: string;
  isExisting: boolean;
};
