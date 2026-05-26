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

## Gerar APK assinado (para distribuição)

O APK de debug funciona, mas o assinado é mais confiável — o Android não mostra aviso de "app não verificado" na instalação.

**No Android Studio:**

```
Build → Generate Signed Bundle / APK...
```

1. Escolha **APK** e clique Next
2. Em **Key store path**, clique **Create new...**
   - Escolha onde salvar o arquivo `.jks` (guarde em lugar seguro)
   - Defina uma senha para o keystore e outra para a key
   - Em **Alias** coloque um nome qualquer (ex: `trocas-copa`)
   - Preencha pelo menos o campo **First and Last Name**
   - Clique OK
3. De volta na tela anterior, preencha as senhas e clique Next
4. Escolha **release** e clique **Create**

O APK assinado fica em:

```
android\app\release\app-release.apk
```

> **Importante:** guarde o arquivo `.jks` e as senhas em lugar seguro. Se perder, não será possível gerar atualizações assinadas com a mesma identidade.

---

## Instalar no celular

Envie o APK para o celular (WhatsApp, cabo, etc.) e abra o arquivo. O Android vai pedir permissão para instalar apps de fontes desconhecidas — aceite.
