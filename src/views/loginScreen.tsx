import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../../App';
import React from "react";
import { useState } from "react"
import { Alert, Button, Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { login } from "src/controllers/authController";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        try {
            const user = await login({ email, password });
            if (user) {
                navigation.navigate("CharactersList")
            }
        } catch (error) {
            const err = error as Error;
            Alert.alert("Erro", err.message);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Entrar" onPress={handleLogin} />
            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate("Register")}
            >
                <Text style={styles.registerText}>Não tem uma conta? Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    registerButton: {
        marginTop: 16,
        alignItems: "center",
    },
    registerText: {
        color: "#007BFF",
        fontWeight: "bold",
    },
});

export default LoginScreen;