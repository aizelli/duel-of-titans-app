import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api from "src/services/api";
import { User } from "../models/user"; // Importa a interface User

interface LoginCredentials {
    email: string;
    password: string;
}

interface DecodedToken {
    name: string;
    email: string;
    id: number;
    role: string;
}

/**
 * Realiza o login de um usuário, decodifica o token JWT e salva o token no AsyncStorage.
 */
export const login = async (credentials: LoginCredentials): Promise<DecodedToken | null> => {
    try {
        const response = await api.post("/auth/login", credentials);

        if (response.status === 201) {
            const token = response.data.access_token;
            const decoded: DecodedToken = jwtDecode(token);

            // Salva o token no AsyncStorage
            await AsyncStorage.setItem("@userToken", token);

            return decoded;
        }
        return null;
    } catch (error) {
        console.log("Erro ao fazer login:", error);
        throw new Error("Falha ao autenticar");
    }
};

export const getUserToken = async (): Promise<DecodedToken | null> => {
    try {
        const token = await AsyncStorage.getItem("@userToken");
        if (token) {
            const decoded: DecodedToken = jwtDecode(token); // Decodifica o token para obter o `userId`
            return decoded;
        }
        return null;
    } catch (error) {
        console.error("Erro ao obter userId do token:", error);
        return null;
    }
}

/**
 * Registra um novo usuário na API.
 */
export const registerUser = async (
    name: string,
    email: string,
    password: string
): Promise<boolean> => {
    try {
        const response = await api.post("/users", {
            name,
            email,
            password,
            type: "user", // Tipo padrão definido como "user"
        });

        if (response.status === 201) {
            return true; // Cadastro realizado com sucesso
        }

        return false; // Algo deu errado
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        throw new Error("Erro ao cadastrar o usuário. Tente novamente.");
    }
};

/**
 * Busca os dados completos do usuário com base no ID.
 */
export const fetchUserById = async (id: number): Promise<User> => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data as User;
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw new Error("Não foi possível buscar os dados do usuário.");
    }
};

/**
 * Valida a força da senha com base em critérios de segurança.
 */
export const validatePassword = (password: string): boolean => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
};
