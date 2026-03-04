<script setup>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';
import './style.css';
</script>

<template>
  <Navbar />
  <router-view />
  <Footer />
</template>

<style scoped></style>
