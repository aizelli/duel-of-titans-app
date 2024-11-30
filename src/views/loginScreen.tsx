import React from "react";
import { useState } from "react"
import { Alert, Button, Text, TextInput, View, StyleSheet } from "react-native";
import { login } from "src/controllers/authController";

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handlerLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        try {
            const user = await login({ email, password });
            if (user) {
                Alert.alert("Sucesso", "Bemvindo, ${user.email}!");
                console.log("ID", user.id);
                console.log("Role", user.role);
            }
        } catch (error) {
            Alert.alert("Error");
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
            <Button title="Entrar" onPress={handlerLogin} />
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
});

export default LoginScreen;