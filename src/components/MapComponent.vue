<template>
  <div id="map" class="map-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from "vue";
import maplibregl from "maplibre-gl";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MapComponent",
  setup() {
    const { t, locale } = useI18n();

    let marker: maplibregl.Marker | null = null;
    let map: maplibregl.Map | null = null;

    const initializeMap = (latitude: number, longitude: number) => {
      map = new maplibregl.Map({
        container: "map",
        style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
        center: [longitude, latitude],
        zoom: 13,
      });

      marker = new maplibregl.Marker()
        .setLngLat([longitude, latitude])
        .setPopup(
          new maplibregl.Popup().setHTML(`<b>${t("lang.maps_markerHere")}</b>`)
        )
        .addTo(map);
    };

    onMounted(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            initializeMap(latitude, longitude);
          },
          () => {
            alert(t("lang.maps_permDenied"));
          }
        );
      } else {
        alert(t("lang.maps_localDenied"));
      }
    });

    watch(locale, () => {
      if (marker) {
        marker.getPopup()?.setHTML(`<b>${t("lang.maps_markerHere")}</b>`);
      }
    });

    return {};
  },
});
</script>

<style scoped>
.map-container {
  width: 90%;
  height: 70vh;
  border: 2px solid #a0a0a0;
  border-radius: 8px;
  margin-top: 20px;
  left: 5%;
}
</style>
