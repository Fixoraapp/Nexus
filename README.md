# Nexus

Premium dark Windows desktop app built with React, TypeScript, Vite, Electron, and electron-builder.

## Development

```bash
npm run desktop
```

`npm run desktop` starts the Vite dev server and opens Electron against `http://localhost:5173`.
Auto updates are disabled in development mode.

## Production Build

```bash
npm run dist
```

The Windows NSIS installer is created in `release/`.

## Auto Updates

Nexus uses `electron-updater` with GitHub Releases:

- Provider: GitHub
- Owner: `Fixoraapp`
- Repo: `Nexus`

Auto updates run only when the Electron app is packaged. In production, Nexus checks for updates, downloads them in the background, shows update progress inside the app, and asks the user whether to install when the update is ready.

## Как выпускать обновление

1. Поменять `version` в `package.json`, например на `1.0.1`.
2. Выполнить:

```bash
npm run dist
```

3. Создать GitHub Release в репозитории `Fixoraapp/Nexus`.
4. Указать tag:

```text
v1.0.1
```

5. Загрузить в release файлы из папки `release/`:

- `Nexus Setup 1.0.1.exe`
- `latest.yml`

6. Нажать `Publish release`.

После публикации пользователи packaged Windows app получат уведомление об обновлении Nexus.

## React + TypeScript + Vite

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
