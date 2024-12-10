import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import React, { useEffect, useState } from "react"
import { SafeAreaView, View, Text, Image, StyleSheet, ActivityIndicator, FlatList, Alert, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { getUserToken } from "src/controllers/authController";
import { createCharacter, fetchCharacterByUserId } from "src/controllers/characterController";
import { Character } from "src/models/character"

type CharacterListScreenNavigationProp = StackNavigationProp<RootStackParamList, "CharacterDetails">;

const CharacterListScreen: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [newCharacterName, setNewCharacterName] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string>("");

    const navigation = useNavigation<CharacterListScreenNavigationProp>();

    const images = [
        { name: "Nerd", url: "https://pixabay.com/get/gd8fbd5c68f9bbd51292ec00e8fb10fca0adcd647e2b84aec6d94ee5f54c5a1d7ecc92da54ecb6e07a5b29b59b83343235b686e8f3f15c05f2168d8b4c0c2920b97f8827baa822decb7a9e2f928636d60_640.png" },
        { name: "Piscadinha", url: "https://pixabay.com/get/gff9ed63965f94b4ee2c9e293fcc901553cf25aca2ba07b420979f0bbc7de24021c1b2ff09e381c997b64c2b5539e257610c281d05bc685111745e7a6859cd0f19b7ff0d6fb075771f1e144d04a5fa62b_640.png" },
        { name: "Feliz", url: "https://pixabay.com/get/gb32ff5e9d99a1721a550f21e75f1454f79e9662a223f8a800a0bcd09c09cc6bbff72d6041f0b0ec0a82e206914cb2c4ed7c2c9664741f458411c519de3e97e0fbdacf002f38852a73f9e81a1fef5a547_640.png" },
        { name: "Amoroso", url: "https://pixabay.com/get/ge9f1c4483a98deff9430c9f0956ff841cdae6876fc53cfbc08c3e03f91ff1143ad9775e959fdae20e43d7d17628420c19a118851bc44bc4e9e93f655820f433b81f3c8f6ea16618ba50bff85ee3ec324_640.png" },
        { name: "Soninho", url: "https://pixabay.com/get/g22f23376afeed7f93802e2883b29470aa2a703410a3d06ea47e31033d1d88a4605a3208881e956523b41d65292baa7431ef6a31f16c2d76fabea04023dd5f1dcc49789a1d83a7d57744e38ee697d3da8_640.png" },
    ];

    const toggleModal = () => {
        setModalVisible((prevState) => !prevState);
    };

    useEffect(() => {
        const loadCharacters = async () => {
            try {
                setLoading(true);
                const userToken = await getUserToken();
                if (!userToken?.id) {
                    console.error("User não encontrado.");
                    return;
                }
                setCharacters(await fetchCharacterByUserId(userToken.id))
            } catch (error) {
                const err = error as Error;
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCharacters();
    }, []);

    const handleCreateCharacter = async () => {
        try {
            const userToken = await getUserToken();
            if (!userToken?.id) {
                Alert.alert("Erro", "Usuário não encontrado.");
                return;
            }
            const newCharacter = await createCharacter({
                name: newCharacterName,
                imagem: selectedImage,
                level: 1,
                experience: 0,
                experienceNextLevel: 100,
                availableAttributePoints: 3,
                totalAttributePoints: 0,
                coins: 100,
                userId: userToken.id
            });

            Alert.alert("Sucesso", `Personagem "${newCharacter.name}" criado com sucesso!`);
            setModalVisible(false);
            setNewCharacterName("");
            setSelectedImage("");
            setCharacters([...characters, newCharacter]);
        } catch (error) {
            console.error("Erro ao criar personagem:", error);
            Alert.alert("Erro", "Não foi possível criar o personagem.");
        }
    }

    const handleSelectImage = (url: string) => {
        setSelectedImage(url);
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    const handleSelectCharacter = async (characterId: number) => {
        try {
            await AsyncStorage.setItem("@selectedCharacterId", characterId.toString());
            navigation.navigate("CharacterDetails");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível selecionar o personagem.");
        }
    };

    const renderCharacter = ({ item }: { item: Character }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>Nível: {item.level}</Text>
                <Text>Criado em: {new Date(item.createAt).toLocaleDateString()}</Text>
                <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleSelectCharacter(item.id)}
                >
                    <Text style={styles.selectButtonText}>Selecionar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView>
            {characters.length === 0 ? (
                <Text>Nenhum personagem encontrado.</Text>
            ) : (
                <FlatList
                    data={characters}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCharacter}
                    contentContainerStyle={styles.list}
                />
            )}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => toggleModal()}
            >
                <Text style={styles.addButtonText}>Criar Novo Personagem</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => toggleModal()}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Criar Novo Personagem</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do Personagem"
                            value={newCharacterName}
                            onChangeText={setNewCharacterName}
                        />
                        <Text>Selecione uma imagem:</Text>
                        <FlatList
                            data={images}
                            keyExtractor={(item) => item.url}
                            horizontal
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectImage(item.url)}>
                                    <Image
                                        source={{ uri: item.url }}
                                        style={[
                                            styles.imageOption,
                                            selectedImage === item.url && styles.selectedImage,
                                        ]}
                                    />
                                    <Text style={styles.imageText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.createButton]}
                                onPress={handleCreateCharacter}
                            >
                                <Text style={styles.buttonText}>Criar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => toggleModal()}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
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
    imageOption: {
        width: 60,
        height: 60,
        margin: 8,
        borderRadius: 30,
    },
    selectedImage: {
        borderColor: "#007BFF",
        borderWidth: 2,
    },
    imageText: {
        textAlign: "center",
        fontSize: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    addButton: {
        backgroundColor: "#007BFF",
        padding: 16,
        borderRadius: 8,
        position: "absolute",
        bottom: 16,
        right: 16,
        left: 16,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 10,
    },
    modalContent: {
        width: 350,
        padding: 25,
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center"
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    selectButton: {
        backgroundColor: "#28A745",
        padding: 8,
        borderRadius: 5,
        marginTop: 8,
    },
    selectButtonText: {
        color: "#fff",
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 4,
    },
    createButton: {
        backgroundColor: "#28A745",
    },
    cancelButton: {
        backgroundColor: "#DC3545",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CharacterListScreen;