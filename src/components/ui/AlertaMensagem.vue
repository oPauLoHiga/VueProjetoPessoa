<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'

defineOptions({ name: 'AlertaMensagem' })

const props = defineProps({
  mensagem: {
    type: String,
    default: '',
  },
  tipo: {
    type: String,
    default: 'erro',
    validator: (valor) => ['erro', 'sucesso'].includes(valor),
  },
  duracao: {
    type: Number,
    default: 0,
  },
  fechavel: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['fechar'])

let temporizador

const classeTipo = computed(() =>
  props.tipo === 'sucesso' ? 'alert-success' : 'alert-danger',
)
const titulo = computed(() => props.tipo === 'sucesso' ? 'Sucesso' : 'Atenção')
const icone = computed(() => props.tipo === 'sucesso' ? '✓' : '!')

function cancelarTemporizador() {
  if (temporizador) {
    clearTimeout(temporizador)
    temporizador = undefined
  }
}

function fechar() {
  cancelarTemporizador()
  emit('fechar')
}

watch(
  () => [props.mensagem, props.duracao],
  ([mensagem, duracao]) => {
    cancelarTemporizador()
    if (mensagem && duracao > 0) {
      temporizador = setTimeout(fechar, duracao)
    }
  },
  { immediate: true },
)

onBeforeUnmount(cancelarTemporizador)
</script>

<template>
  <div
    v-if="mensagem"
    class="alert alerta-mensagem"
    :class="classeTipo"
    :role="tipo === 'erro' ? 'alert' : 'status'"
    :aria-live="tipo === 'erro' ? 'assertive' : 'polite'"
  >
    <span class="alerta-icone" aria-hidden="true">{{ icone }}</span>
    <div class="alerta-conteudo">
      <strong>{{ titulo }}</strong>
      <p>{{ mensagem }}</p>
    </div>
    <button
      v-if="fechavel"
      type="button"
      class="alerta-fechar"
      :aria-label="`Fechar mensagem de ${titulo.toLowerCase()}`"
      @click="fechar"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.alerta-mensagem {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-right: 46px;
  animation: alerta-entrar .2s ease-out;
}

.alerta-icone {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 2px solid currentColor;
  border-radius: 50%;
  font-weight: 800;
  line-height: 1;
}

.alerta-conteudo {
  min-width: 0;
}

.alerta-conteudo strong {
  display: block;
  margin-bottom: 2px;
}

.alerta-conteudo p {
  margin: 0;
  overflow-wrap: anywhere;
}

.alerta-fechar {
  position: absolute;
  top: 8px;
  right: 10px;
  padding: 2px 6px;
  border: 0;
  color: inherit;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: opacity .15s, transform .15s;
}

.alerta-fechar:hover {
  opacity: .65;
  transform: scale(1.1);
}

.alerta-fechar:focus-visible {
  border-radius: 4px;
  outline: 2px solid currentColor;
  outline-offset: 1px;
}

@keyframes alerta-entrar {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
}
</style>
