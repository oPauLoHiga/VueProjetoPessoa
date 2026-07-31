<script setup>
import { ref } from 'vue'
import AlertaMensagem from '@/components/ui/AlertaMensagem.vue'
import { pessoaService } from '@/services/pessoaService.js'
import { obterMensagemErro } from '@/utils/apiError.js'
import { aplicarMascaraCpf } from '@/utils/formatters.js'

const modo = ref('nome')
const query = ref('')
const resultado = ref(null)
const carregando = ref(false)
const erro = ref('')

function trocarModo(novoModo) {
  modo.value = novoModo
  limpar()
}

function mascararCpf() {
  query.value = aplicarMascaraCpf(query.value)
}

async function buscar() {
  if (!query.value) return

  carregando.value = true
  erro.value = ''
  resultado.value = null

  try {
    let resposta

    if (modo.value === 'nome') {
      resposta = await pessoaService.buscarPorNome(query.value.trim())
    } else if (modo.value === 'cpf') {
      resposta = await pessoaService.buscarPorCpf(query.value)
    } else {
      resposta = await pessoaService.buscarPorId(query.value)
    }

    resultado.value = resposta.data
  } catch (error) {
    erro.value = error.response?.status === 404
      ? 'Nenhuma pessoa encontrada com este critério.'
      : obterMensagemErro(error, 'Não foi possível realizar a busca.')
  } finally {
    carregando.value = false
  }
}

function limpar() {
  query.value = ''
  resultado.value = null
  erro.value = ''
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1 class="page-title">Busca avançada</h1>
      <p class="page-subtitle">Encontre pessoas por nome, CPF ou identificador.</p>
    </div>
  </div>

  <section class="card search-card">
    <div class="tabs" role="tablist" aria-label="Tipo de busca">
      <button
        type="button"
        class="tab"
        :class="{ active: modo === 'nome' }"
        @click="trocarModo('nome')"
      >
        Por nome
      </button>
      <button
        type="button"
        class="tab"
        :class="{ active: modo === 'cpf' }"
        @click="trocarModo('cpf')"
      >
        Por CPF
      </button>
      <button
        type="button"
        class="tab"
        :class="{ active: modo === 'id' }"
        @click="trocarModo('id')"
      >
        Por ID
      </button>
    </div>

    <form class="search-form" @submit.prevent="buscar">
      <div class="search-field">
        <label for="busca" class="form-label">
          {{ modo === 'nome' ? 'Nome' : modo === 'cpf' ? 'CPF' : 'ID' }}
        </label>

        <input
          v-if="modo === 'nome'"
          id="busca"
          v-model="query"
          class="form-control"
          placeholder="Ex.: João Silva"
          autofocus
        />

        <input
          v-else-if="modo === 'cpf'"
          id="busca"
          v-model="query"
          class="form-control"
          placeholder="000.000.000-00"
          maxlength="14"
          inputmode="numeric"
          @input="mascararCpf"
        />

        <input
          v-else
          id="busca"
          v-model="query"
          class="form-control"
          type="number"
          min="1"
          placeholder="ID numérico"
        />
      </div>

      <div class="search-actions">
        <button v-if="query || resultado || erro" type="button" class="btn btn-ghost" @click="limpar">
          Limpar
        </button>
        <button type="submit" class="btn btn-primary" :disabled="!query || carregando">
          <span v-if="carregando" class="spin"></span>
          {{ carregando ? 'Buscando...' : 'Buscar' }}
        </button>
      </div>
    </form>
  </section>

  <div v-if="carregando" class="loading-center">
    <div class="spinner"></div>
  </div>

  <AlertaMensagem
    v-else-if="erro"
    class="result-space"
    tipo="erro"
    :mensagem="erro"
    @fechar="erro = ''"
  />

  <section
    v-else-if="resultado && !Array.isArray(resultado)"
    class="card person-result result-space"
  >
    <div class="avatar">{{ resultado.nome?.charAt(0).toUpperCase() }}</div>
    <div class="result-main">
      <div class="result-title">
        <div>
          <h2>{{ resultado.nome }}</h2>
          <p>{{ resultado.email }}</p>
        </div>
        <span class="badge" :class="resultado.ativo ? 'badge-success' : 'badge-danger'">
          {{ resultado.ativo ? 'Ativa' : 'Inativa' }}
        </span>
      </div>
      <div class="result-details">
        <span><strong>CPF:</strong> {{ resultado.cpf }}</span>
        <span><strong>Telefone:</strong> {{ resultado.telefone || '—' }}</span>
        <span><strong>Cidade:</strong> {{ resultado.cidade || '—' }}</span>
      </div>
      <router-link :to="`/pessoas/${resultado.id}`" class="btn btn-outline btn-sm">
        Ver cadastro completo
      </router-link>
    </div>
  </section>

  <section v-else-if="Array.isArray(resultado)" class="result-space">
    <div v-if="!resultado.length" class="card empty-state">
      Nenhuma pessoa encontrada com esse nome.
    </div>

    <template v-else>
      <div class="result-summary">
        <h2>Resultados</h2>
        <span class="total-badge">{{ resultado.length }} pessoa(s)</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>E-mail</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pessoa in resultado" :key="pessoa.id">
              <td><strong>{{ pessoa.nome }}</strong></td>
              <td>{{ pessoa.cpf }}</td>
              <td>{{ pessoa.email }}</td>
              <td>
                <span class="badge" :class="pessoa.ativo ? 'badge-success' : 'badge-danger'">
                  {{ pessoa.ativo ? 'Ativa' : 'Inativa' }}
                </span>
              </td>
              <td>
                <router-link :to="`/pessoas/${pessoa.id}`" class="btn btn-ghost btn-sm">Ver</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>

<style scoped>
.search-card {
  max-width: 760px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 22px;
  padding: 5px;
  border-radius: 10px;
  background: var(--gray-100);
}

.tab {
  flex: 1;
  padding: 9px 12px;
  border: 0;
  border-radius: 7px;
  color: var(--gray-700);
  background: transparent;
  font-weight: 600;
  cursor: pointer;
}

.tab.active {
  color: var(--primary);
  background: #fff;
  box-shadow: var(--shadow);
}

.tab:hover:not(.active) {
  background: rgba(255, 255, 255, .55);
}

.search-form {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.search-field {
  flex: 1;
}

.search-actions {
  display: flex;
  gap: 8px;
}

.result-space {
  margin-top: 24px;
}

.person-result {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  max-width: 760px;
  margin-right: auto;
  margin-left: auto;
}

.avatar {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: #fff;
  background: var(--primary);
  font-size: 26px;
  font-weight: 800;
}

.result-main {
  flex: 1;
  min-width: 0;
}

.result-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.result-title h2 {
  margin: 0 0 4px;
}

.result-title p {
  margin: 0;
  color: var(--gray-500);
}

.result-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin: 18px 0;
  color: var(--gray-700);
  font-size: 14px;
}

.result-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.result-summary h2 {
  margin: 0;
}

@media (max-width: 600px) {
  .search-form,
  .person-result {
    align-items: stretch;
    flex-direction: column;
  }

  .search-actions .btn {
    flex: 1;
  }

  .person-result .avatar {
    width: 52px;
    height: 52px;
  }
}
</style>
