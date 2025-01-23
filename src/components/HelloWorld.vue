<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      {{ $t("lang.home_guide1") }}<br />{{ $t("lang.home_guide2") }}
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">{{
        $t("lang.home_guide3")
      }}</a
      >.
    </p>
    <h3>{{ $t("lang.home_linkTitle") }}</h3>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank" rel="noopener">{{
          $t("lang.home_linkDocs")
        }}</a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank" rel="noopener">{{
          $t("lang.home_linkForum")
        }}</a>
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank" rel="noopener">{{
          $t("lang.home_linkCommunity")
        }}</a>
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank" rel="noopener">{{
          $t("lang.home_linkTwitter")
        }}</a>
      </li>
      <li>
        <a href="https://news.vuejs.org" target="_blank" rel="noopener">{{
          $t("lang.home_linkNews")
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: String,
  },
})
export default class HelloWorld extends Vue {
  msg!: string;
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #b142b9;
}
</style>
