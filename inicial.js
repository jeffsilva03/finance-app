import { View, Text, StyleSheet, TextInput, Alert, FlatList, TouchableOpacity, StatusBar, Modal, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { usarBD } from "./hooks/usarBD";
import { Transacao } from './components/transacao';

const { width } = Dimensions.get('window');

const categorias = [
  'Alimentação', 'Transporte', 'Trabalho', 'Lazer', 
  'Saúde', 'Educação', 'Casa', 'Outros'
];

export function Index() {
  const [id, setId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("despesa");
  const [categoria, setCategoria] = useState("Outros");
  const [pesquisa, setPesquisa] = useState("");
  const [transacoes, setTransacoes] = useState([]);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [saldo, setSaldo] = useState({ receitas: '0', despesas: '0', saldo: '0' });
  const [modalCategoria, setModalCategoria] = useState(false);
  const transacoesBD = usarBD();

  const remove = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await transacoesBD.remove(id);
              await listar();
              await carregarSaldo();
              if (transacaoSelecionada && transacaoSelecionada.id === id) {
                limparFormulario();
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  };

  async function create() {
    if (!descricao.trim()) {
      return Alert.alert('Atenção', 'A descrição não pode estar vazia!');
    }
    if (!valor || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
      return Alert.alert('Atenção', 'Digite um valor válido maior que zero!');
    }
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const item = await transacoesBD.create({
        descricao: descricao.trim(),
        valor: parseFloat(valor),
        tipo,
        categoria,
        data: hoje,
      });
      Alert.alert('Sucesso', `Transação cadastrada com sucesso!\nID: ${item.idTransacao}`);
      limparFormulario();
      listar();
      carregarSaldo();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Erro ao cadastrar transação!');
    }
  }

  async function update() {
    if (!descricao.trim()) {
      return Alert.alert('Atenção', 'A descrição não pode estar vazia!');
    }
    if (!valor || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
      return Alert.alert('Atenção', 'Digite um valor válido maior que zero!');
    }
    if (!transacaoSelecionada) {
      return Alert.alert('Erro', 'Nenhuma transação selecionada para atualizar!');
    }
    try {
      await transacoesBD.update({
        id: transacaoSelecionada.id,
        descricao: descricao.trim(),
        valor: parseFloat(valor),
        tipo,
        categoria,
        data: transacaoSelecionada.data,
      });
      Alert.alert('Sucesso', 'Transação atualizada com sucesso!');
      limparFormulario();
      listar();
      carregarSaldo();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Erro ao atualizar transação!');
    }
  }

  async function listar() {
    try {
      const captura = await transacoesBD.read(pesquisa);
      setTransacoes(captura);
    } catch (error) {
      console.log(error);
    }
  }

  async function carregarSaldo() {
    try {
      const saldoData = await transacoesBD.getSaldo();
      setSaldo(saldoData);
    } catch (error) {
      console.log(error);
    }
  }

  const selecionarTransacao = (transacao) => {
    setTransacaoSelecionada(transacao);
    setDescricao(transacao.descricao);
    setValor(transacao.valor.toString());
    setTipo(transacao.tipo);
    setCategoria(transacao.categoria);
    setModoEdicao(true);
  };

  const limparFormulario = () => {
    setId("");
    setDescricao("");
    setValor("");
    setTipo("despesa");
    setCategoria("Outros");
    setTransacaoSelecionada(null);
    setModoEdicao(false);
  };

  const cancelarEdicao = () => {
    limparFormulario();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  useEffect(() => {
    listar();
    carregarSaldo();
  }, [pesquisa]);

  const CustomButton = ({ title, onPress, variant = "primary", icon, disabled = false }) => (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'outline' && styles.buttonOutline,
        disabled && styles.buttonDisabled
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {variant === 'outline' ? (
        <View style={styles.buttonOutlineContent}>
          {icon && <MaterialIcons name={icon} size={18} color="#667085" />}
          <Text style={styles.buttonOutlineText}>{title}</Text>
        </View>
      ) : (
        <LinearGradient
          colors={
            variant === 'primary' 
              ? ['#6366f1', '#4f46e5'] 
              : variant === 'success'
              ? ['#10b981', '#059669']
              : ['#64748b', '#475569']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          {icon && <MaterialIcons name={icon} size={18} color="#ffffff" />}
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );

  const StatsCard = ({ title, value, icon, gradientColors, isMain = false }) => (
    <View style={[styles.statsCard, isMain && styles.statsCardMain]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.statsCardGradient, isMain && styles.statsCardGradientMain]}
      >
        <View style={styles.statsCardHeader}>
          <View style={styles.statsIconContainer}>
            <MaterialIcons name={icon} size={isMain ? 28 : 24} color="rgba(255,255,255,0.9)" />
          </View>
          <Text style={[styles.statsTitle, isMain && styles.statsTitleMain]}>{title}</Text>
        </View>
        <Text style={[styles.statsValue, isMain && styles.statsValueMain]}>
          {formatCurrency(value)}
        </Text>
        <View style={styles.statsIndicator}>
          <MaterialIcons 
            name={parseFloat(value) >= 0 ? "trending-up" : "trending-down"} 
            size={16} 
            color="rgba(255,255,255,0.7)" 
          />
        </View>
      </LinearGradient>
    </View>
  );

  const TypeButton = ({ typeValue, label, icon, colors }) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        tipo === typeValue && styles.typeButtonActive,
      ]}
      onPress={() => setTipo(typeValue)}
      activeOpacity={0.8}
    >
      {tipo === typeValue ? (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.typeButtonGradient}
        >
          <MaterialIcons name={icon} size={20} color="#ffffff" />
          <Text style={styles.typeButtonTextActive}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.typeButtonInactive}>
          <MaterialIcons name={icon} size={20} color="#9ca3af" />
          <Text style={styles.typeButtonText}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
      
      {/* Header com design glassmorphism */}
      <LinearGradient
        colors={['#1e1b4b', '#3730a3', '#4338ca']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.headerIcon}>
              <MaterialIcons name="account-balance-wallet" size={28} color="#ffffff" />
            </View>
            <Text style={styles.headerTitle}>FinanceApp</Text>
          </View>
          <Text style={styles.headerSubtitle}>Controle suas finanças com inteligência</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dashboard modernizado */}
        <View style={styles.dashboardContainer}>
          <StatsCard
            title="Saldo Total"
            value={saldo.saldo}
            icon="account-balance"
            gradientColors={
              parseFloat(saldo.saldo) >= 0 
                ? ['#3b82f6', '#1d4ed8'] 
                : ['#ef4444', '#dc2626']
            }
            isMain={true}
          />
          <View style={styles.statsRow}>
            <StatsCard
              title="Receitas"
              value={saldo.receitas}
              icon="trending-up"
              gradientColors={['#10b981', '#047857']}
            />
            <StatsCard
              title="Despesas"
              value={saldo.despesas}
              icon="trending-down"
              gradientColors={['#f59e0b', '#d97706']}
            />
          </View>
        </View>

        {/* Form Card aprimorado */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {modoEdicao ? 'Editar Transação' : 'Nova Transação'}
            </Text>
            <View style={[styles.formBadge, modoEdicao && styles.formBadgeEdit]}>
              <MaterialIcons 
                name={modoEdicao ? "edit" : "add"} 
                size={16} 
                color="#ffffff" 
              />
            </View>
          </View>
          
          {/* Type Selection melhorado */}
          <View style={styles.typeContainer}>
            <TypeButton 
              typeValue="receita" 
              label="Receita" 
              icon="add-circle" 
              colors={['#10b981', '#059669']}
            />
            <TypeButton 
              typeValue="despesa" 
              label="Despesa" 
              icon="remove-circle" 
              colors={['#ef4444', '#dc2626']}
            />
          </View>

          {/* Inputs modernizados */}
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <MaterialIcons name="description" size={20} color="#6366f1" />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Descrição da transação"
                placeholderTextColor="#9ca3af"
                onChangeText={setDescricao}
                value={descricao}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <MaterialIcons name="payments" size={20} color="#6366f1" />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="0,00"
                placeholderTextColor="#9ca3af"
                onChangeText={setValor}
                value={valor}
                keyboardType="numeric"
              />
              <Text style={styles.currencyLabel}>BRL</Text>
            </View>

            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setModalCategoria(true)}
              activeOpacity={0.7}
            >
              <View style={styles.inputIconContainer}>
                <MaterialIcons name="category" size={20} color="#6366f1" />
              </View>
              <Text style={styles.categoryText}>{categoria}</Text>
              <MaterialIcons name="expand-more" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonContainer}>
            {modoEdicao ? (
              <>
                <CustomButton 
                  title="Atualizar" 
                  onPress={update} 
                  variant="success"
                  icon="check"
                />
                <CustomButton 
                  title="Cancelar" 
                  onPress={cancelarEdicao} 
                  variant="outline"
                  icon="close"
                />
              </>
            ) : (
              <CustomButton 
                title="Adicionar Transação" 
                onPress={create} 
                icon="add"
              />
            )}
          </View>
        </View>

        {/* Search modernizado */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <View style={styles.searchIconContainer}>
              <MaterialIcons name="search" size={20} color="#6366f1" />
            </View>
            <TextInput 
              style={styles.searchInput}
              placeholder="Buscar transações..." 
              placeholderTextColor="#9ca3af"
              onChangeText={setPesquisa}
              value={pesquisa}
            />
            {pesquisa ? (
              <TouchableOpacity 
                onPress={() => setPesquisa("")}
                style={styles.clearButton}
                activeOpacity={0.6}
              >
                <MaterialIcons name="close" size={18} color="#9ca3af" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* List Header */}
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.listTitle}>Histórico</Text>
            <Text style={styles.listSubtitle}>Últimas transações</Text>
          </View>
          <View style={styles.transactionsBadge}>
            <Text style={styles.transactionsBadgeText}>{transacoes.length}</Text>
          </View>
        </View>
    
        <FlatList
          contentContainerStyle={styles.listContent}
          data={transacoes}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Transacao 
              data={item} 
              onDelete={() => remove(item.id)}
              onSelect={() => selecionarTransacao(item)}
              isSelected={transacaoSelecionada && transacaoSelecionada.id === item.id}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <MaterialIcons name="receipt-long" size={40} color="#e5e7eb" />
              </View>
              <Text style={styles.emptyTitle}>Nenhuma transação</Text>
              <Text style={styles.emptyText}>
                {pesquisa ? 'Nenhum resultado encontrado para sua busca' : 'Comece adicionando sua primeira transação financeira'}
              </Text>
            </View>
          )}
        />
      </ScrollView>

      {/* Modal de Categorias aprimorado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCategoria}
        onRequestClose={() => setModalCategoria(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolher Categoria</Text>
              <TouchableOpacity
                onPress={() => setModalCategoria(false)}
                style={styles.modalCloseIcon}
              >
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={categorias}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    categoria === item && styles.categoryOptionSelected
                  ]}
                  onPress={() => {
                    setCategoria(item);
                    setModalCategoria(false);
                  }}
                  activeOpacity={0.6}
                >
                  <View style={styles.categoryOptionContent}>
                    <Text style={[
                      styles.categoryOptionText,
                      categoria === item && styles.categoryOptionTextSelected
                    ]}>
                      {item}
                    </Text>
                    {categoria === item && (
                      <View style={styles.categoryCheckIcon}>
                        <MaterialIcons name="check" size={18} color="#ffffff" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main Container
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Header
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },

  // Container
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Dashboard
  dashboardContainer: {
    marginTop: -20,
    marginBottom: 24,
    gap: 16,
  },
  statsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statsCardMain: {
    transform: [{ scale: 1.02 }],
  },
  statsCardGradient: {
    padding: 20,
    position: 'relative',
  },
  statsCardGradientMain: {
    padding: 24,
  },
  statsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statsTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsTitleMain: {
    fontSize: 16,
  },
  statsValue: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 8,
  },
  statsValueMain: {
    fontSize: 32,
  },
  statsIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },

  // Form
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  formBadge: {
    width: 32,
    height: 32,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formBadgeEdit: {
    backgroundColor: '#f59e0b',
  },

  // Type Selection
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  typeButtonActive: {
    borderColor: 'transparent',
  },
  typeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  typeButtonInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    backgroundColor: '#f8fafc',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  typeButtonTextActive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Inputs
  inputGroup: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  inputIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    paddingVertical: 16,
  },
  currencyLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    paddingVertical: 16,
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  buttonOutlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonOutlineText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },

  // Search
  searchContainer: {
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    paddingVertical: 16,
  },
  clearButton: {
    padding: 8,
  },

  // List
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  transactionsBadge: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionsBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 20,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f8fafc',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#f1f5f9',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalCloseIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryOption: {
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  categoryOptionSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  categoryOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  categoryCheckIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});