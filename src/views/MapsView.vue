<template>
  <div class="maps">
    <img alt="Maps" :src="require('@/assets/maps.png')" id="img-maps">
    <h1>{{ $t("lang.maps_title") }}</h1>
  </div>
</template>

<style scoped>
#img-maps {
  width: 15%;
}
</style>