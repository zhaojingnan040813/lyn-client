<template>
    <div class="chat-page">
        <div class="chat-container">
            <ChatWindow />
        </div>
    </div>
</template>

<script setup>
import ChatWindow from '@/components/chat/ChatWindow.vue';
</script>

<style scoped>
.chat-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 40px 20px;
}

.chat-container {
    max-width: 800px;
    height: calc(100vh - 80px);
    margin: 0 auto;
}
</style>
