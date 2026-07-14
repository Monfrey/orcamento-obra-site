const CACHE_NAME = "orcamento-obra-v1";

// Liste aqui os arquivos essenciais gerados pelo seu build
// (ajuste os caminhos conforme a pasta "dist"/"build" do seu projeto)
const ARQUIVOS_ESSENCIAIS = [
  "/",
  "/index.html",
  "/manifest.json",
];

// Instala o service worker e guarda os arquivos essenciais em cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_ESSENCIAIS))
  );
  self.skipWaiting();
});

// Remove caches antigos quando uma nova versão é publicada
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NAME)
          .map((nome) => caches.delete(nome))
      )
    )
  );
  self.clients.claim();
});

// Estratégia: tenta a rede primeiro (dados sempre atualizados);
// se estiver offline, usa o que tiver em cache
self.addEventListener("fetch", (event) => {
  // Não intercepta chamadas à API do Supabase — essas sempre vão direto pra rede
  if (event.request.url.includes("supabase.co")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        return resposta;
      })
      .catch(() => caches.match(event.request))
  );
});
