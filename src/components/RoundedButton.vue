<template>
  <button class="roundedButton">
    <slot></slot>
  </button>
</template>

<style lang="postcss" scoped>
.roundedButton {
  padding: 0.75em 1.5em;
  border-radius: 4px;
  background-color: #fff;
  color: #000;
  font-family: inherit;
  font-size: 1rem;
  text-transform: uppercase;
  box-shadow: #ebebeb 0px 6px 0px;
}
</style>
