<template>
  <button class="roundedButton">
    <slot></slot>
  </button>
</template>

<style lang="postcss" scoped>
  .roundedButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: none;
    padding: .75em 1.5em;
    border-radius: 4px;
    color: #000;
    font-family: inherit;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: 700;
    box-shadow: rgb(235 235 235) 0px 6px 0px;
  }
</style>
