import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api from "src/services/api";

interface LoginCredentials {
    email: string;
    password: string;
}

interface DecodedToken {
    email: string;
    id: number;
    role: string;
}

export const login = async (credentials: LoginCredentials): Promise<DecodedToken | null> => {
    try {
        const response = await api.post("/auth/login", credentials);

        if (response.status === 201) {
            const token = response.data.access_token;
            const decoded: DecodedToken = jwtDecode(token);

            await AsyncStorage.setItem("@userToken", token);

            return decoded;
        }
        return null;
    } catch (error) {
        console.log("Erro ao fazer login", error);
        throw new Error("Falha ao autentica");
    }
};
