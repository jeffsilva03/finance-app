import { Pressable, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function Transacao({ data, onDelete, onSelect, isSelected }) {
    const isReceita = data.tipo === 'receita';
    const valorColor = isReceita ? '#22c55e' : '#ef4444';
    const iconName = isReceita ? 'trending-up' : 'trending-down';
    const prefix = isReceita ? '+' : '-';

    const formatCurrency = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR');
    };

    const getCategoryIcon = (categoria) => {
        const icons = {
            'Alimentação': 'restaurant',
            'Transporte': 'directions-car',
            'Trabalho': 'work',
            'Lazer': 'sports-esports',
            'Saúde': 'local-hospital',
            'Educação': 'school',
            'Casa': 'home',
            'Outros': 'category'
        };
        return icons[categoria] || 'category';
    };

    return (
        <Pressable 
            style={[
                styles.container,
                isSelected && styles.containerSelected
            ]} 
            onPress={onSelect}
        >
            <View style={styles.leftContent}>
                <View style={[styles.iconContainer, { backgroundColor: isReceita ? '#22c55e20' : '#ef444420' }]}>
                    <MaterialIcons 
                        name={getCategoryIcon(data.categoria)} 
                        size={24} 
                        color={valorColor} 
                    />
                </View>
                
                <View style={styles.transactionInfo}>
                    <Text style={styles.description}>{data.descricao}</Text>
                    <View style={styles.metaInfo}>
                        <Text style={styles.category}>{data.categoria}</Text>
                        <Text style={styles.date}>{formatDate(data.data)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.rightContent}>
                <View style={styles.valorContainer}>
                    <View style={styles.valorRow}>
                        <MaterialIcons name={iconName} size={16} color={valorColor} />
                        <Text style={[styles.valor, { color: valorColor }]}>
                            {prefix} {formatCurrency(Math.abs(data.valor))}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                    <MaterialIcons name="delete" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        gap: 12,
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "transparent",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 12,
    },
    containerSelected: {
        borderColor: "#3b82f6",
        backgroundColor: "#f0f8ff",
        shadowColor: "#3b82f6",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    leftContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    transactionInfo: {
        flex: 1,
    },
    description: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    category: {
        fontSize: 12,
        color: '#6b7280',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    date: {
        fontSize: 12,
        color: '#9ca3af',
    },
    rightContent: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    valorContainer: {
        alignItems: 'flex-end',
    },
    valorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    valor: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fee2e2',
        marginTop: 8,
    },
});