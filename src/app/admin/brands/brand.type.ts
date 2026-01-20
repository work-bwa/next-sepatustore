// Types untuk Brand
export interface Brand {
  id: string;
  name: string;
  logo: string;
  createdAt: Date | null;
}

export interface BrandFormData {
  name: string;
  logo: string;
}
