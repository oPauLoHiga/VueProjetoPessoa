<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { pessoaService } from '@/services/pessoaService.js'
import { sugestaoService } from '@/services/sugestaoService.js'
import AlertaMensagem from '@/components/ui/AlertaMensagem.vue'
import { obterMensagemErro } from '@/utils/apiError.js'
const router=useRouter(), pessoas=ref([]), erro=ref(''), salvando=ref(false); const form=reactive({pessoaId:'',titulo:'',descricao:''})
async function salvar(){if(!form.pessoaId||form.titulo.trim().length<5||form.descricao.trim().length<10){erro.value='Preencha a pessoa, um título de ao menos 5 caracteres e uma descrição de ao menos 10.';return}salvando.value=true;try{await sugestaoService.criar({...form,pessoaId:Number(form.pessoaId)});router.push('/sugestoes')}catch(e){erro.value=obterMensagemErro(e,'Não foi possível enviar a sugestão.')}finally{salvando.value=false}}
onMounted(async()=>{try{pessoas.value=(await pessoaService.listarAtivas()).data}catch(e){erro.value=obterMensagemErro(e,'Não foi possível carregar as pessoas.')}})
</script>
<template><div class="page-header"><div><h1 class="page-title">Nova sugestão</h1><p class="page-subtitle">Envie uma sugestão vinculada a uma pessoa.</p></div><router-link to="/sugestoes" class="btn btn-ghost">Voltar</router-link></div><AlertaMensagem tipo="erro" :mensagem="erro" @fechar="erro=''"/><form class="card form" @submit.prevent="salvar"><div class="form-group"><label class="form-label">Pessoa *</label><select v-model="form.pessoaId" class="form-control"><option value="">Selecione</option><option v-for="p in pessoas" :key="p.id" :value="p.id">{{p.nome}} — {{p.cpf}}</option></select></div><div class="form-group"><label class="form-label">Título *</label><input v-model="form.titulo" class="form-control" maxlength="100"/></div><div class="form-group"><label class="form-label">Descrição *</label><textarea v-model="form.descricao" class="form-control" maxlength="1000"/></div><div class="actions"><router-link to="/sugestoes" class="btn btn-ghost">Cancelar</router-link><button class="btn btn-primary" :disabled="salvando">{{salvando?'Enviando...':'Enviar sugestão'}}</button></div></form></template><style scoped>.form{max-width:700px;margin:auto}.actions{display:flex;justify-content:flex-end;gap:10px}</style>
