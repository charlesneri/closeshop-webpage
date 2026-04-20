import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

export const useAuthUserStore = defineStore('authUser', () => {
  const userData = ref(null)
  const isLoggedIn = ref(false)

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userData.value = user
      isLoggedIn.value = true
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    userData.value = null
    isLoggedIn.value = false
  }

  return {
    userData,
    isLoggedIn,
    fetchUser,
    logout
  }
})
