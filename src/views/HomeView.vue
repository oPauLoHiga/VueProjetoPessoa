<script setup>
const stats = [
  {
    label: 'Listar Pessoas',
    value: 'GET',
    color: '#166534',
    bg: '#dcfce7',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  {
    label: 'Cadastrar',
    value: 'POST',
    color: '#4338ca',
    bg: '#e0e7ff',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  },
  {
    label: 'Atualizar e excluir',
    value: 'PUT / DEL',
    color: '#92400e',
    bg: '#fef3c7',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  },
]

const endpoints = [
  { method: 'GET', path: '/api/pessoas', desc: 'Listar todas as pessoas' },
  { method: 'GET', path: '/api/pessoas/ativas', desc: 'Listar apenas pessoas ativas' },
  { method: 'GET', path: '/api/pessoas/{id}', desc: 'Buscar uma pessoa por ID' },
  { method: 'GET', path: '/api/pessoas/cpf/{cpf}', desc: 'Buscar uma pessoa por CPF' },
  { method: 'GET', path: '/api/pessoas/buscar?nome=', desc: 'Buscar pessoas por nome' },
  { method: 'POST', path: '/api/pessoas', desc: 'Cadastrar uma pessoa' },
  { method: 'PUT', path: '/api/pessoas/{id}', desc: 'Atualizar uma pessoa' },
  { method: 'PATCH', path: '/api/pessoas/{id}/desativar', desc: 'Desativar uma pessoa' },
  { method: 'DELETE', path: '/api/pessoas/{id}', desc: 'Excluir uma pessoa' },
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

  <section class="home-section">
    <div class="grid-3">
      <article v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-icon" :style="{ background: stat.bg, color: stat.color }">
          <span v-html="stat.icon"></span>
        </div>
        <div>
          <strong :style="{ color: stat.color }">{{ stat.value }}</strong>
          <p>{{ stat.label }}</p>
        </div>
      </article>
    </div>
  </section>

  <section class="home-section endpoints-card">
    <div class="section-heading">
      <div>
        <h2>Mapa da API</h2>
        <p>Endpoints utilizados pelas telas desta aplicação.</p>
      </div>
      <router-link to="/buscar" class="btn btn-outline">Testar buscas</router-link>
    </div>

    <ul class="endpoint-list">
      <li v-for="endpoint in endpoints" :key="endpoint.method + endpoint.path">
        <span class="method-badge" :class="'method-' + endpoint.method.toLowerCase()">
          {{ endpoint.method }}
        </span>
        <code>{{ endpoint.path }}</code>
        <span>{{ endpoint.desc }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.hero {
  padding: clamp(36px, 8vw, 64px) 24px;
  border-radius: 18px;
  color: #fff;
  text-align: center;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  box-shadow: 0 18px 40px rgba(79, 70, 229, .2);
}

.hero-kicker {
  display: inline-block;
  margin-bottom: 12px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .16);
  font-size: 13px;
  font-weight: 700;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2rem, 6vw, 3.25rem);
  line-height: 1.1;
}

.hero p {
  max-width: 650px;
  margin: 16px auto 24px;
  color: rgba(255, 255, 255, .84);
  font-size: 17px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.hero-btn-light {
  color: var(--primary-dark);
  background: #fff;
}

.hero-btn-outline {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, .65);
  background: transparent;
}

.home-section {
  margin-top: 28px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  background: #fff;
  box-shadow: var(--shadow);
}

.stat-icon {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 10px;
}

.stat-icon :deep(svg) {
  display: block;
}

.stat-card strong {
  font-size: 17px;
}

.stat-card p {
  margin: 3px 0 0;
  color: var(--gray-500);
  font-size: 14px;
}

.endpoints-card {
  padding: 24px;
  border: 1px solid var(--gray-200);
  border-radius: 14px;
  background: #fff;
  box-shadow: var(--shadow);
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-heading h2 {
  margin: 0 0 4px;
}

.section-heading p {
  margin: 0;
  color: var(--gray-500);
}

.endpoint-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.endpoint-list li {
  display: grid;
  grid-template-columns: 70px minmax(190px, 1fr) 1.4fr;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-top: 1px solid var(--gray-200);
}

.endpoint-list code {
  color: var(--gray-900);
  font-size: 13px;
}

.endpoint-list li > span:last-child {
  color: var(--gray-500);
  font-size: 14px;
}

.method-badge {
  justify-self: start;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
}

.method-get { color: #166534; background: var(--success-light); }
.method-post { color: #4338ca; background: var(--primary-light); }
.method-put,
.method-patch { color: #92400e; background: var(--warning-light); }
.method-delete { color: #991b1b; background: var(--danger-light); }

@media (max-width: 700px) {
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .endpoint-list li {
    grid-template-columns: 70px 1fr;
  }

  .endpoint-list li > span:last-child {
    grid-column: 1 / -1;
  }
}
</style>
