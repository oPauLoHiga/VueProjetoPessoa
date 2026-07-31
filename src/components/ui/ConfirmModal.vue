<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({ name: 'ConfirmModal' })

const props = defineProps({
  aberto: {
    type: Boolean,
    default: false,
  },
  titulo: {
    type: String,
    default: 'Confirmar ação',
  },
  mensagem: {
    type: String,
    default: '',
  },
  textoConfirmar: {
    type: String,
    default: 'Confirmar',
  },
  textoCancelar: {
    type: String,
    default: 'Cancelar',
  },
  carregando: {
    type: Boolean,
    default: false,
  },
  perigoso: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirmar', 'cancelar'])
const botaoCancelar = ref(null)

function cancelar() {
  if (!props.carregando) emit('cancelar')
}

function tratarTeclado(evento) {
  if (props.aberto && evento.key === 'Escape') cancelar()
}

watch(
  () => props.aberto,
  async (aberto) => {
    if (aberto) {
      await nextTick()
      botaoCancelar.value?.focus()
    }
  },
)

onMounted(() => window.addEventListener('keydown', tratarTeclado))
onBeforeUnmount(() => window.removeEventListener('keydown', tratarTeclado))
</script>

<template>
  <Teleport to="body">
    <div v-if="aberto" class="confirm-overlay" @click.self="cancelar">
      <div
        class="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
      >
        <div class="confirm-icon" :class="{ danger: perigoso }" aria-hidden="true">!</div>
        <h2 id="confirm-modal-title">{{ titulo }}</h2>
        <p id="confirm-modal-message">{{ mensagem }}</p>

        <div class="confirm-actions">
          <button
            ref="botaoCancelar"
            type="button"
            class="btn btn-ghost"
            :disabled="carregando"
            @click="cancelar"
          >
            {{ textoCancelar }}
          </button>
          <button
            type="button"
            class="btn"
            :class="perigoso ? 'btn-danger' : 'btn-primary'"
            :disabled="carregando"
            @click="$emit('confirmar')"
          >
            <span v-if="carregando" class="spin"></span>
            {{ carregando ? 'Aguarde...' : textoConfirmar }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(17, 24, 39, .62);
  animation: overlay-entrar .15s ease-out;
}

.confirm-modal {
  width: min(440px, 100%);
  padding: 26px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 24px 60px rgba(0, 0, 0, .25);
  animation: modal-entrar .2s ease-out;
}

.confirm-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 16px;
  border-radius: 50%;
  color: #92400e;
  background: var(--warning-light);
  font-size: 22px;
  font-weight: 800;
}

.confirm-icon.danger {
  color: #991b1b;
  background: var(--danger-light);
}

.confirm-modal h2 {
  margin: 0 0 8px;
  color: var(--gray-900);
}

.confirm-modal p {
  margin: 0;
  color: var(--gray-700);
  line-height: 1.55;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

@keyframes overlay-entrar {
  from { opacity: 0; }
}

@keyframes modal-entrar {
  from {
    opacity: 0;
    transform: translateY(8px) scale(.98);
  }
}

@media (max-width: 460px) {
  .confirm-actions {
    flex-direction: column-reverse;
  }

  .confirm-actions .btn {
    width: 100%;
  }
}
</style>
