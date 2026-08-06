<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AlertaMensagem from '@/components/ui/AlertaMensagem.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { pessoaService } from '@/services/pessoaService.js'
import { obterMensagemErro } from '@/utils/apiError.js'
import { aplicarMascaraTelefone } from '@/utils/formatters.js'

const route = useRoute()

const pessoas = ref([])
const carregando = ref(false)
const erro = ref('')
const aviso = ref('')
const filtro = ref('')
const apenasAtivas = ref(false)
const modalExclusao = ref(null)
const excluindo = ref(false)
const processandoId = ref(null)

const pessoasFiltradas = computed(() => {
  const termo = filtro.value.trim().toLowerCase()
  if (!termo) return pessoas.value

  return pessoas.value.filter((pessoa) =>
    String(pessoa.id ?? '').includes(termo)
    || pessoa.nome?.toLowerCase().includes(termo)
    || pessoa.cpf?.includes(termo)
    || pessoa.email?.toLowerCase().includes(termo),
  )
})

async function carregar() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta = apenasAtivas.value
      ? await pessoaService.listarAtivas()
      : await pessoaService.listarTodas()
    pessoas.value = resposta.data
  } catch (error) {
    const mensagem = error.response?.data?.message || ''
    if (error.response?.status === 400 && mensagem.toLowerCase().includes('pessoas')) {
      pessoas.value = []
    } else {
      erro.value = obterMensagemErro(error, 'Não foi possível carregar as pessoas.')
    }
  } finally {
    carregando.value = false
  }
}

async function alternarLista(somenteAtivas) {
  apenasAtivas.value = somenteAtivas
  aviso.value = ''
  await carregar()
}

async function desativar(pessoa) {
  processandoId.value = pessoa.id
  erro.value = ''
  aviso.value = ''

  try {
    await pessoaService.desativar(pessoa.id)
    aviso.value = `${pessoa.nome} foi desativado(a).`
    await carregar()
  } catch (error) {
    erro.value = obterMensagemErro(error, 'Não foi possível desativar a pessoa.')
  } finally {
    processandoId.value = null
  }
}

async function ativar(pessoa) {
  processandoId.value = pessoa.id
  erro.value = ''
  aviso.value = ''

  try {
    await pessoaService.ativar(pessoa.id)
    aviso.value = `${pessoa.nome} foi ativado(a).`
    await carregar()
  } catch (error) {
    erro.value = obterMensagemErro(error, 'Não foi possível ativar a pessoa.')
  } finally {
    processandoId.value = null
  }
}

function confirmarExclusao(pessoa) {
  modalExclusao.value = pessoa
  erro.value = ''
}

async function excluir() {
  if (!modalExclusao.value) return

  excluindo.value = true
  erro.value = ''

  try {
    const nome = modalExclusao.value.nome
    await pessoaService.excluir(modalExclusao.value.id)
    modalExclusao.value = null
    aviso.value = `${nome} foi excluído(a) permanentemente.`
    await carregar()
  } catch (error) {
    erro.value = obterMensagemErro(error, 'Não foi possível excluir a pessoa.')
  } finally {
    excluindo.value = false
  }
}

onMounted(() => {
  apenasAtivas.value = route.query.ativas === 'true'
  carregar()
})
</script>

<template>
  <div class="page-header">
    <div>
      <h1 class="page-title">Pessoas cadastradas</h1>
      <p class="page-subtitle">Consulte, filtre e administre os cadastros.</p>
    </div>
    <div class="header-actions">
      <router-link to="/pessoas/nova" class="btn btn-primary">+ Nova pessoa</router-link>
    </div>
  </div>

  <AlertaMensagem tipo="erro" :mensagem="erro" @fechar="erro = ''" />
  <AlertaMensagem tipo="sucesso" :mensagem="aviso" :duracao="4000" @fechar="aviso = ''" />

  <section class="list-toolbar">
    <input
      v-model="filtro"
      class="form-control search-input"
      type="search"
      placeholder="Buscar por ID, nome, CPF ou e-mail..."
      aria-label="Buscar pessoas na lista"
    />

    <span class="total-badge">{{ pessoasFiltradas.length }} resultado(s)</span>

    <div class="view-toggle">
      <button
        type="button"
        class="btn btn-sm"
        :class="apenasAtivas ? 'btn-ghost' : 'btn-primary'"
        :disabled="carregando"
        @click="alternarLista(false)"
      >
        Todas
      </button>
      <button
        type="button"
        class="btn btn-sm"
        :class="apenasAtivas ? 'btn-primary' : 'btn-ghost'"
        :disabled="carregando"
        @click="alternarLista(true)"
      >
        Somente ativas
      </button>
    </div>
  </section>

  <div v-if="carregando" class="loading-center" aria-label="Carregando pessoas">
    <div class="spinner"></div>
  </div>

  <div v-else-if="!pessoasFiltradas.length" class="card empty-state">
    <h2>Nenhuma pessoa encontrada</h2>
    <p>{{ filtro ? 'Tente alterar o texto do filtro.' : 'Cadastre a primeira pessoa para começar.' }}</p>
    <router-link v-if="!filtro" to="/pessoas/nova" class="btn btn-primary">Cadastrar pessoa</router-link>
  </div>

  <div v-else class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Contato</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pessoa in pessoasFiltradas" :key="pessoa.id">
          <td><strong>{{ pessoa.nome }}</strong></td>
          <td>{{ pessoa.cpf }}</td>
          <td>
            <span>{{ pessoa.email }}</span>
            <small>{{ pessoa.telefone ? aplicarMascaraTelefone(pessoa.telefone) : 'Sem telefone' }}</small>
          </td>
          <td>
            <span class="badge" :class="pessoa.ativo ? 'badge-success' : 'badge-danger'">
              {{ pessoa.ativo ? 'Ativa' : 'Inativa' }}
            </span>
          </td>
          <td>
            <div class="flex-gap action-buttons">
              <router-link :to="`/pessoas/${pessoa.id}`" class="btn btn-ghost btn-sm">Ver</router-link>
              <router-link :to="`/pessoas/${pessoa.id}/editar`" class="btn btn-outline btn-sm">Editar</router-link>
              <button
                v-if="pessoa.ativo"
                type="button"
                class="btn btn-warning btn-sm"
                :disabled="processandoId === pessoa.id"
                @click="desativar(pessoa)"
              >
                {{ processandoId === pessoa.id ? 'Desativando...' : 'Desativar' }}
              </button>
              <button
                v-else
                type="button"
                class="btn btn-success btn-sm"
                :disabled="processandoId === pessoa.id"
                @click="ativar(pessoa)"
              >
                {{ processandoId === pessoa.id ? 'Ativando...' : 'Ativar' }}
              </button>
              <button type="button" class="btn btn-danger btn-sm" @click="confirmarExclusao(pessoa)">
                Excluir
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ConfirmModal
    :aberto="Boolean(modalExclusao)"
    titulo="Excluir pessoa?"
    :mensagem="modalExclusao ? `O cadastro de ${modalExclusao.nome} será removido permanentemente.` : ''"
    texto-confirmar="Excluir permanentemente"
    :carregando="excluindo"
    perigoso
    @cancelar="modalExclusao = null"
    @confirmar="excluir"
  />
</template>

<style scoped>
.list-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
}

.view-toggle {
  display: flex;
  gap: 6px;
}

td small {
  display: block;
  margin-top: 3px;
  color: var(--gray-500);
}

.action-buttons {
  min-width: 285px;
}

.empty-state h2 {
  margin: 0 0 8px;
  color: var(--gray-900);
}

.empty-state p {
  margin: 0 0 18px;
}

@media (max-width: 720px) {
  .list-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .view-toggle .btn {
    flex: 1;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
  }
}
</style>
