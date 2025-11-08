// Composable pour gérer l'état de l'overlay de recherche mobile
import { ref } from 'vue'

const showMobileSearch = ref(false)

export const useMobileSearch = () => {
  const open = () => {
    showMobileSearch.value = true
  }

  const close = () => {
    showMobileSearch.value = false
  }

  const toggle = () => {
    showMobileSearch.value = !showMobileSearch.value
  }

  return {
    showMobileSearch,
    open,
    close,
    toggle
  }
}

