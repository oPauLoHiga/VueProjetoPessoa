<script setup>
import { onMounted, ref } from 'vue'
import { tipoAcessoService } from '@/services/tipoAcessoService.js'
import AlertaMensagem from '@/components/ui/AlertaMensagem.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { obterMensagemErro } from '@/utils/apiError.js'
const tipos = ref([]); const erro = ref(''); const carregando = ref(false); const excluirId = ref(null); const acao = ref('')
async function carregar() { carregando.value=true; try { tipos.value=(await tipoAcessoService.listarTodos()).data } catch(e) { erro.value=obterMensagemErro(e,'Não foi possível carregar os tipos.') } finally { carregando.value=false } }
async function desativar(id) { acao.value=`d${id}`; try { await tipoAcessoService.desativar(id); await carregar() } catch(e) { erro.value=obterMensagemErro(e,'Não foi possível desativar o tipo.') } finally { acao.value='' } }
async function ativar(id) { acao.value=`a${id}`; try { await tipoAcessoService.ativar(id); await carregar() } catch(e) { erro.value=obterMensagemErro(e,'Não foi possível ativar o tipo.') } finally { acao.value='' } }
async function excluir() { acao.value='excluir'; try { await tipoAcessoService.excluir(excluirId.value); excluirId.value=null; await carregar() } catch(e) { erro.value=obterMensagemErro(e,'Não foi possível excluir o tipo.'); excluirId.value=null } finally { acao.value='' } }
onMounted(carregar)
</script>
<template>
  <div class="page-header"><div><h1 class="page-title">Tipos de acesso</h1><p class="page-subtitle">Gerencie os perfis disponíveis para pessoas.</p></div><router-link to="/tipos-acesso/novo" class="btn btn-primary">Novo tipo</router-link></div>
  <AlertaMensagem tipo="erro" :mensagem="erro" @fechar="erro=''" />
  <div v-if="carregando" class="loading-center"><div class="spinner" /></div>
  <div v-else-if="!tipos.length" class="empty-state">Nenhum tipo de acesso cadastrado.</div>
  <div v-else class="table-wrap"><table><thead><tr><th>Nome</th><th>Descrição</th><th>Status</th><th>Pessoas</th><th></th></tr></thead><tbody><tr v-for="tipo in tipos" :key="tipo.id"><td><strong>{{ tipo.nome }}</strong></td><td>{{ tipo.descricao || '—' }}</td><td><span class="badge" :class="tipo.ativo ? 'badge-success' : 'badge-danger'">{{ tipo.ativo ? 'Ativo' : 'Inativo' }}</span></td><td>{{ tipo.totalPessoas }}</td><td class="actions"><router-link :to="`/tipos-acesso/${tipo.id}/editar`" class="btn btn-outline btn-sm">Editar</router-link><button v-if="tipo.ativo" class="btn btn-warning btn-sm" :disabled="Boolean(acao)" @click="desativar(tipo.id)">Desativar</button><button v-else class="btn btn-success btn-sm" :disabled="Boolean(acao)" @click="ativar(tipo.id)">Ativar</button><button class="btn btn-danger btn-sm" :disabled="Boolean(acao)" @click="excluirId=tipo.id">Excluir</button></td></tr></tbody></table></div>
  <ConfirmModal :aberto="excluirId!==null" titulo="Excluir tipo de acesso?" mensagem="Esta ação não pode ser desfeita." texto-confirmar="Excluir" :carregando="acao==='excluir'" perigoso @cancelar="excluirId=null" @confirmar="excluir" />
</template>
<style scoped>.actions{display:flex;gap:6px;justify-content:flex-end}</style>
