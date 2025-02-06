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
          v-for="msg in messages"
          :key="msg.dateEmis"
          :class="[
            'message',
            msg.isSystem ? 'system' : msg.pseudo === pseudo ? 'user' : 'other',
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import socketIOClient from "socket.io-client";

interface Message {
  content: string;
  dateEmis: string;
  pseudo: string;
  roomId: string;
  isSystem?: boolean;
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
    const messagesContainer = ref<HTMLElement | null>(null);

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString();
    };

    watch(messages, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight;
        }
      });
    });

    const connectToChat = () => {
      if (!pseudo.value || !roomId.value) return;

      socket.value = socketIOClient(
        "http://mohammedelmehdi.makhlouk.angers.mds-project.fr:40220",
        {
          transports: ["websocket"],
        }
      );

      socket.value.on("connect", () => {
        console.log("Connexion établie avec le serveur !");
      });

      socket.value.emit("chat-join-room", {
        pseudo: pseudo.value,
        roomId: roomId.value,
      });

      console.log(
        `${t("lang.chat_connectedToRoom1")} : ${roomId.value} ${t(
          "lang.chat_connectedToRoom2"
        )} : ${pseudo.value}`
      );

      socket.value.on("SYSTEME_MSG", (msg: Message) => {
        console.log(`${t("lang.chat_msgServer")} :`, msg);
        messages.value.push({ ...msg, isSystem: true });
      });

      socket.value.on("chat-msg", (msg: Message) => {
        console.log(`${t("lang.chat_msgClient")} :`, msg);
        if (msg.roomId === roomId.value) {
          messages.value = [...messages.value, msg];
        }
      });

      isConnected.value = true;
    };

    const sendMessage = () => {
      if (!newMessage.value.trim()) return;

      const messageData = {
        msg: newMessage.value,
        roomId: roomId.value,
      };
      console.log(`${t("lang.chat_msgSending")} :`, messageData);

      socket.value.emit("chat-msg", messageData);

      messages.value = [
        ...messages.value,
        {
          content: newMessage.value,
          dateEmis: new Date().toISOString(),
          pseudo: pseudo.value,
          roomId: roomId.value,
        },
      ];

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

        messages.value.push({
          content: `${t("lang.chat_joinedRoom")} ${roomId.value}.`,
          dateEmis: new Date().toISOString(),
          pseudo: "Système",
          roomId: roomId.value,
          isSystem: true,
        });

        console.log(`${t("lang.chat_changingRoom")} : ${roomId.value}`);
      }
    };

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
  max-height: 60vh;
  overflow-y: scroll;
  margin-bottom: 20px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
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

.user {
  background-color: #63217f;
  color: white;
}

.system {
  background-color: #ffc107;
  text-align: center;
  font-weight: bold;
  color: #333;
}

.other {
  background-color: #87cefa;
  color: white;
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
  width: 50%;
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
</style>
