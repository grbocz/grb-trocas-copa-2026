# Como gerar o APK Android

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Android Studio](https://developer.android.com/studio) instalado (inclui Java e Android SDK)

---

## Primeira vez

Abra o projeto no Android Studio:

```
npx cap open android
```

Aguarde a indexação terminar. Depois siga o passo abaixo.

---

## Gerar o APK

**1. No CMD, dentro da pasta do projeto:**

```
npm run build
npx cap sync android
```

**2. No Android Studio:**

```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

**3. O APK gerado fica em:**

```
android\app\build\outputs\apk\debug\app-debug.apk
```

---

## Instalar no celular

Envie o `app-debug.apk` para o celular (WhatsApp, cabo, etc.) e abra o arquivo. O Android vai pedir permissão para instalar apps de fontes desconhecidas — aceite.
