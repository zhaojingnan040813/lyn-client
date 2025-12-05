<template>
  <div class="chat-view">
    <ChatWindow />
  </div>
</template>

<script setup>
import ChatWindow from "@/components/chat/ChatWindow.vue";
</script>

<style scoped>
.chat-view {
  height: calc(100vh - 180px);
  min-height: 600px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
