import React, { useEffect, useState } from "react"
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { getUserToken } from "src/controllers/authController";
import { fetchCharacterByUserId } from "src/controllers/characterController";
import { Character } from "src/models/character"

const CharacterListScreen: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadCharacters = async () => {
            try {
                setLoading(true);
                const userToken = await getUserToken();
                console.log("Token: ", userToken)
                if (!userToken?.id) {
                    console.error("User não encontrado.");
                    return;
                }
                setCharacters(await fetchCharacterByUserId(userToken.id))
                console.log("characters: ", characters)
            } catch (error) {
                const err = error as Error;
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCharacters();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    if (characters.length === 0) {
        return (
            <View style={styles.container}>
                <Text>Nenhum personagem encontrado.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={characters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Image source={{ uri: item.imagem }} style={styles.image} />
                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text>Nível: {item.level}</Text>
                        <Text>Criado em: {new Date(item.createAt).toLocaleDateString()}</Text>
                    </View>
                </View>
            )}
            contentContainerStyle={styles.list}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    list: {
        padding: 16,
    },
    card: {
        flexDirection: "row",
        marginBottom: 16,
        padding: 16,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        elevation: 2,
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 16,
        borderRadius: 30,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
});

export default CharacterListScreen;