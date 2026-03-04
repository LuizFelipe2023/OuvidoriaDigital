<script setup>
import { onMounted, ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'

const pesquisas = ref([])
const loading = ref(true)
const router = useRouter()

const search = ref('')
const filterRating = ref('todos') 

const carregarDados = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('pesquisas')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (!error) pesquisas.value = data
  loading.value = false
}

const pesquisasFiltradas = computed(() => {
  return pesquisas.value.filter(p => {
    const term = search.value.toLowerCase();
    
    const matchesSearch = 
      p.nome?.toLowerCase().includes(term) || 
      p.cpf?.includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.telefone?.includes(term) ||
      (p.description && p.description.toLowerCase().includes(term));
    
    const matchesRating = filterRating.value === 'todos' ||
      (filterRating.value === 'alto' && p.rating >= 4) ||
      (filterRating.value === 'medio' && p.rating === 3) ||
      (filterRating.value === 'baixo' && p.rating <= 2);

    return matchesSearch && matchesRating;
  });
});

const stats = computed(() => {
  if (pesquisas.value.length === 0) return { avg: 0, total: 0 }
  const sum = pesquisas.value.reduce((acc, p) => acc + p.rating, 0)
  return {
    avg: (sum / pesquisas.value.length).toFixed(1),
    total: pesquisas.value.length
  }
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

onMounted(carregarDados)
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
    <div class="max-w-6xl mx-auto">
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-black uppercase tracking-tighter">Painel de Controle</h1>
            <p class="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Gestão de Ouvidoria</p>
          </div>
        </div>

        <div class="bg-blue-600 p-8 rounded-[2.5rem] shadow-lg shadow-blue-100 text-white flex justify-between items-center">
          <div>
            <p class="text-blue-100 text-[10px] font-black uppercase tracking-widest">Média Geral</p>
            <h2 class="text-4xl font-black">{{ stats.avg }}</h2>
          </div>
          <div class="text-right">
            <p class="text-blue-100 text-[10px] font-black uppercase tracking-widest">Total</p>
            <h2 class="text-4xl font-black">{{ stats.total }}</h2>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-[2rem] shadow-sm border border-white mb-8 flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <span class="absolute left-5 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          <input 
            v-model="search"
            type="text" 
            placeholder="Buscar por nome ou CPF..." 
            class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-semibold text-sm"
          />
        </div>
        
        <div class="flex bg-slate-50 p-1 rounded-2xl border-2 border-slate-100">
          <button 
            @click="filterRating = 'todos'"
            :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', filterRating === 'todos' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400']"
          >Todos</button>
          <button 
            @click="filterRating = 'baixo'"
            :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', filterRating === 'baixo' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400']"
          >Críticos</button>
          <button 
            @click="filterRating = 'medio'"
            :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', filterRating === 'medio' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-400']"
          >Médios</button>
          <button 
            @click="filterRating = 'alto'"
            :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', filterRating === 'alto' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400']"
          >Excelentes</button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20 animate-pulse font-black text-slate-300 uppercase tracking-[0.3em]">
        Carregando Base de Dados...
      </div>

      <div v-else-if="pesquisasFiltradas.length > 0" class="space-y-4">
        <div v-for="p in pesquisasFiltradas" :key="p.id" class="group bg-white p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
          
          <div :class="[
            'w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-inner border-2',
            p.rating >= 4 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : p.rating === 3 ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-rose-50 border-rose-100 text-rose-600'
          ]">
            <span class="text-xs font-black leading-none">NOTA</span>
            <span class="text-2xl font-black leading-none">{{ p.rating }}</span>
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h3 class="font-black text-slate-800 text-lg uppercase tracking-tighter">{{ p.nome }}</h3>
              <span class="text-[9px] bg-slate-100 px-2 py-0.5 rounded-full font-black text-slate-500 uppercase">{{ new Date(p.created_at).toLocaleDateString() }}</span>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>CPF: {{ p.cpf }}</span>
              <span class="text-blue-400">{{ p.email }}</span>
              <span>{{ p.telefone }}</span>
            </div>
            <p v-if="p.description" class="mt-4 text-slate-500 bg-slate-50/50 p-4 rounded-2xl text-sm italic border-l-2 border-slate-200 group-hover:border-blue-500 transition-colors">
              "{{ p.description }}"
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
        <p class="font-black text-slate-400 uppercase tracking-widest">Nenhum registro encontrado para esse filtro.</p>
      </div>
    </div>
  </div>
</template>