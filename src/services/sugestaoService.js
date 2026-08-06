import { http } from './http.js'

export const sugestaoService = {
  listarTodas: () => http.get('/sugestoes'),
  listarPorStatus: (status) => http.get('/sugestoes/por-status', { params: { status } }),
  listarPorPessoa: (pessoaId) => http.get(`/sugestoes/pessoa/${pessoaId}`),
  criar: (dto) => http.post('/sugestoes', dto),
  alterarStatus: (id, novoStatus) => http.patch(`/sugestoes/${id}/status`, null, { params: { novoStatus } }),
  excluir: (id) => http.delete(`/sugestoes/${id}`),
}
