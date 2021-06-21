<template>
  <h1>Workout Chrono</h1>
  <p>This simple web app helps you to time your own workout. Add your own steps and get the job done! 💪</p>
  <ul>
    <li>No <strong>ads</strong> or <strong>sponsoring</strong></li>
    <li>No <strong>cookies</strong> or annoying <strong>privacy banner</strong></li>
    <li>
      Completely <strong><a href="https://github.com/sylvaindubus/workout-chrono">free and open-source</a></strong>
    </li>
  </ul>
  <p>I've made this app for my own usage, and planned to improve it during my free time.</p>
  <p>
    If you enjoy it, want to suggest an improvement or anything else, feel free to contact me
    <a href="mailto:svn.dbs@gmail.com">here</a> 😉
  </p>
  <p>Happy workout!</p>
</template>

<style lang="postcss" scoped>
h1 {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.75;
  margin-bottom: 1em;
}
ul {
  list-style: disc;
  margin: 0 0 1em 0;
  padding: 0 0 0 1.5em;
}
p,
li {
  font-size: 1.25rem;
  font-weight: 700;
}
p {
  margin-bottom: 1em;
  line-height: 1.33;
}
li {
  display: list-item;
  margin-bottom: 0.5em;
  &:nth-child(1) strong {
    color: #eb3b5a;
  }
  &:nth-child(2) strong {
    color: #2d98da;
  }
  &:nth-child(3) strong {
    color: #20bf6b;
  }
}
a {
  text-decoration: underline;
}
</style>
