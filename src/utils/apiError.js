export function obterMensagensValidacao(error) {
  const mensagens = error?.response?.data?.messages
  return Array.isArray(mensagens) ? mensagens : []
}

export function obterMensagemErro(error, fallback = 'Ocorreu um erro inesperado.') {
  if (!error?.response) {
    return 'Não foi possível conectar ao backend. Verifique se o Spring Boot está rodando.'
  }

  const dados = error.response.data

  if (typeof dados === 'string' && dados.trim()) return dados
  if (dados?.message) return dados.message
  if (Array.isArray(dados?.messages) && dados.messages.length) return dados.messages[0]

  return fallback
}
