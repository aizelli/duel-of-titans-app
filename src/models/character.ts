import { Status } from "./status";

export interface Character {
    id: number;
    name: string;
    imagem: string; // Base64 ou URL da imagem
    level: number;
    experience: number;
    experienceNextLevel: number;
    availableAttributePoints: number;
    totalAttributePoints: number;
    coins: number;
    createAt: string;
    updateAt: string;
    status: Status;
}