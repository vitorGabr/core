# Lingo-TS

Lingo-TS é uma biblioteca simples de internacionalização (i18n) escrita em TypeScript. Ela fornece suporte tanto para aplicações do lado do servidor quanto do lado do cliente, incluindo projetos React e React Native. A biblioteca é 100% typesafe e oferece métodos convenientes para tradução de texto.

## Instalação

Para instalar o Lingo-TS em seu projeto, você pode utilizar o pnpm, npm ou yarn:

```bash
pnpm install lingo-ts
# ou
npm install lingo-ts
# ou
yarn add lingo-ts
```

## Uso

Para começar a usar o Lingo-TS, você precisa primeiro criar uma instância do objeto de internacionalização usando a função `createI18n`. Aqui está um exemplo de como você pode fazer isso:

```typescript
import { createI18n } from 'lingo-ts';

const {
    server: {
        getI18n,
        getScopedI18n
    }
} = createI18n({
		"pt-BR": () => import("./utils/pt-br").then((module) => module.default),
	});
```

Após criar a instância do objeto `i18n`, você pode usar os métodos `t()` e `scopedT()` para traduzir texto em seu aplicativo:

```typescript
// Tradução de texto simples
const t = await getI18n();
const translatedText = t('Hello');


// Tradução de texto com escopo
const scopedT = await getScopedI18n('myScope');
const translatedScopedText = scopedT('Hello');
```

## Exemplos

Aqui está um exemplo básico de como você pode usar o Lingo-TS em um aplicativo React:

```typescript
import React from 'react';
import { createI18n } from 'lingo-ts';

const i18n = createI18n({
  // Configurações de idioma aqui
});

const App: React.FC = () => {
  return (
    <div>
      <h1>{i18n.t('Welcome')}</h1>
      <p>{i18n.t('This is a simple example of Lingo-TS usage')}</p>
    </div>
  );
};

export default App;
```

## Contribuição

Contribuições são bem-vindas! Se você deseja contribuir com o projeto, por favor, abra uma issue para discutir suas ideias ou envie uma pull request com suas alterações.

## Licença

Este projeto é licenciado sob a [Licença MIT](LICENSE).