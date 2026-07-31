export function aplicarMascaraCpf(valor = '') {
  let numeros = valor.replace(/\D/g, '').slice(0, 11)

  if (numeros.length > 9) {
    numeros = numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
  } else if (numeros.length > 6) {
    numeros = numeros.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3')
  } else if (numeros.length > 3) {
    numeros = numeros.replace(/(\d{3})(\d{0,3})/, '$1.$2')
  }

  return numeros
}

export function formatarData(data) {
  if (!data) return '—'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

export function formatarDataHora(data) {
  if (!data) return '—'
  return new Date(data).toLocaleString('pt-BR')
}
