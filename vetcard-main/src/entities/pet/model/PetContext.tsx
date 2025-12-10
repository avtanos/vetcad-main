import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Pet } from './types';
import { api } from '@/shared/api';

interface PetContextType {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  removePet: (id: string) => void;
  updatePet: (pet: Pet) => void;
  fetchPets: () => Promise<void>;
  speciesDict: Record<number, string>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

let petsCache: Pet[] | null = null;

export const PetProvider = ({ children }: { children: ReactNode }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [speciesDict, setSpeciesDict] = useState<Record<number, string>>({});

  const fetchPets = async () => {
    if (petsCache) {
      setPets(petsCache);
      return;
    }
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) return;
    try {
      const data = await api.get<Pet[]>('/v1/pet/', { 'Authorization': `Bearer ${accessToken}` });
      setPets(data);
      petsCache = data;
    } catch (error) {
      setPets([]);
    }
  };

  useEffect(() => {
    if (!petsCache) {
      fetchPets();
    } else {
      setPets(petsCache);
    }
  }, []);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const data = await api.get<any[]>('/v1/reference/ref_type_of_animal/');
        const dict: Record<number, string> = {};
        data.filter((item: any) => item.is_active).forEach((item: any) => {
          dict[item.id] = item.name_ru;
        });
        setSpeciesDict(dict);
      } catch {
        setSpeciesDict({});
      }
    };
    fetchSpecies();
  }, []);

  const addPet = (pet: Pet) => {
    setPets(prev => {
      const updated = [...prev, pet];
      petsCache = updated;
      return updated;
    });
  };

  const removePet = (id: string) => {
    setPets(prev => {
      const updated = prev.filter(pet => pet.id !== id);
      petsCache = updated;
      return updated;
    });
  };

  const updatePet = (updatedPet: Pet) => {
    setPets(prev => {
      const updated = prev.map(pet => pet.id === updatedPet.id ? updatedPet : pet);
      petsCache = updated;
      return updated;
    });
  };

  return (
    <PetContext.Provider value={{ pets, addPet, removePet, updatePet, fetchPets, speciesDict }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets должен использоваться внутри PetProvider');
  }
  return context;
}; 