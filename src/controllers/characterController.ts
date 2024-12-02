import { Character } from "src/models/character";
import api from "src/services/api";

export const fetchCharacterByUserId = async (userId: number): Promise<Character[]> => {
    try {
        const response = await api.get(`/characters/user/${userId}`);
        return response.data as Character[];
    } catch (error) {
        console.log("Erro ao fazer login:", error);
        throw new Error("Falha ao buscar personagens.");
    }
}