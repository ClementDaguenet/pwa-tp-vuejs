<template>
  <div class="chat">
    <h1>{{ $t("lang.chat_title") }}</h1>
    <ChatComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChatComponent from "@/components/ChatComponent.vue";

export default defineComponent({
  name: "ChatView",
  components: {
    ChatComponent,
  },
});
</script>

<style scoped>
.chat {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #a0a0a0;
  margin-bottom: 20px;
  font-size: 24px;
}
</style>
