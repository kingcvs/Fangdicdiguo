import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
}

export const useUIStore = defineStore('ui', () => {
  const currentModal = ref<string | null>(null)
  const modalProps = ref<any>(null)
  const notifications = ref<Notification[]>([])
  
  function openModal(modalName: string, props?: any) {
    currentModal.value = modalName
    modalProps.value = props
  }
  
  function closeModal() {
    currentModal.value = null
    modalProps.value = null
  }
  
  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString()
    notifications.value.push({ ...notification, id })
    setTimeout(() => removeNotification(id), 3000)
  }
  
  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  return { 
    currentModal, 
    modalProps, 
    notifications,
    openModal, 
    closeModal, 
    addNotification, 
    removeNotification 
  }
})
