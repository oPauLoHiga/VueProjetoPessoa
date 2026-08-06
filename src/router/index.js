import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import BuscarView from '@/views/pessoas/BuscarView.vue'
import CadastroView from '@/views/pessoas/CadastroView.vue'
import DetalheView from '@/views/pessoas/DetalheView.vue'
import ListaView from '@/views/pessoas/ListaView.vue'
import TiposAcessoView from '@/views/tipos-acesso/TiposAcessoView.vue'
import TipoAcessoFormView from '@/views/tipos-acesso/TipoAcessoFormView.vue'
import SugestoesView from '@/views/sugestoes/SugestoesView.vue'
import SugestaoFormView from '@/views/sugestoes/SugestaoFormView.vue'
import MapaApiView from '@/views/mapa-endpoints/MapaApiView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/pessoas', component: ListaView },
  { path: '/pessoas/nova', component: CadastroView },
  { path: '/pessoas/:id/editar', component: CadastroView, props: true },
  { path: '/pessoas/:id', component: DetalheView, props: true },
  { path: '/buscar', component: BuscarView },
  { path: '/tipos-acesso', component: TiposAcessoView },
  { path: '/tipos-acesso/novo', component: TipoAcessoFormView },
  { path: '/tipos-acesso/:id/editar', component: TipoAcessoFormView, props: true },
  { path: '/sugestoes', component: SugestoesView },
  { path: '/sugestoes/nova', component: SugestaoFormView },
  { path: '/mapa-api', component: MapaApiView },
  { path: '/:pathMatch(.*)*', component: NotFoundView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
