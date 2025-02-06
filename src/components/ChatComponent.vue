<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="msg in messages" :key="msg.dateEmis" class="message">
        <div class="message-info">
          <span class="author">{{ msg.autorId }}</span>
          <span class="date">{{ formatDate(msg.dateEmis) }}</span>
        </div>
        <div class="content">{{ msg.content }}</div>
      </div>
    </div>
    <div class="input-container">
      <input
        v-model="newMessage.content"
        @keyup.enter="sendMessage"
        placeholder="💬"
        class="message-input"
      />
      <button @click="sendMessage" class="send-button">
        {{ $t("lang.chat_send") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import socketIOClient from "socket.io-client";

interface Message {
  content: string;
  dateEmis: string;
  serverId: string;
  autorId: string;
}

export default defineComponent({
  name: "ChatComponent",
  setup() {
    const { t } = useI18n();
    const messages = ref<Message[]>([]);
    const newMessage = ref<Message>({
      content: "",
      dateEmis: "",
      serverId: "server",
      autorId: "clemw",
    });

    const socket = socketIOClient("http://mohammedelmehdi.makhlouk.angers.mds-project.fr:40220");

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };

    const sendMessage = () => {
      if (newMessage.value.content.trim() !== "") {
        newMessage.value.dateEmis = new Date().toISOString();
        socket.emit("CHAT_MSG", newMessage.value);
        newMessage.value.content = "";
      }
    };

    onMounted(() => {
      socket.on("SYSTEME_MSG", (msg: Message) => {
        console.info(t("lang.chat_msgServer")+": ", msg);
        messages.value.push(msg);
      });

      socket.on("CHAT_MSG", (msg: Message) => {
        console.info(t("lang.chat_msgClient")+": ", msg);
        messages.value.push(msg);
      });
    });

    return {
      messages,
      newMessage,
      sendMessage,
      formatDate,
    };
  },
});
</script>

<style scoped>
.chat-container {
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  background-color: #1f1f1f;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.messages {
  max-height: 60vh;
  overflow-y: scroll;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

.author {
  font-weight: bold;
}

.date {
  font-style: italic;
}

.content {
  margin-top: 5px;
  font-size: 14px;
}

.input-container {
  display: flex;
  gap: 10px;
}

.message-input {
  width: 90%;
  padding: 12px;
  border: none;
  border-radius: 25px;
  text-align: center;
  font-size: 16px;
  outline: none;
  background: #333;
  color: white;
  transition: 0.3s;
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.2);
}

.message-input::placeholder {
  color: #aaa;
}

.message-input:focus {
  background: #444;
  box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5);
}

.send-button {
  background-color: rgb(177, 66, 185);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #812688;
}
</style>
