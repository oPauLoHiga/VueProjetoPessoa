<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AlertaMensagem from '@/components/ui/AlertaMensagem.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { pessoaService } from '@/services/pessoaService.js'
import { obterMensagemErro } from '@/utils/apiError.js'
import { formatarData, formatarDataHora } from '@/utils/formatters.js'

const props = defineProps({ id: String })
const router = useRouter()

const pessoa = ref(null)
const carregando = ref(false)
const erro = ref('')
const mensagem = ref('')
const acao = ref('')
const modalAberto = ref(false)

async function carregar() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta = await pessoaService.buscarPorId(props.id)
    pessoa.value = resposta.data
  } catch (error) {
    erro.value = obterMensagemErro(error, 'Não foi possível carregar a pessoa.')
  } finally {
    carregando.value = false
  }
}

async function desativar() {
  acao.value = 'desativar'
  erro.value = ''
  mensagem.value = ''

  try {
    await pessoaService.desativar(props.id)
    pessoa.value.ativo = false
    mensagem.value = 'Pessoa desativada com sucesso.'
  } catch (error) {
    erro.value = obterMensagemErro(error, 'Não foi possível desativar a pessoa.')
  } finally {
    acao.value = ''
  }
}

async function ativar() {
  acao.value = 'ativar'
  erro.value = ''
  mensagem.value = ''

  try {
    await pessoaService.ativar(props.id)
    pessoa.value.ativo = true
    mensagem.value = 'Pessoa ativada com sucesso.'
  } catch (error) {
    erro.value = obterMensagemErro(error, 'Não foi possível ativar a pessoa.')
  } finally {
    acao.value = ''
  }
}

async function excluir() {
  acao.value = 'excluir'
  erro.value = ''

  try {
    await pessoaService.excluir(props.id)
    router.push('/pessoas')
  } catch (error) {
    erro.value = obterMensagemErro(error, 'Não foi possível excluir a pessoa.')
    modalAberto.value = false
  } finally {
    acao.value = ''
  }
}

onMounted(carregar)
</script>

<template>
  <div class="page-header">
    <div>
      <h1 class="page-title">Detalhes da pessoa</h1>
      <p class="page-subtitle">Informações completas e ações do cadastro.</p>
    </div>
    <div class="flex-gap">
      <router-link to="/pessoas" class="btn btn-ghost">Voltar</router-link>
      <router-link v-if="pessoa" :to="`/pessoas/${id}/editar`" class="btn btn-primary">Editar</router-link>
    </div>
  </div>

  <div v-if="carregando" class="loading-center">
    <div class="spinner"></div>
  </div>

  <AlertaMensagem
    v-else-if="erro && !pessoa"
    tipo="erro"
    :mensagem="erro"
    @fechar="erro = ''"
  />

  <template v-else-if="pessoa">
    <AlertaMensagem tipo="erro" :mensagem="erro" @fechar="erro = ''" />
    <AlertaMensagem
      tipo="sucesso"
      :mensagem="mensagem"
      :duracao="4000"
      @fechar="mensagem = ''"
    />

    <section class="profile-card">
      <div class="profile-heading">
        <div class="avatar">{{ pessoa.nome?.charAt(0).toUpperCase() }}</div>
        <div>
          <h2>{{ pessoa.nome }}</h2>
          <p>{{ pessoa.email }}</p>
        </div>
        <span class="badge profile-status" :class="pessoa.ativo ? 'badge-success' : 'badge-danger'">
          {{ pessoa.ativo ? 'Ativa' : 'Inativa' }}
        </span>
      </div>

      <div class="detail-grid">
        <div class="detail-item">
          <span>CPF</span>
          <strong>{{ pessoa.cpf }}</strong>
        </div>
        <div class="detail-item">
          <span>Telefone</span>
          <strong>{{ pessoa.telefone || '—' }}</strong>
        </div>
        <div class="detail-item">
          <span>Data de nascimento</span>
          <strong>{{ formatarData(pessoa.dataNascimento) }}</strong>
        </div>
        <div class="detail-item">
          <span>Cidade / Estado</span>
          <strong>{{ [pessoa.cidade, pessoa.estado].filter(Boolean).join(' / ') || '—' }}</strong>
        </div>
        <div class="detail-item detail-wide">
          <span>Endereço</span>
          <strong>{{ pessoa.endereco || '—' }}</strong>
        </div>
        <div class="detail-item">
          <span>Criado em</span>
          <strong>{{ formatarData(pessoa.criadoEm) }}</strong>
        </div>
        <div class="detail-item">
          <span>Atualizado em</span>
          <strong>{{ formatarDataHora(pessoa.atualizadoEm) }}</strong>
        </div>
      </div>

      <div class="profile-actions">
        <button
          v-if="pessoa.ativo"
          type="button"
          class="btn btn-warning"
          :disabled="Boolean(acao)"
          @click="desativar"
        >
          {{ acao === 'desativar' ? 'Desativando...' : 'Desativar' }}
        </button>
        <button
          v-else
          type="button"
          class="btn btn-success"
          :disabled="Boolean(acao)"
          @click="ativar"
        >
          {{ acao === 'ativar' ? 'Ativando...' : 'Ativar' }}
        </button>
        <button type="button" class="btn btn-danger" :disabled="Boolean(acao)" @click="modalAberto = true">
          Excluir
        </button>
      </div>
    </section>
  </template>

  <ConfirmModal
    :aberto="modalAberto"
    titulo="Excluir pessoa?"
    :mensagem="`O cadastro de ${pessoa?.nome || 'esta pessoa'} será excluído permanentemente. Essa ação não pode ser desfeita.`"
    texto-confirmar="Confirmar exclusão"
    :carregando="acao === 'excluir'"
    perigoso
    @cancelar="modalAberto = false"
    @confirmar="excluir"
  />
</template>

<style scoped>
.profile-card {
  overflow: hidden;
  border: 1px solid var(--gray-200);
  border-radius: 14px;
  background: #fff;
  box-shadow: var(--shadow);
}

.profile-heading {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid var(--gray-200);
  background: linear-gradient(135deg, #eef2ff, #faf5ff);
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

.profile-heading h2 {
  margin: 0 0 4px;
}

.profile-heading p {
  margin: 0;
  color: var(--gray-500);
}

.profile-status {
  margin-left: auto;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  padding: 8px 24px;
}

.detail-item {
  padding: 18px 0;
  border-bottom: 1px solid var(--gray-200);
}

.detail-item:nth-child(odd) {
  padding-right: 20px;
}

.detail-item span {
  display: block;
  margin-bottom: 5px;
  color: var(--gray-500);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.detail-item strong {
  color: var(--gray-900);
  overflow-wrap: anywhere;
}

.detail-wide {
  grid-column: 1 / -1;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px 24px;
}

@media (max-width: 600px) {
  .profile-heading {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .profile-status {
    margin-left: 0;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-wide {
    grid-column: auto;
  }

  .detail-item:nth-child(odd) {
    padding-right: 0;
  }
}
</style>
