<script setup>
import { ref } from 'vue'

const menuAberto = ref(false)
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-inner">
        <router-link to="/" class="nav-brand" @click="menuAberto = false">
          Cadastro Pessoas
        </router-link>

        <button
          type="button"
          class="nav-toggle"
          :aria-expanded="menuAberto"
          aria-label="Abrir ou fechar menu"
          @click="menuAberto = !menuAberto"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul class="nav-links" :class="{ 'is-open': menuAberto }">
          <li><router-link to="/" @click="menuAberto = false">Início</router-link></li>
          <li><router-link to="/pessoas" @click="menuAberto = false">Listar Pessoas</router-link></li>
          <li><router-link to="/tipos-acesso" @click="menuAberto = false">Tipos de Acesso</router-link></li>
          <li><router-link to="/sugestoes" @click="menuAberto = false">Sugestões</router-link></li>
          <li><router-link to="/mapa-api" @click="menuAberto = false">Mapa da API</router-link></li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, .96);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}

.nav-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 32px;
  max-width: 1100px;
  height: 60px;
  margin: 0 auto;
  padding: 0 24px;
}

.nav-brand {
  color: var(--gray-900);
  font-size: 18px;
  font-weight: 800;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 0 auto;
  padding: 0;
  list-style: none;
}

.nav-links a {
  display: block;
  padding: 8px 11px;
  border-radius: 7px;
  color: var(--gray-700);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--primary);
  background: var(--primary-light);
}

.nav-toggle {
  display: none;
  margin-left: auto;
  padding: 8px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.nav-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  border-radius: 2px;
  background: var(--gray-700);
}

@media (max-width: 640px) {
  .nav-inner {
    padding: 0 16px;
  }

  .nav-toggle {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .nav-links {
    position: absolute;
    top: 60px;
    right: 0;
    left: 0;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 12px 16px 16px;
    background: #fff;
    box-shadow: var(--shadow);
  }

  .nav-links.is-open {
    display: flex;
  }
}
</style>
