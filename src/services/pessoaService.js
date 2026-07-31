import { http } from './http.js'

export const pessoaService = {
  listarTodas: () => http.get('/pessoas'),
  listarAtivas: () => http.get('/pessoas/ativas'),
  buscarPorId: (id) => http.get(`/pessoas/${id}`),
  buscarPorCpf: (cpf) => http.get(`/pessoas/cpf/${encodeURIComponent(cpf)}`),
  buscarPorNome: (nome) => http.get('/pessoas/buscar', { params: { nome } }),
  cadastrar: (dto) => http.post('/pessoas', dto),
  atualizar: (id, dto) => http.put(`/pessoas/${id}`, dto),
  desativar: (id) => http.patch(`/pessoas/${id}/desativar`),
  ativar: (id) => http.patch(`/pessoas/${id}/ativar`),
  excluir: (id) => http.delete(`/pessoas/${id}`),
}
