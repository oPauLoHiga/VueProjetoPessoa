<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AlertaMensagem from '@/components/ui/AlertaMensagem.vue'
import { pessoaService } from '@/services/pessoaService.js'
import { tipoAcessoService } from '@/services/tipoAcessoService.js'
import { obterMensagemErro, obterMensagensValidacao } from '@/utils/apiError.js'
import { aplicarMascaraCpf, aplicarMascaraTelefone } from '@/utils/formatters.js'

const props = defineProps({ id: String })
const router = useRouter()

const editando = computed(() => Boolean(props.id))

const hoje = new Date()
const dataMaxima = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`

const form = reactive({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  dataNascimento: '',
  endereco: '',
  cidade: '',
  estado: '',
  tipoAcessoId: '',
})

const tiposAcesso = ref([])

const erros = reactive({})
const erroGeral = ref('')
const sucesso = ref('')
const salvando = ref(false)
const carregandoDados = ref(false)

function limparErros() {
  Object.keys(erros).forEach((campo) => delete erros[campo])
  erroGeral.value = ''
  sucesso.value = ''
}

function mascararCpf() {
  form.cpf = aplicarMascaraCpf(form.cpf)
}

function mascararTelefone() {
  form.telefone = aplicarMascaraTelefone(form.telefone)
}

function validar() {
  limparErros()

  if (!form.nome.trim() || form.nome.trim().length < 2) {
    erros.nome = 'Nome deve ter pelo menos 2 caracteres.'
  }

  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.cpf)) {
    erros.cpf = 'CPF deve estar no formato 000.000.000-00.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    erros.email = 'Informe um e-mail válido.'
  }

  if (!form.dataNascimento) {
    erros.dataNascimento = 'Informe a data de nascimento.'
  } else if (form.dataNascimento >= dataMaxima) {
    erros.dataNascimento = 'A data de nascimento deve estar no passado.'
  }

  if (form.estado && form.estado.length !== 2) {
    erros.estado = 'Use a sigla do estado com 2 letras.'
  }

  return Object.keys(erros).length === 0
}

function aplicarErrosDaApi(error) {
  const mensagens = obterMensagensValidacao(error)

  if (mensagens.length) {
    const mensagensGerais = []

    mensagens.forEach((mensagem) => {
      const separador = mensagem.indexOf(':')
      const campo = separador >= 0 ? mensagem.slice(0, separador).trim() : ''
      const texto = separador >= 0 ? mensagem.slice(separador + 1).trim() : mensagem

      if (campo && Object.hasOwn(form, campo)) {
        erros[campo] = texto
      } else {
        mensagensGerais.push(mensagem)
      }
    })

    if (mensagensGerais.length) erroGeral.value = mensagensGerais.join(' ')
    return
  }

  erroGeral.value = obterMensagemErro(error, 'Erro ao salvar a pessoa.')
}

async function salvar() {
  if (!validar()) return

  salvando.value = true

  const dto = {
    ...form,
    nome: form.nome.trim(),
    email: form.email.trim(),
    estado: form.estado.trim().toUpperCase(),
    telefone: form.telefone.replace(/\D/g, '') || null,
  }
  if (!dto.tipoAcessoId) delete dto.tipoAcessoId
  else dto.tipoAcessoId = Number(dto.tipoAcessoId)

  try {
    if (editando.value) {
      await pessoaService.atualizar(props.id, dto)
      sucesso.value = 'Pessoa atualizada com sucesso!'
      setTimeout(() => router.push(`/pessoas/${props.id}`), 1200)
    } else {
      await pessoaService.cadastrar(dto)
      sucesso.value = 'Pessoa cadastrada com sucesso!'
      setTimeout(() => router.push('/pessoas'), 1200)
    }
  } catch (error) {
    aplicarErrosDaApi(error)
  } finally {
    salvando.value = false
  }
}

async function carregarPessoa() {
  carregandoDados.value = true
  erroGeral.value = ''

  try {
    const resposta = await pessoaService.buscarPorId(props.id)
    Object.assign(form, resposta.data)
    form.telefone = aplicarMascaraTelefone(form.telefone)
  } catch (error) {
    erroGeral.value = obterMensagemErro(error, 'Não foi possível carregar a pessoa.')
  } finally {
    carregandoDados.value = false
  }
}

onMounted(async () => {
  try {
    tiposAcesso.value = (await tipoAcessoService.listarAtivos()).data
  } catch (error) {
    erroGeral.value = obterMensagemErro(error, 'Não foi possível carregar os tipos de acesso.')
  }
  if (editando.value) await carregarPessoa()
})
</script>

<template>
  <div class="page-header">
    <div>
      <h1 class="page-title">{{ editando ? 'Editar pessoa' : 'Nova pessoa' }}</h1>
      <p class="page-subtitle">
        {{ editando ? 'Atualize os dados do cadastro.' : 'Preencha os campos obrigatórios para cadastrar.' }}
      </p>
    </div>
    <router-link :to="editando ? `/pessoas/${id}` : '/pessoas'" class="btn btn-ghost">
      Voltar
    </router-link>
  </div>

  <div v-if="carregandoDados" class="loading-center">
    <div class="spinner"></div>
  </div>

  <template v-else>
    <AlertaMensagem tipo="erro" :mensagem="erroGeral" @fechar="erroGeral = ''" />
    <AlertaMensagem tipo="sucesso" :mensagem="sucesso" @fechar="sucesso = ''" />

    <form class="card person-form" novalidate @submit.prevent="salvar">
      <div class="grid-2">
        <div class="form-group">
          <label for="nome" class="form-label">Nome *</label>
          <input
            id="nome"
            v-model="form.nome"
            class="form-control"
            :class="{ 'is-error': erros.nome }"
            maxlength="100"
            autocomplete="name"
          />
          <div v-if="erros.nome" class="form-error">{{ erros.nome }}</div>
        </div>

        <div class="form-group">
          <label for="cpf" class="form-label">CPF *</label>
          <input
            id="cpf"
            v-model="form.cpf"
            class="form-control"
            :class="{ 'is-error': erros.cpf }"
            maxlength="14"
            inputmode="numeric"
            placeholder="000.000.000-00"
            @input="mascararCpf"
          />
          <div v-if="erros.cpf" class="form-error">{{ erros.cpf }}</div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">E-mail *</label>
          <input
            id="email"
            v-model="form.email"
            class="form-control"
            :class="{ 'is-error': erros.email }"
            type="email"
            maxlength="150"
            autocomplete="email"
          />
          <div v-if="erros.email" class="form-error">{{ erros.email }}</div>
        </div>

        <div class="form-group">
          <label for="telefone" class="form-label">Telefone</label>
          <input
            id="telefone"
            v-model="form.telefone"
            class="form-control"
            maxlength="15"
            autocomplete="tel"
            inputmode="numeric"
            placeholder="(00) 00000-0000"
            @input="mascararTelefone"
          />
        </div>

        <div class="form-group">
          <label for="nascimento" class="form-label">Data de nascimento *</label>
          <input
            id="nascimento"
            v-model="form.dataNascimento"
            class="form-control"
            :class="{ 'is-error': erros.dataNascimento }"
            type="date"
            :max="dataMaxima"
          />
          <div v-if="erros.dataNascimento" class="form-error">{{ erros.dataNascimento }}</div>
        </div>

        <div class="form-group">
          <label for="cidade" class="form-label">Cidade</label>
          <input id="cidade" v-model="form.cidade" class="form-control" maxlength="100" />
        </div>

        <div class="form-group state-field">
          <label for="estado" class="form-label">Estado</label>
          <input
            id="estado"
            v-model="form.estado"
            class="form-control"
            :class="{ 'is-error': erros.estado }"
            maxlength="2"
            placeholder="SP"
            @input="form.estado = form.estado.toUpperCase()"
          />
          <div v-if="erros.estado" class="form-error">{{ erros.estado }}</div>
        </div>

        <div class="form-group">
          <label for="tipo-acesso" class="form-label">Tipo de acesso</label>
          <select id="tipo-acesso" v-model="form.tipoAcessoId" class="form-control">
            <option value="">Nenhum</option>
            <option v-for="tipo in tiposAcesso" :key="tipo.id" :value="tipo.id">{{ tipo.nome }}</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="endereco" class="form-label">Endereço</label>
        <textarea id="endereco" v-model="form.endereco" class="form-control" maxlength="255"></textarea>
      </div>

      <div class="form-actions">
        <router-link :to="editando ? `/pessoas/${id}` : '/pessoas'" class="btn btn-ghost">
          Cancelar
        </router-link>
        <button type="submit" class="btn btn-primary" :disabled="salvando">
          <span v-if="salvando" class="spin"></span>
          {{ salvando ? 'Salvando...' : (editando ? 'Salvar alterações' : 'Cadastrar pessoa') }}
        </button>
      </div>
    </form>
  </template>
</template>

<style scoped>
.person-form {
  max-width: 820px;
  margin: 0 auto;
}

.state-field {
  max-width: 180px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 6px;
}

@media (max-width: 520px) {
  .state-field {
    max-width: none;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
