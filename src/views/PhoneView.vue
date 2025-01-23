<template>
  <div class="phone">
    <img alt="Phone" :src="require('@/assets/phone.png')" id="img-phone">
    <h1>{{ $t("lang.phone_title") }}</h1>
  </div>
</template>

<style scoped>
#img-phone {
  width: 15%;
}
</style>