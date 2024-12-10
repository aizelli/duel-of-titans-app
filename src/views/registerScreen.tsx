import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { registerUser, validatePassword } from "../controllers/authController";

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, "Register">;

const RegisterScreen: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const navigation = useNavigation<RegisterScreenNavigationProp>();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Erro", "Preencha todos os campos!");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não conferem!");
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert(
                "Erro",
                "A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, letras minúsculas, números e caracteres especiais."
            );
            return;
        }

        try {
            const success = await registerUser(name, email, password);

            if (success) {
                navigation.navigate("Login")
            } else {
                Alert.alert("Erro", "Erro ao realizar o cadastro.");
            }
            
        } catch (error) {
            const err = error as Error;
            Alert.alert("Erro", err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.passwordRules}>
                A senha deve conter no mínimo 8 caracteres, incluindo:
                {"\n"}- Letras maiúsculas e minúsculas
                {"\n"}- Números
                {"\n"}- Caracteres especiais (ex: @, #, !, &)
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <Button title="Cadastrar" onPress={handleRegister} />
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
    passwordRules: {
        fontSize: 14,
        color: "#555",
        marginBottom: 12,
        lineHeight: 20,
    },
});

export default RegisterScreen;
