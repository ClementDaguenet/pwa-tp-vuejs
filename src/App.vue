<template>
  <div id="app">
    <!-- Navbar burger -->
    <nav>
      <div class="burger-menu" @click="toggleMenu">
        <div :class="{'burger-bar': true, 'open': menuOpen}"></div>
        <div :class="{'burger-bar': true, 'open': menuOpen}"></div>
        <div :class="{'burger-bar': true, 'open': menuOpen}"></div>
      </div>
      
      <!-- Menu items with background -->
      <div class="menu-background" :class="{ 'open': menuOpen }"></div>
      <div class="menu-items" :class="{ 'open': menuOpen }">
        <router-link to="/" @click="closeMenu">{{ $t("lang.menu_home") }}</router-link>
        <router-link to="/about" @click="closeMenu">{{ $t("lang.menu_about") }}</router-link>
        <router-link to="/camera" @click="closeMenu">{{ $t("lang.menu_camera") }}</router-link>
        <router-link to="/maps" @click="closeMenu">{{ $t("lang.menu_maps") }}</router-link>
        <router-link to="/phone" @click="closeMenu">{{ $t("lang.menu_phone") }}</router-link>
      </div>
    </nav>

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>

    <!-- Language Switcher -->
    <button @click="toggleLanguage" class="language-btn">
      <img
        :src="currentLanguage === 'en' ? '/img/flags/en-us.png' : '/img/flags/fr-fr.png'"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "App",
  setup() {
    const { locale } = useI18n();

    // Initially set the locale based on localStorage or default to english
    const storedLang = localStorage.getItem("language") || "en";
    locale.value = storedLang;
    
    watch(
      () => locale.value, // Watch for changes in the language
      (newLang) => {
        localStorage.setItem("language", newLang); // Save language to localStorage
      },
      { immediate: true }
    );

    // Function to toggle between languages
    const toggleLanguage = () => {
      locale.value = locale.value === "en" ? "fr" : "en"; // Toggle between fr and en
    };

    // Function for managing menu visibility
    const menuOpen = ref(false);
    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    // Function to close menu when a link is clicked
    const closeMenu = () => {
      menuOpen.value = false;
    };

    return {
      toggleLanguage,
      currentLanguage: locale,
      menuOpen,
      toggleMenu,
      closeMenu,
    };
  },
});
</script>

<style>
body {
  background-color: #1f1f1f;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #a0a0a0;
}

nav {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
}

.burger-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 25px;
  cursor: pointer;
  position: fixed;
}

.burger-bar {
  width: 30px;
  height: 5px;
  background-color: #a0a0a0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.burger-bar.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.burger-bar.open:nth-child(2) {
  opacity: 0;
}

.burger-bar.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.menu-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 140px;
  height: 100vh;
  background-color: #2a2a2a;
  transition: transform 0.3s ease-in-out;
  z-index: 1;
  transform: translateX(-92%);
}

.menu-background.open {
  transform: translateX(0);
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #2a2a2a;
  padding: 20px;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 2;
}

.menu-items.open {
  transform: translateX(0);
}

.menu-items a {
  color: #a0a0a0;
  text-decoration: none;
  font-size: 18px;
}

.menu-items a.router-link-exact-active {
  color: #b142b9;
  font-weight: bold;
}

.language-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.language-btn:hover {
  transform: scale(1.1);
}

.language-btn img {
  width: 30px;
  height: 20px;
}
</style>

