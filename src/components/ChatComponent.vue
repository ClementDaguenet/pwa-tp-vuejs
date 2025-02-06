<template>
  <div class="chat-container">
    <div v-if="!isConnected" class="login-container">
      <input v-model="pseudo" placeholder="Pseudo..." class="input-field" />
      <input v-model="roomId" placeholder="Channel..." class="input-field" />
      <button @click="connectToChat" class="connect-button">
        {{ $t("lang.chat_connectRoom") }}
      </button>
    </div>

    <div v-else>
      <div class="settings-container">
        <input v-model="pseudo" placeholder="Pseudo..." class="input-field" />
        <input v-model="roomId" placeholder="Channel..." class="input-field" />
        <button @click="updateRoom" class="update-button">
          {{ $t("lang.chat_changeRoom") }}
        </button>
      </div>

      <div class="messages" ref="messagesContainer">
        <div
          v-for="msg in filteredMessages"
          :key="msg.dateEmis"
          :class="[
            'message',
            msg.categorie === 'INFO'
              ? 'system'
              : msg.pseudo === pseudo
              ? 'user'
              : 'other',
          ]"
        >
          <div class="message-info">
            <span class="author">{{ msg.pseudo }}</span>
            <span class="date">{{ formatDate(msg.dateEmis) }}</span>
          </div>
          <div class="content">{{ msg.content }}</div>
        </div>
      </div>

      <div class="input-container">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="💬"
          class="message-input"
        />
        <button @click="sendMessage" class="send-button">
          {{ $t("lang.chat_send") }}
        </button>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showSystemMessages" />
          {{ $t("lang.chat_showSystemMessages") }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  nextTick,
  computed,
  onMounted,
} from "vue";
import { useI18n } from "vue-i18n";
import socketIOClient from "socket.io-client";

interface Message {
  content: string;
  dateEmis: string;
  pseudo: string;
  roomId: string;
  categorie: string;
}

export default defineComponent({
  name: "ChatComponent",
  setup() {
    const { t } = useI18n();
    const messages = ref<Message[]>([]);
    const roomId = ref("");
    const pseudo = ref("");
    const isConnected = ref(false);
    const socket = ref<any>(null);
    const newMessage = ref("");
    const showSystemMessages = ref(false);
    const messagesContainer = ref<HTMLElement | null>(null);

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString();
    };

    const filteredMessages = computed(() => {
      return messages.value.filter(
        (msg) => showSystemMessages.value || msg.categorie !== "INFO"
      );
    });

    watch(
      messages,
      () => {
        scrollToBottom();
        if ("vibrate" in navigator) {
          navigator.vibrate(200);
        }
      },
      { deep: true }
    );
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTo({
            top: messagesContainer.value.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    };

    const connectToChat = () => {
      if (!pseudo.value || !roomId.value) return;

      socket.value = socketIOClient(
        "https://mohammedelmehdi.makhlouk.angers.mds-project.fr",
        {
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 2000,
        }
      );

      socket.value.on("connect", () => {
        socket.value.emit("chat-join-room", {
          pseudo: pseudo.value,
          roomId: roomId.value,
        });
      });

      socket.value.on("chat-msg", (msg: Message) => {
        messages.value.push(msg);
      });

      isConnected.value = true;
    };

    const sendMessage = () => {
      if (!newMessage.value.trim()) return;

      const messageData = {
        content: newMessage.value,
        dateEmis: new Date().toISOString(),
        pseudo: pseudo.value,
        roomId: roomId.value,
        categorie: "MESSAGE",
      };
      socket.value.emit("chat-msg", messageData);
      newMessage.value = "";
    };

    const updateRoom = () => {
      if (socket.value) {
        socket.value.emit("chat-leave-room", {
          pseudo: pseudo.value,
          roomId: roomId.value,
        });
        socket.value.emit("chat-join-room", {
          pseudo: pseudo.value,
          roomId: roomId.value,
        });
        messages.value = [];
      }
    };

    onMounted(() => {
      scrollToBottom();
    });

    return {
      messages,
      newMessage,
      sendMessage,
      formatDate,
      roomId,
      pseudo,
      isConnected,
      connectToChat,
      updateRoom,
      showSystemMessages,
      filteredMessages,
    };
  },
});
</script>

<style scoped>
.chat-container {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1f1f1f;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.login-container {
  text-align: center;
}

.input-field {
  width: 20%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  background: #333;
  color: white;
  text-align: center;
}

.connect-button,
.update-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 20px;
}

.update-button {
  background-color: #ffc107;
}

.messages {
  max-height: 80vh;
  overflow-y: auto;
  padding: 10px;
  background: #333;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-bottom: 20px;
}

.message {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  word-wrap: break-word;
  font-size: 14px;
  position: relative;
}

.message-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.author {
  font-weight: bold;
}

.date {
  font-style: italic;
  font-size: 11px;
  margin-left: 10px;
}

.content {
  margin-top: 5px;
  font-size: 14px;
}

.user {
  background-color: #63217f;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 5px;
}

.system {
  background-color: #ffc107;
  color: #333;
  text-align: center;
  font-weight: bold;
  align-self: center;
  max-width: 90%;
}

.other {
  background-color: #3b93c9;
  color: white;
  align-self: flex-start;
  border-bottom-left-radius: 5px;
}

.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 10px;
}

.message-input {
  width: 60%;
  max-width: 400px;
  padding: 12px;
  border-radius: 25px;
  text-align: center;
  font-size: 16px;
  outline: none;
  background: #333;
  color: white;
}

.send-button {
  background-color: rgb(177, 66, 185);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: white;
  accent-color: #ffc107;
}

.checkbox-label input {
  margin-right: 5px;
}
</style>
