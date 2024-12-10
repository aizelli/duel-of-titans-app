import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView, } from "react-native";
import { fetchCharacterById, updateCharacterStatus } from "src/controllers/characterController";
import { Character } from "src/models/character";
import { Status } from "src/models/status";
import AttributeControl from "../components/AttributeControl"; // Componente de atributo separado

const CharacterStatusScreen: React.FC = () => {
    const [character, setCharacter] = useState<Character | null>(null);
    const [status, setStatus] = useState<Status | null>(null);
    const [originalStatus, setOriginalStatus] = useState<Status | null>(null);
    const [pointsToDistribute, setPointsToDistribute] = useState<number>(0);

    const loadCharacter = async () => {
        try {
            const characterId = await AsyncStorage.getItem("@selectedCharacterId");
            if (!characterId) {
                Alert.alert("Erro", "Nenhum personagem selecionado.");
                return;
            }
            const characterData = await fetchCharacterById(Number(characterId));
            setCharacter(characterData);
            setStatus(characterData.status);
            setOriginalStatus(characterData.status); // Salvar o status original para redefinir
            setPointsToDistribute(characterData.availableAttributePoints || 0);
        } catch (error) {
            console.error("Erro ao carregar personagem:", error);
        }
    };

    const increaseAttribute = (attribute: keyof Status) => {
        if (!status || pointsToDistribute <= 0) return;
        setStatus((prevStatus) => {
            if (!prevStatus) return null;
            return {
                ...prevStatus,
                [attribute]: (prevStatus[attribute] || 0) + 1,
            };
        });
        setPointsToDistribute((prev) => prev - 1);
    };

    const decreaseAttribute = (attribute: keyof Status) => {
        if (!status || !originalStatus || pointsToDistribute >= (character?.availableAttributePoints || 0)) return;
        if (status[attribute] > originalStatus[attribute]) {
            setStatus((prevStatus) => {
                if (!prevStatus) return null;
                return {
                    ...prevStatus,
                    [attribute]: (prevStatus[attribute] || 0) - 1,
                };
            });
            setPointsToDistribute((prev) => prev + 1);
        }
    };

    const resetChanges = () => {
        setStatus(originalStatus);
        setPointsToDistribute(character?.availableAttributePoints || 0);
    };

    const confirmChanges = async () => {
        try {
            if (!character || !status) {
                Alert.alert("Erro", "Não foi possível confirmar as alterações.");
                return;
            }
            await updateCharacterStatus(character.id, {
                strength: status.strength,
                dexterity: status.dexterity,
                wisdom: status.wisdom,
                perception: status.perception,
            });
            Alert.alert("Sucesso", "Atributos atualizados com sucesso!");
            loadCharacter(); // Recarregar os dados
        } catch (error) {
            console.error("Erro ao atualizar atributos:", error);
            Alert.alert("Erro", "Não foi possível atualizar os atributos.");
        }
    };

    useEffect(() => {
        loadCharacter();
    }, []);

    if (!character || !status) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.characterName}>{character.name}</Text>
                    <Text style={styles.availablePoints}>
                        Pontos Disponíveis: {pointsToDistribute}
                    </Text>
                </View>
                <View style={styles.stats}>
                    <AttributeControl
                        label="Força"
                        value={status.strength}
                        onIncrease={() => increaseAttribute("strength")}
                        onDecrease={() => decreaseAttribute("strength")}
                        disabledIncrease={pointsToDistribute <= 0}
                        disabledDecrease={
                            !originalStatus || status.strength <= originalStatus.strength
                        }
                    />
                    <AttributeControl
                        label="Destreza"
                        value={status.dexterity}
                        onIncrease={() => increaseAttribute("dexterity")}
                        onDecrease={() => decreaseAttribute("dexterity")}
                        disabledIncrease={pointsToDistribute <= 0}
                        disabledDecrease={
                            !originalStatus || status.dexterity <= originalStatus.dexterity
                        }
                    />
                    <AttributeControl
                        label="Sabedoria"
                        value={status.wisdom}
                        onIncrease={() => increaseAttribute("wisdom")}
                        onDecrease={() => decreaseAttribute("wisdom")}
                        disabledIncrease={pointsToDistribute <= 0}
                        disabledDecrease={
                            !originalStatus || status.wisdom <= originalStatus.wisdom
                        }
                    />
                    <AttributeControl
                        label="Percepção"
                        value={status.perception}
                        onIncrease={() => increaseAttribute("perception")}
                        onDecrease={() => decreaseAttribute("perception")}
                        disabledIncrease={pointsToDistribute <= 0}
                        disabledDecrease={!originalStatus || status.perception <= originalStatus.perception}
                    />
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.confirmButton} onPress={confirmChanges}>
                        <Text style={styles.confirmText}>Confirmar Alterações</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resetButton} onPress={resetChanges}>
                        <Text style={styles.resetText}>Redefinir Alterações</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        alignItems: "center",
        marginBottom: 16,
    },
    characterName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    availablePoints: {
        fontSize: 18,
        color: "#555",
    },
    stats: {
        marginVertical: 16,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: "#28A745",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginRight: 8,
    },
    confirmText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    resetButton: {
        flex: 1,
        backgroundColor: "#DC3545",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginLeft: 8,
    },
    resetText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CharacterStatusScreen;
