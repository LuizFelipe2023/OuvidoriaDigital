<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMsg.value = "Acesso negado. Verifique suas credenciais."
    loading.value = false
  } else {
    router.push('/admin')
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
    
    <div class="max-w-md w-full shadow-xl rounded-[32px] bg-white overflow-hidden border border-slate-100">
      
      <div class="bg-slate-900 p-8 text-white flex justify-between items-center">
        <div>
          <h2 class="text-xl font-black tracking-tight uppercase">Login</h2>
          <p class="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Acesso Restrito</p>
        </div>
        <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 text-2xl">
          🔒
        </div>
      </div>

      <div class="p-8 md:p-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
            <input 
              v-model="email" 
              type="email" 
              required 
              placeholder="seu@email.com"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white font-medium" 
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
            <input 
              v-model="password" 
              type="password" 
              required 
              placeholder="••••••••"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white font-medium" 
            />
          </div>

          <div v-if="errorMsg" class="p-3 bg-rose-50 border border-rose-100 rounded-xl">
            <p class="text-rose-500 text-[10px] font-bold text-center uppercase tracking-widest">
              {{ errorMsg }}
            </p>
          </div>

          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <span v-if="loading" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
            <span class="uppercase tracking-[0.2em] text-[11px]">
              {{ loading ? 'Autenticando...' : 'Entrar no Sistema' }}
            </span>
          </button>

        </form>
      </div>
    </div>
  </div>
</template>