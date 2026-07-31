import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import BuscarView from '@/views/pessoas/BuscarView.vue'
import CadastroView from '@/views/pessoas/CadastroView.vue'
import DetalheView from '@/views/pessoas/DetalheView.vue'
import ListaView from '@/views/pessoas/ListaView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/pessoas', component: ListaView },
  { path: '/pessoas/nova', component: CadastroView },
  { path: '/pessoas/:id/editar', component: CadastroView, props: true },
  { path: '/pessoas/:id', component: DetalheView, props: true },
  { path: '/buscar', component: BuscarView },
  { path: '/:pathMatch(.*)*', component: NotFoundView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
