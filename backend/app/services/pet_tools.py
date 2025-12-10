"""
Инструменты AI для работы с питомцами
"""
from typing import List, Dict, Optional
from app.models.pet import Pet
from datetime import datetime, timedelta


class PetTools:
    """Инструменты для анализа и работы с данными о питомцах"""
    
    @staticmethod
    def analyze_pet_health(pet: Pet, species_dict: Dict[int, str]) -> Dict[str, any]:
        """
        Анализирует здоровье питомца на основе его данных
        
        Returns:
            Словарь с анализом здоровья
        """
        analysis = {
            "pet_name": pet.name,
            "species": species_dict.get(pet.species, "Неизвестный вид"),
            "age": None,
            "health_notes": [],
            "recommendations": []
        }
        
        # Вычисляем возраст
        if pet.birth_date:
            today = datetime.now().date()
            if isinstance(pet.birth_date, str):
                from datetime import datetime as dt
                pet.birth_date = dt.strptime(pet.birth_date, "%Y-%m-%d").date()
            
            age_delta = today - pet.birth_date
            years = age_delta.days // 365
            months = (age_delta.days % 365) // 30
            
            if years > 0:
                analysis["age"] = f"{years} год(а/лет)"
            else:
                analysis["age"] = f"{months} месяц(ев)"
        
        # Анализ веса (если указан)
        if pet.weight:
            analysis["health_notes"].append(f"Вес: {pet.weight} кг")
        
        # Особые пометки
        if pet.special_notes:
            analysis["health_notes"].append(f"Особые пометки: {pet.special_notes}")
            analysis["recommendations"].append("Учитывайте особые пометки при уходе за питомцем")
        
        return analysis
    
    @staticmethod
    def get_vaccination_schedule(pet: Pet, species_dict: Dict[int, str]) -> List[Dict[str, str]]:
        """
        Возвращает рекомендуемый график прививок для питомца
        
        Returns:
            Список рекомендуемых прививок
        """
        species_name = species_dict.get(pet.species, "").lower()
        schedule = []
        
        # Базовые прививки для собак
        if "собака" in species_name or "dog" in species_name:
            schedule = [
                {"age": "6-8 недель", "vaccine": "Первая комплексная прививка (DHPPi)"},
                {"age": "10-12 недель", "vaccine": "Вторая комплексная прививка (DHPPi)"},
                {"age": "14-16 недель", "vaccine": "Третья комплексная прививка + бешенство"},
                {"age": "1 год", "vaccine": "Ежегодная ревакцинация"},
            ]
        # Базовые прививки для кошек
        elif "кошка" in species_name or "cat" in species_name:
            schedule = [
                {"age": "8-9 недель", "vaccine": "Первая комплексная прививка (FVRCP)"},
                {"age": "12 недель", "vaccine": "Вторая комплексная прививка (FVRCP)"},
                {"age": "16 недель", "vaccine": "Третья комплексная прививка + бешенство"},
                {"age": "1 год", "vaccine": "Ежегодная ревакцинация"},
            ]
        
        return schedule
    
    @staticmethod
    def get_feeding_recommendations(pet: Pet, species_dict: Dict[int, str]) -> List[str]:
        """
        Возвращает рекомендации по кормлению
        
        Returns:
            Список рекомендаций
        """
        recommendations = []
        species_name = species_dict.get(pet.species, "").lower()
        
        if pet.weight:
            if "собака" in species_name:
                if pet.weight < 10:
                    recommendations.append("Кормление 3-4 раза в день небольшими порциями")
                elif pet.weight < 25:
                    recommendations.append("Кормление 2-3 раза в день")
                else:
                    recommendations.append("Кормление 2 раза в день")
            elif "кошка" in species_name:
                recommendations.append("Кормление 2-3 раза в день")
        
        if not recommendations:
            recommendations.append("Консультируйтесь с ветеринаром по поводу режима кормления")
        
        return recommendations
    
    @staticmethod
    def suggest_reminders(pet: Pet, species_dict: Dict[int, str]) -> List[Dict[str, str]]:
        """
        Предлагает напоминания на основе данных о питомце
        
        Returns:
            Список предложений для напоминаний
        """
        suggestions = []
        species_name = species_dict.get(pet.species, "").lower()
        
        # Прививки
        if "собака" in species_name or "кошка" in species_name:
            suggestions.append({
                "event": f"Плановый осмотр {pet.name}",
                "description": "Рекомендуется ежегодный профилактический осмотр"
            })
            suggestions.append({
                "event": f"Ревакцинация {pet.name}",
                "description": "Ежегодная ревакцинация"
            })
        
        # Дегельминтизация
        suggestions.append({
            "event": f"Дегельминтизация {pet.name}",
            "description": "Рекомендуется каждые 3 месяца"
        })
        
        return suggestions

