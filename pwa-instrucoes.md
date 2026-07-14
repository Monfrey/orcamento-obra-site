# Como usar estes arquivos no seu projeto

Estes arquivos deixam o app instalável no celular (PWA). Veja onde cada um entra.

## 1. `manifest.json`
Coloque na pasta pública do projeto (`public/manifest.json` no Vite/CRA/Next).

No `index.html`, dentro do `<head>`, adicione:

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#2B4870">
```

## 2. `service-worker.js`
Coloque também na pasta pública (`public/service-worker.js`), para ser servido na raiz do site.

No seu arquivo de entrada (`main.jsx` ou `index.js`), registre assim:

```javascript
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((erro) => console.error("Falha ao registrar service worker:", erro));
  });
}
```

## 3. `icon-base.svg`
Este é o ícone base do app. Para gerar os PNGs que o `manifest.json` pede
(`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`), a forma mais simples é:

1. Abrir o SVG em qualquer editor (Figma, Photoshop, ou até um conversor online como o [CloudConvert](https://cloudconvert.com/svg-to-png))
2. Exportar nos tamanhos 192x192 e 512x512
3. Para a versão "maskable" (ícone que se adapta a formatos de tela dos celulares Android),
   deixe uma margem de segurança de ~20% ao redor do desenho central
4. Salvar os três arquivos em `public/icons/`

## 4. Requisito importante: HTTPS
Service workers só funcionam em conexões **HTTPS** (ou em `localhost` durante o desenvolvimento).
Isso não é um problema quando você fizer o deploy na Vercel ou Netlify — ambos já entregam HTTPS
automaticamente.

## 5. Testando a instalação
Depois do deploy:
- **Android (Chrome):** deve aparecer um banner ou opção "Adicionar à tela inicial"
- **iPhone (Safari):** abrir o site → botão de compartilhar → "Adicionar à Tela de Início"
  (o iOS não mostra o banner automático como o Android, o usuário precisa fazer isso manualmente)

## 6. Nota sobre o Supabase
O service worker já está configurado para **não** interceptar chamadas para `supabase.co`,
garantindo que dados de login e orçamentos sempre venham direto do servidor, nunca de um cache
desatualizado.
