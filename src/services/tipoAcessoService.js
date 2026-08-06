import { http } from './http.js'

export const tipoAcessoService = {
  listarTodos: () => http.get('/tipos-acesso'),
  listarAtivos: () => http.get('/tipos-acesso/ativos'),
  buscarPorId: (id) => http.get(`/tipos-acesso/${id}`),
  criar: (dto) => http.post('/tipos-acesso', dto),
  atualizar: (id, dto) => http.put(`/tipos-acesso/${id}`, dto),
  desativar: (id) => http.patch(`/tipos-acesso/${id}/desativar`),
  ativar: (id) => http.patch(`/tipos-acesso/${id}/ativar`),
  excluir: (id) => http.delete(`/tipos-acesso/${id}`),
}
