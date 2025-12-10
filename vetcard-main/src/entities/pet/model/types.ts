export interface Pet {
  id: string;
  name: string;
  species: number;
  breed: string;
  birth_date: string;
  weight?: number;
  image_url: string;
  special_notes?: string;
  user?: number;
}