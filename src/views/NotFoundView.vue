<template>
  <section class="not-found">
    <span>404</span>
    <h1>Página não encontrada</h1>
    <p>O endereço informado não existe ou foi movido.</p>
    <div class="flex-gap not-found-actions">
      <router-link to="/" class="btn btn-primary">Voltar ao início</router-link>
      <router-link to="/pessoas" class="btn btn-ghost">Ver pessoas</router-link>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 62vh;
  padding: 40px 20px;
  text-align: center;
}

.not-found > span {
  color: var(--primary);
  font-size: clamp(4rem, 16vw, 8rem);
  font-weight: 900;
  line-height: .9;
  opacity: .16;
}

.not-found h1 {
  margin: 20px 0 8px;
  color: var(--gray-900);
  font-size: clamp(1.8rem, 5vw, 2.5rem);
}

.not-found p {
  margin: 0 0 24px;
  color: var(--gray-500);
}

.not-found-actions {
  justify-content: center;
}
</style>
