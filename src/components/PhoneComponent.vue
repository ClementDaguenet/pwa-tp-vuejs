<template>
  <div class="phone-info">

    <div class="info">
      <p>
        🔋 {{ batteryLevel }}%
        <span v-if="isCharging">⚡</span>
      </p>

      <p>
        📡 {{ networkType }} ({{ networkSpeed }} Mbps)
      </p>
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

    onMounted(() => {
      getBatteryInfo();
      getNetworkInfo();
    });

    return {
      batteryLevel,
      isCharging,
      networkType,
      networkSpeed,
    };
  },
});
</script>

<style scoped>
.phone-info {
  background: #1f1f1f;
  color: white;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  margin: auto;
}

.info {
  font-size: 18px;
  margin-top: 10px;
}
</style>
