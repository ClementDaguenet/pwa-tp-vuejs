<template>
  <div class="phone-info">
    <div class="info">
      <p>
        🔋 {{ batteryLevel }}%
        <span v-if="isCharging">⚡</span>
      </p>
      <p>📡 {{ networkType }} ({{ networkSpeed || 0 }} Mbps)</p>
    </div>
    <div class="call">
      <input
        type="tel"
        v-model="phoneNumber"
        placeholder="📱"
        @input="phoneNumber = phoneNumber.replace(/\D/g, '')"
      />
      <br />
      <a :href="'tel:' + phoneNumber" class="btn-call">{{
        $t("lang.phone_call")
      }}</a>
      <button @click="vibratePhone" class="btn-vibrate">
        {{ $t("lang.phone_vibe") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "PhoneComponent",
  setup() {
    const batteryLevel = ref<number | null>(null);
    const isCharging = ref<boolean | null>(null);
    const networkType = ref<string>("unknown");
    const networkSpeed = ref<number | null>(null);
    const phoneNumber = ref<string>("");

    const getBatteryInfo = async () => {
      if ("getBattery" in navigator) {
        const battery = await (navigator as any).getBattery();
        batteryLevel.value = Math.round(battery.level * 100);
        isCharging.value = battery.charging;

        battery.addEventListener("levelchange", () => {
          batteryLevel.value = Math.round(battery.level * 100);
        });

        battery.addEventListener("chargingchange", () => {
          isCharging.value = battery.charging;
        });
      }
    };

    const getNetworkInfo = () => {
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        networkType.value = connection.effectiveType || "unknown";
        networkSpeed.value = connection.downlink || 0;

        connection.addEventListener("change", () => {
          networkType.value = connection.effectiveType || "unknown";
          networkSpeed.value = connection.downlink || 0;
        });
      } else {
        networkType.value = navigator.onLine ? "Online" : "Offline";
      }
    };

    const vibratePhone = () => {
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
    };

    onMounted(() => {
      getBatteryInfo();
      getNetworkInfo();
    });

    return {
      batteryLevel,
      isCharging,
      networkType,
      networkSpeed,
      phoneNumber,
      vibratePhone,
    };
  },
});
</script>

<style scoped>
.phone-info {
  background: #1f1f1f;
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 320px;
  margin: auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.info {
  font-size: 18px;
  margin-top: 10px;
}

input {
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

input::placeholder {
  color: #aaa;
}

input:focus {
  background: #444;
  box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5);
}

.call {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-call {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: rgb(177, 66, 185);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-call:hover {
  background-color: #812688;
  transform: scale(1.05);
  box-shadow: 0px 4px 15px rgba(177, 66, 185, 0.5);
}

.btn-vibrate {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-vibrate:hover {
  background-color: #e68900;
  transform: scale(1.05);
  box-shadow: 0px 4px 15px rgba(255, 152, 0, 0.5);
}
</style>
