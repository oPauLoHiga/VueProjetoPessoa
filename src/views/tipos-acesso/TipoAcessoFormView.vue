<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { tipoAcessoService } from '@/services/tipoAcessoService.js'
import AlertaMensagem from '@/components/ui/AlertaMensagem.vue'
import { obterMensagemErro } from '@/utils/apiError.js'
const props=defineProps({id:String}); const router=useRouter(); const editando=computed(()=>Boolean(props.id)); const form=reactive({nome:'',descricao:''}); const erro=ref(''); const salvando=ref(false); const carregando=ref(false)
async function salvar(){ if(!form.nome.trim()){erro.value='Informe o nome do tipo.';return} salvando.value=true; try { if(editando.value) await tipoAcessoService.atualizar(props.id,form); else await tipoAcessoService.criar(form); router.push('/tipos-acesso') } catch(e){erro.value=obterMensagemErro(e,'Não foi possível salvar o tipo.')} finally{salvando.value=false} }
onMounted(async()=>{if(!editando.value)return; carregando.value=true;try{Object.assign(form,(await tipoAcessoService.buscarPorId(props.id)).data)}catch(e){erro.value=obterMensagemErro(e,'Não foi possível carregar o tipo.')}finally{carregando.value=false}})
</script>
<template><div class="page-header"><div><h1 class="page-title">{{editando?'Editar tipo de acesso':'Novo tipo de acesso'}}</h1></div><router-link to="/tipos-acesso" class="btn btn-ghost">Voltar</router-link></div><AlertaMensagem tipo="erro" :mensagem="erro" @fechar="erro=''"/><div v-if="carregando" class="loading-center"><div class="spinner"/></div><form v-else class="card form" @submit.prevent="salvar"><div class="form-group"><label class="form-label">Nome *</label><input v-model="form.nome" class="form-control" maxlength="100"/></div><div class="form-group"><label class="form-label">Descrição</label><textarea v-model="form.descricao" class="form-control" maxlength="255"/></div><div class="actions"><router-link to="/tipos-acesso" class="btn btn-ghost">Cancelar</router-link><button class="btn btn-primary" :disabled="salvando">{{salvando?'Salvando...':'Salvar'}}</button></div></form></template><style scoped>.form{max-width:650px;margin:auto}.actions{display:flex;justify-content:flex-end;gap:10px}</style>
