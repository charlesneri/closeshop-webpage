import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { getCurrentAuthUser } from '@/utils/riderAccess'

export const useAuthUserStore = defineStore('authUser', () => {
  const userData = ref(null)
  const isLoggedIn = ref(false)

  const fetchUser = async () => {
    const user = await getCurrentAuthUser()

    if (user) {
      userData.value = user
      isLoggedIn.value = true
      return
    }

    userData.value = null
    isLoggedIn.value = false
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
