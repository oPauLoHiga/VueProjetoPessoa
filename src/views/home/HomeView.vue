<script setup>
const stats = [
  { label: 'Consultar dados', value: 'GET', color: '#166534', bg: '#dcfce7' },
  { label: 'Criar registros', value: 'POST', color: '#4338ca', bg: '#e0e7ff' },
  { label: 'Alterar ou excluir', value: 'PUT / DELETE', color: '#92400e', bg: '#fef3c7' },
]
</script>

<template>
  <section class="hero">
    <span class="hero-kicker">Vue.js + Spring Boot</span>
    <h1>Cadastro de Pessoas</h1>
    <p>Interface completa para cadastrar, consultar, atualizar e administrar pessoas.</p>
    <div class="hero-actions">
      <router-link to="/pessoas" class="btn hero-btn-light">Ver pessoas</router-link>
      <router-link to="/pessoas/nova" class="btn hero-btn-outline">Nova pessoa</router-link>
    </div>
  </section>

  <section class="home-section"><div class="grid-3"><article v-for="stat in stats" :key="stat.label" class="stat-card"><div class="stat-icon" :style="{ background: stat.bg, color: stat.color }">{{ stat.value }}</div><div><p>{{ stat.label }}</p></div></article></div></section>

  <section class="api-callout"><div><h2>Mapa da API</h2><p>Consulte todos os endpoints, organizados por método.</p></div><router-link to="/mapa-api" class="btn btn-primary">Abrir mapa da API</router-link></section>
</template>

<style scoped>
.hero{padding:clamp(36px,8vw,64px) 24px;border-radius:18px;color:#fff;text-align:center;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);box-shadow:0 18px 40px rgba(79,70,229,.2)}.hero-kicker{display:inline-block;margin-bottom:12px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.16);font-size:13px;font-weight:700}.hero h1{margin:0;font-size:clamp(2rem,6vw,3.25rem);line-height:1.1}.hero p{max-width:650px;margin:16px auto 24px;color:rgba(255,255,255,.84);font-size:17px}.hero-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}.hero-btn-light{color:var(--primary-dark);background:#fff}.hero-btn-outline{color:#fff;border:1px solid rgba(255,255,255,.65);background:transparent}.home-section{margin-top:28px}.stat-card{display:flex;align-items:center;gap:16px;padding:20px;border:1px solid var(--gray-200);border-radius:12px;background:#fff;box-shadow:var(--shadow)}.stat-icon{display:grid;place-items:center;flex:0 0 auto;min-width:86px;height:42px;padding:0 10px;border-radius:10px;font-size:12px;font-weight:800}.stat-card p{margin:0;color:var(--gray-700);font-size:15px;font-weight:600}.api-callout{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:28px;padding:24px;border:1px solid var(--gray-200);border-radius:14px;background:#fff;box-shadow:var(--shadow)}.api-callout h2{margin:0 0 4px}.api-callout p{margin:0;color:var(--gray-500)}@media(max-width:640px){.api-callout{align-items:flex-start;flex-direction:column}}
</style>
