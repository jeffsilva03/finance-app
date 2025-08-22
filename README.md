# 💰 FinanceApp - Controle Financeiro

Um aplicativo moderno de controle financeiro desenvolvido em React Native com Expo, oferecendo uma interface intuitiva para gerenciar receitas e despesas pessoais.

## 📱 Capturas de Tela

> Acesse a pasta images para ter acesso a fotos do APP

## ✨ Funcionalidades

- 📊 **Dashboard financeiro** com visualização de saldo, receitas e despesas
- 💸 **Cadastro de transações** (receitas e despesas)
- 🏷️ **Categorização** de transações (Alimentação, Transporte, Trabalho, etc.)
- 🔍 **Busca e filtros** para encontrar transações específicas
- ✏️ **Edição e exclusão** de transações
- 💾 **Armazenamento local** com SQLite
- 🎨 **Interface moderna** com gradientes e animações
- 📱 **Design responsivo** e otimizado para mobile

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento
- **SQLite** - Banco de dados local
- **Expo Linear Gradient** - Gradientes visuais
- **MaterialIcons** - Ícones do Material Design
- **React Hooks** - Gerenciamento de estado

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

Para desenvolvimento mobile:
- [Android Studio](https://developer.android.com/studio) (para Android)
- [Xcode](https://developer.apple.com/xcode/) (para iOS - apenas macOS)

## 🚀 Como executar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/finance-app.git
cd finance-app
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Execute o projeto
```bash
# Inicia o servidor de desenvolvimento
npm start
# ou
yarn start

# Para executar diretamente no Android
npm run android

# Para executar diretamente no iOS
npm run ios

# Para executar na web
npm run web
```

### 4. Visualize no dispositivo
- Baixe o aplicativo **Expo Go** no seu smartphone
- Escaneie o QR Code que aparece no terminal ou navegador
- O app será carregado automaticamente

## 📁 Estrutura do Projeto

```
finance-app/
├── components/          # Componentes reutilizáveis
│   └── transacao.js    # Componente de item de transação
├── databases/          # Configuração do banco de dados
│   └── iniciarBD.js   # Script de inicialização do SQLite
├── hooks/             # Custom hooks
│   └── usarBD.js     # Hook para operações do banco
├── assets/           # Imagens e recursos estáticos
├── inicial.js        # Tela principal do aplicativo
├── App.js           # Componente raiz
├── index.js         # Ponto de entrada
├── app.json         # Configurações do Expo
└── package.json     # Dependências e scripts
```

## 🗄️ Estrutura do Banco de Dados

O aplicativo utiliza SQLite com a seguinte estrutura:

### Tabela: transacoes
| Campo     | Tipo    | Descrição                    |
|-----------|---------|------------------------------|
| id        | INTEGER | Chave primária (auto increment) |
| descricao | TEXT    | Descrição da transação       |
| valor     | REAL    | Valor da transação           |
| tipo      | TEXT    | 'receita' ou 'despesa'       |
| categoria | TEXT    | Categoria da transação       |
| data      | TEXT    | Data da transação (ISO)      |

## 🎨 Características do Design

- **Tema moderno** com gradientes e glassmorphism
- **Cores intuitivas**: Verde para receitas, vermelho para despesas
- **Animações suaves** e feedback visual
- **Tipografia hierárquica** para melhor legibilidade
- **Shadows e elevação** para profundidade visual
- **Layout responsivo** adaptável a diferentes tamanhos de tela

## 📦 Dependências Principais

```json
{
  "@expo/vector-icons": "^14.0.0",
  "expo": "~51.0.28",
  "expo-font": "~12.0.10",
  "expo-linear-gradient": "~13.0.2",
  "expo-sqlite": "~14.0.6",
  "expo-system-ui": "~3.0.7",
  "react": "18.2.0",
  "react-native": "0.74.5"
}
```

## 🚀 Build e Deploy

### Build para produção
```bash
# Build para Android
npm run android --variant=release

# Build para iOS
npm run ios --configuration=Release
```

### Deploy com EAS (Expo Application Services)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar o projeto
eas build:configure

# Build para as lojas
eas build --platform all
```

## 🤝 Como contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de código
- Use ESLint para linting
- Siga os padrões do Conventional Commits
- Mantenha componentes pequenos e reutilizáveis
- Documente funções complexas

## 📝 Roadmap

- [ ] Sincronização com a nuvem
- [ ] Relatórios gráficos avançados
- [ ] Backup automático
- [ ] Notificações de lembretes
- [ ] Modo escuro
- [ ] Suporte a múltiplas moedas
- [ ] Exportação de dados (PDF/Excel)
- [ ] Metas financeiras
- [ ] Categorias personalizáveis


## 👨‍💻 Autor

**Jefferson Silva**
- GitHub: @jeffsilva03 (https://github.com/jeffsilva03)
- LinkedIn: Jefferson Silva([https://linkedin.com/in/seu-perfil](https://www.linkedin.com/in/jefferson-silva-355620323/))
- Email: contato@jeffcode.com.br



Feito com ❤️ e muito ☕
