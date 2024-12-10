import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface AttributeControlProps {
    label: string;
    value: number;
    onIncrease: () => void;
    onDecrease: () => void;
    disabledIncrease: boolean;
    disabledDecrease: boolean;
}

const AttributeControl: React.FC<AttributeControlProps> = ({
    label,
    value,
    onIncrease,
    onDecrease,
    disabledIncrease,
    disabledDecrease,
}) => (
    <View style={styles.statRow}>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.controls}>
            <TouchableOpacity
                style={[styles.button, disabledDecrease && styles.disabled]}
                onPress={onDecrease}
                disabled={disabledDecrease}
            >
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.value}>{value}</Text>
            <TouchableOpacity
                style={[styles.button, disabledIncrease && styles.disabled]}
                onPress={onIncrease}
                disabled={disabledIncrease}
            >
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    statRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 18,
        flex: 1,
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 8,
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default AttributeControl;
