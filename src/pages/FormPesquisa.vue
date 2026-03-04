<script setup>
import { reactive, ref } from 'vue'
import { supabase } from '../lib/supabase.js'

const message = ref('')
const messageType = ref('success') 
const loading = ref(false)

const pesquisa = reactive({
    nome: '', 
    cpf: '',
    email: '',
    telefone: '',
    description: '',
    rating: null
})

const formatCPF = (e) => {
    let v = e.target.value.replace(/\D/g, "")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    pesquisa.cpf = v.substring(0, 14)
}

const formatTelefone = (e) => {
    let v = e.target.value.replace(/\D/g, "")
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2")
    v = v.replace(/(\d)(\d{4})$/, "$1-$2")
    pesquisa.telefone = v.substring(0, 15)
}

const submitForm = async () => {
    if (!pesquisa.nome || !pesquisa.cpf || !pesquisa.email || !pesquisa.rating) {
        message.value = 'Preencha os campos obrigatórios.'
        messageType.value = 'error'
        return
    }

    loading.value = true
    message.value = ''

    const dadosParaEnviar = {
        ...pesquisa,
        cpf: pesquisa.cpf.replace(/\D/g, ""), 
        telefone: pesquisa.telefone.replace(/\D/g, ""),
        rating: Number(pesquisa.rating) 
    }

    const { error } = await supabase.from('pesquisas').insert([dadosParaEnviar])

    loading.value = false

    if (error) {
        message.value = 'Erro: ' + error.message
        messageType.value = 'error'
        return
    }

    message.value = 'Enviado com sucesso! 🎉'
    messageType.value = 'success'
    
    Object.assign(pesquisa, { nome: '', cpf: '', email: '', telefone: '', description: '', rating: null })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 flex items-center justify-center font-sans text-slate-900">
    <div class="max-w-2xl w-full shadow-xl rounded-[32px] bg-white overflow-hidden border border-slate-100">
      
      <div class="bg-slate-900 p-6 text-white flex justify-between items-center">
        <div>
          <h1 class="text-xl font-black tracking-tight uppercase">Ouvidoria</h1>
          <p class="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Feedback do Cidadão</p>
        </div>
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
          <span class="text-lg">💬</span>
        </div>
      </div>

      <div class="p-6 md:p-10">
        
        <div v-if="message" 
          :class="[
            'mb-6 p-4 rounded-2xl border flex items-center gap-3 transition-all text-sm',
            messageType === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
          ]"
        >
          <span class="font-bold">{{ message }}</span>
          <button @click="message = ''" class="ml-auto opacity-50 hover:opacity-100">✕</button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome</label>
              <input v-model="pesquisa.nome" type="text" placeholder="Nome Completo" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white font-medium" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF</label>
              <input :value="pesquisa.cpf" @input="formatCPF" type="text" placeholder="000.000.000-00" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white font-medium" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <input v-model="pesquisa.email" type="email" placeholder="seu@email.com" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white font-medium" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
              <input :value="pesquisa.telefone" @input="formatTelefone" type="text" placeholder="(00) 00000-0000" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white font-medium" />
            </div>
          </div>

          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sua Nota:</p>
            <div class="flex gap-2">
              <button v-for="n in 5" :key="n" type="button" @click="pesquisa.rating = n"
                :class="[
                  'w-10 h-10 rounded-lg font-black text-sm transition-all border-2 active:scale-95',
                  pesquisa.rating === n 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                    : 'bg-white border-slate-200 text-slate-300 hover:border-blue-200'
                ]"
              >
                {{ n }}
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mensagem (Opcional)</label>
            <textarea v-model="pesquisa.description" rows="3" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white font-medium resize-none"></textarea>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
            <span v-if="loading" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
            <span class="uppercase tracking-[0.2em] text-[11px]">
              {{ loading ? 'Enviando...' : 'Enviar Manifestação' }}
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>