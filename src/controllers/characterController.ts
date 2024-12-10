import { Character } from "src/models/character";
import { Status } from "src/models/status";
import { StatusPartial } from "src/models/statusPartial";
import api from "src/services/api";

export const createCharacter = async (
    characterData: Omit<Character, "id" | "createAt" | "updateAt" | "user" | "status">
): Promise<Character> => {
    try {
        const response = await api.post("/characters", characterData);
        return response.data as Character;
    } catch (error) {
        console.error("Erro ao criar personagem:", error);
        throw new Error("Não foi possível criar o personagem.");
    }
};

export const fetchCharacterByUserId = async (userId: number): Promise<Character[]> => {
    try {
        const response = await api.get(`/characters/user/${userId}`);
        return response.data as Character[];
    } catch (error) {
        console.log("Erro ao listar personagens:", error);
        throw new Error("Falha ao buscar personagens.");
    }
};

export const fetchCharacterById = async (id: number): Promise<Character> => {
    try {
        const response = await api.get(`/characters/${id}`);
        return response.data as Character;
    } catch (error) {
        console.log("Erro ao buscar personagem pelo id:", error);
        throw new Error("Falha ao buscar personagens.");
    }
}

export const updateCharacterById = async (id: number, character: Character): Promise<Character> => {
    try {
        const response = await api.patch(`/character/${id}`, character);
        console.log(response.data)
        return response.data as Character;
    } catch (error) {
        console.log("Erro ao buscar personagem pelo id:", error);
        throw new Error("Falha ao buscar personagens.");
    }
}

export const updateCharacterStatus = async (id: number, statusData: StatusPartial): Promise<Status> => {
    try {
        const response = await api.patch(`/status/${id}`, statusData);
        return response.data as Status;
    } catch (error) {
        console.log("Erro ao buscar status do personagem pelo id:", error);
        throw new Error("Falha ao buscar status do pesonagem.");
    }
}