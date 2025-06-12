# TrackFleet - Frontend React

Este é o frontend do sistema TrackFleet, um gerenciador de rotas desenvolvido em React.

## 🚀 Tecnologias Utilizadas

- React 18
- React Router Dom
- Bootstrap 5
- Font Awesome
- Vite

## 📦 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd frontendreact
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
frontendreact/
├── public/
│   └── index.html
├── src/
│   ├── assets/         # Imagens, ícones e outros recursos
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── styles/        # Arquivos CSS
│   ├── App.jsx        # Componente principal
│   └── main.jsx       # Ponto de entrada
├── .gitignore
├── package.json
└── vite.config.js
```

## 🔐 Autenticação

O sistema possui um sistema de autenticação básico com:
- Página de login
- Proteção de rotas
- Gerenciamento de sessão

## 📱 Páginas Principais

- Dashboard (/)
- Login (/login)
- Gestor (/gestor)
- Motorista (/motorista)
- Frota (/frota)
- Eventos (/evento)

## 🛠️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a versão de produção
- `npm run preview`: Visualiza a versão de produção localmente

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
