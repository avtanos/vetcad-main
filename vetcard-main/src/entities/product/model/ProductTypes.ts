export interface ProductSubcategory {
  id: number;
  category_id: number;
  name_ru: string;
  name_kg?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
}

export interface ProductCategory {
  id: number;
  name_ru: string;
  name_kg?: string;
  description?: string;
  icon_url?: string;
  is_active: boolean;
  sort_order: number;
  subcategories?: ProductSubcategory[];
}

export interface Product {
  id: number;
  name_ru: string;
  name_kg: string;
  is_active: boolean;
  img_url: string;
  description: string;
  user: number;
  subcategory_id?: number;
  subcategory?: ProductSubcategory;
  price?: string;
  stock_quantity?: number;
}