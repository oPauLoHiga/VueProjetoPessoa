<script setup>
import { computed, ref } from 'vue'

const filtros = ['Todos', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const filtro = ref('Todos')
const endpoints = [
  { method: 'GET', path: '/api/pessoas', desc: 'Listar todas as pessoas' },
  { method: 'GET', path: '/api/pessoas/ativas', desc: 'Listar pessoas ativas' },
  { method: 'GET', path: '/api/pessoas/{id}', desc: 'Buscar uma pessoa por ID' },
  { method: 'GET', path: '/api/pessoas/cpf/{cpf}', desc: 'Buscar uma pessoa por CPF' },
  { method: 'GET', path: '/api/pessoas/buscar?nome=', desc: 'Buscar pessoas por nome' },
  { method: 'POST', path: '/api/pessoas', desc: 'Cadastrar uma pessoa' },
  { method: 'PUT', path: '/api/pessoas/{id}', desc: 'Atualizar uma pessoa' },
  { method: 'PATCH', path: '/api/pessoas/{id}/desativar', desc: 'Desativar uma pessoa' },
  { method: 'PATCH', path: '/api/pessoas/{id}/ativar', desc: 'Ativar uma pessoa' },
  { method: 'DELETE', path: '/api/pessoas/{id}', desc: 'Excluir uma pessoa' },
  { method: 'GET', path: '/api/tipos-acesso', desc: 'Listar todos os tipos de acesso' },
  { method: 'GET', path: '/api/tipos-acesso/ativos', desc: 'Listar tipos ativos' },
  { method: 'GET', path: '/api/tipos-acesso/{id}', desc: 'Buscar um tipo de acesso' },
  { method: 'POST', path: '/api/tipos-acesso', desc: 'Criar um tipo de acesso' },
  { method: 'PUT', path: '/api/tipos-acesso/{id}', desc: 'Atualizar um tipo de acesso' },
  { method: 'PATCH', path: '/api/tipos-acesso/{id}/desativar', desc: 'Desativar um tipo de acesso' },
  { method: 'DELETE', path: '/api/tipos-acesso/{id}', desc: 'Excluir um tipo de acesso' },
  { method: 'GET', path: '/api/sugestoes', desc: 'Listar todas as sugestões' },
  { method: 'GET', path: '/api/sugestoes/por-status?status=', desc: 'Filtrar sugestões por status' },
  { method: 'GET', path: '/api/sugestoes/pessoa/{pessoaId}', desc: 'Listar sugestões de uma pessoa' },
  { method: 'GET', path: '/api/sugestoes/{id}', desc: 'Buscar uma sugestão' },
  { method: 'POST', path: '/api/sugestoes', desc: 'Criar uma sugestão' },
  { method: 'PATCH', path: '/api/sugestoes/{id}/status?novoStatus=', desc: 'Alterar o status de uma sugestão' },
  { method: 'DELETE', path: '/api/sugestoes/{id}', desc: 'Excluir uma sugestão' },
]
const visiveis = computed(() => filtro.value === 'Todos' ? endpoints : endpoints.filter((item) => item.method === filtro.value))
</script>

<template>
  <div class="page-header"><div><h1 class="page-title">Mapa da API</h1><p class="page-subtitle">Todos os endpoints disponíveis, organizados por método.</p></div></div>
  <div class="filters"><button v-for="item in filtros" :key="item" class="btn btn-sm" :class="filtro===item?'btn-primary':'btn-ghost'" @click="filtro=item">{{item}}</button></div>
  <div class="table-wrap"><table><thead><tr><th>Método</th><th>Endpoint</th><th>Descrição</th></tr></thead><tbody><tr v-for="endpoint in visiveis" :key="endpoint.method+endpoint.path"><td><span class="method" :class="'method-'+endpoint.method.toLowerCase()">{{endpoint.method}}</span></td><td><code>{{endpoint.path}}</code></td><td>{{endpoint.desc}}</td></tr></tbody></table></div>
</template>

<style scoped>
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.method{padding:4px 8px;border-radius:6px;font-size:11px;font-weight:800}.method-get{color:#166534;background:var(--success-light)}.method-post{color:#4338ca;background:var(--primary-light)}.method-put,.method-patch{color:#92400e;background:var(--warning-light)}.method-delete{color:#991b1b;background:var(--danger-light)}code{font-size:13px;color:var(--gray-900)}
</style>
