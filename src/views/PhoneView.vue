<template>
  <div class="phone">
    <img alt="Phone" :src="require('@/assets/phone.png')" id="img-phone">
    <h1>{{ $t("lang.phone_title") }}</h1>
    <PhoneComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PhoneComponent from "@/components/PhoneComponent.vue";

export default defineComponent({
  name: "PhoneView",
  components: {
    PhoneComponent,
  },
});
</script>

<style scoped>
#img-phone {
  width: 15%;
}
</style>