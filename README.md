<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ik.imagekit.io/91phxemhf/logo-white.svg?updatedAt=1709408488312" />
    <source media="(prefers-color-scheme: light)" srcset="https://ik.imagekit.io/91phxemhf/logo-black.svg?updatedAt=1709408488564" />
    <img alt="" height="100px" src="https://ik.imagekit.io/91phxemhf/logo-black.svg?updatedAt=1709408488564" />
  </picture>
</p>


lingo-ts é uma biblioteca leve de internacionalização para projetos TypeScript, projetada para ser 100% segura em relação a tipos. Ela se integra perfeitamente com Next.js, React/Vite e React Native, fornecendo métodos fáceis de usar para gerenciar traduções e locais.


## Características

- **Segurança em Tipos**: Aproveite os benefícios da verificação estática de tipos para evitar erros de tradução.
- **Integração Flexível**: Funciona perfeitamente com Next.js, React/Vite e React Native.
- **Gerenciamento Fácil de Locais**: Gerencie locais com facilidade usando os métodos fornecidos.
- **Carregamento Eficiente de Tradução**: As traduções são carregadas dinamicamente, otimizando o desempenho.

## Instalação

Instale o lingo-ts via npm ou yarn:

```bash
npm install lingo-ts
# ou
yarn add lingo-ts
```

## Uso

### Para Next.js com Componentes de Servidor:

```jsx
import { createServerI18n } from "lingo-ts";

// Defina seus locais
const locales = {
    "pt-BR": () => import("./pt-br"),
    "en-US": () => import("./en"),
};

// Crie uma instância de internacionalização do lado do servidor
const {
    getI18n,
    getScopedI18n,
} = createServerI18n(locales, {
    defaultLocale: "pt-BR",
    persistentLocale: {
        get: () => cookies().get("locale").value,
    },
});

```

### Para React ou React Native:

```jsx
import { createClientI18n } from "lingo-ts";
import { getCookie, setCookie } from "./cookies";

// Defina seus locais
const locales = {
    "pt-BR": () => import("./pt-br"),
    "en-US": () => import("./en"),
};

// Crie uma instância de internacionalização do lado do cliente
const {
    useI18n,
    useChangeLocale,
    I18nProvider
} = createClientI18n(locales, {
    defaultLocale: "pt-BR",
});
```

## Contribuição

Contribuições são bem-vindas! Por favor, leia as [Diretrizes de Contribuição](CONTRIBUTING.md) antes de enviar qualquer pull request.

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
