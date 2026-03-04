<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

const checkUser = async () => {
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user || null
}

supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user || null
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

onMounted(checkUser)
</script>

<template>
  <nav class="bg-slate-100/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white shadow-md group-hover:bg-blue-600 transition-all">
          ⚖️
        </div>
        <span class="font-black uppercase tracking-tighter text-slate-800">Ouvidoria</span>
      </router-link>

      <div class="flex items-center gap-3">
        
        <router-link 
          v-if="!user"
          to="/login" 
          class="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all shadow-md active:scale-95"
        >
          Acesso Admin
        </router-link>

        <div v-else class="flex items-center gap-2">
          <router-link 
            to="/admin" 
            class="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-white text-blue-700 border border-slate-200 rounded-xl hover:bg-blue-50 transition-all shadow-sm"
          >
            Dashboard
          </router-link>
          
          <button 
            @click="handleLogout" 
            class="p-2.5 bg-white text-slate-500 border border-slate-200 rounded-xl hover:text-rose-600 hover:border-rose-200 transition-all active:scale-90 shadow-sm"
            title="Sair"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>