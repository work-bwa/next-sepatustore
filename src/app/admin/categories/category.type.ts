// Types untuk Category
export interface Category {
  id: string;
  name: string;
  icon: string;
  createdAt: Date | null;
}

export interface CategoryFormData {
  name: string;
  icon: string;
}
