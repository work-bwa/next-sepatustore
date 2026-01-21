// Types untuk Shoe
export interface ShoePhoto {
  id: string;
  shoeId: string;
  photo: string;
}

export interface ShoeSize {
  id: string;
  shoeId: string;
  size: string;
}

export interface Shoe {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  about: string;
  isPopular: boolean | null;
  stock: number;
  categoryId: string;
  brandId: string;
  category?: {
    id: string;
    name: string;
  } | null;
  brand?: {
    id: string;
    name: string;
  } | null;
  photos?: ShoePhoto[];
  sizes?: ShoeSize[];
}

export interface ShoeFormData {
  name: string;
  price: number;
  thumbnail: string;
  about: string;
  isPopular: boolean;
  stock: number;
  categoryId: string;
  brandId: string;
  photos: string[];
  sizes: string[];
}

// For form state with file handling
export interface ShoeFormState {
  name: string;
  price: number;
  about: string;
  isPopular: boolean;
  stock: number;
  categoryId: string;
  brandId: string;
  thumbnail: {
    file: File | null;
    preview: string;
    isExisting: boolean;
  };
  photos: {
    id?: string;
    file: File | null;
    preview: string;
    isExisting: boolean;
  }[];
  sizes: {
    id?: string;
    value: string;
  }[];
}
