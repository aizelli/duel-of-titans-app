import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { fetchCharacterById } from 'src/controllers/characterController';
import { Character } from 'src/models/character';
import { useNavigation } from '@react-navigation/native';

type CharacterDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, "CharacterStatus">

const CharacterDetailsScreen: React.FC = () => {
    const [character, setCharacter] = useState<Character | null>(null);

    const navigation = useNavigation<CharacterDetailsScreenNavigationProp>();

    const loadCharacter = async () => {
        try {
            const characterId = await AsyncStorage.getItem("@selectedCharacterId");
            if (!characterId) {
                Alert.alert("Erro", "Nenhum personagem selecionado.");
                return;
            }
            const characterData = await fetchCharacterById(Number(characterId));
            setCharacter(characterData);
        } catch (error) {
            console.error("Erro ao carregar personagem:", error);
        }
    };

    useEffect(() => {
        loadCharacter();
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: character?.imagem }} style={styles.characterImage} />
                <Text style={styles.characterName}>{character?.name}</Text>
                <Text style={styles.characterLevel}>Nível: {character?.level}</Text>
            </View>
            <View style={styles.stats}>
                <View style={styles.statRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Saúde</Text>
                        <Text style={styles.statValue}>
                            {character?.status?.health}/{character?.status?.maxHealth}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Mana</Text>
                        <Text style={styles.statValue}>
                            {character?.status?.mana}/{character?.status?.maxMana}
                        </Text>
                    </View>
                </View>
                <View style={styles.statRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Força</Text>
                        <Text style={styles.statValue}>{character?.status?.strength}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Destreza</Text>
                        <Text style={styles.statValue}>{character?.status?.dexterity}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Sabedoria</Text>
                        <Text style={styles.statValue}>{character?.status?.wisdom}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Percepção</Text>
                        <Text style={styles.statValue}>{character?.status?.perception}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>Batalhar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>Itens</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>Equipamentos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>Loja</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={()=> navigation.navigate("CharacterStatus")}>
                    <Text style={styles.actionText}>Status</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        alignItems: "center",
        marginBottom: 16,
    },
    characterImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    characterName: {
        fontSize: 24,
        fontWeight: "bold",
    },
    characterLevel: {
        fontSize: 18,
        color: "#555",
    },
    stats: {
        marginVertical: 16,
    },
    statRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    statItem: {
        alignItems: "center",
        flex: 1,
    },
    statLabel: {
        fontSize: 18,
        color: "#555",
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#007BFF",
    },
    actions: {
        marginTop: 20,
    },
    actionButton: {
        backgroundColor: "#007BFF",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: "center",
    },
    actionText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default CharacterDetailsScreen;