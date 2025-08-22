// hooks/usarBD.js - Versão ultra simples
import { useSQLiteContext } from 'expo-sqlite';

export function usarBD() {
    const db = useSQLiteContext();

    const create = async (dados) => {
        const result = await db.runAsync(
            'INSERT INTO transacoes (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)',
            dados.descricao, dados.valor, dados.tipo, dados.categoria, dados.data
        );
        return { idTransacao: result.lastInsertRowId.toString() };
    };

    const read = async (descricao = '') => {
        return await db.getAllAsync(
            'SELECT * FROM transacoes WHERE descricao LIKE ? ORDER BY data DESC',
            `%${descricao}%`
        );
    };

    const update = async (dados) => {
        await db.runAsync(
            'UPDATE transacoes SET descricao=?, valor=?, tipo=?, categoria=?, data=? WHERE id=?',
            dados.descricao, dados.valor, dados.tipo, dados.categoria, dados.data, dados.id
        );
    };

    const remove = async (id) => {
        await db.runAsync('DELETE FROM transacoes WHERE id = ?', id);
    };

    const getSaldo = async () => {
        try {
            const all = await db.getAllAsync('SELECT * FROM transacoes');
            const receitas = all.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0);
            const despesas = all.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0);
            const saldo = receitas - despesas;
            
            return {
                receitas: receitas.toFixed(2),
                despesas: despesas.toFixed(2),
                saldo: saldo.toFixed(2)
            };
        } catch (error) {
            return { receitas: '0.00', despesas: '0.00', saldo: '0.00' };
        }
    };

    return { create, read, update, remove, getSaldo };
}