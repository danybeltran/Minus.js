import { template, state, render } from "./minus";

function App() {
  let data = state({
    count: 20,
    name: "Dany",
    user: "danybeltran",
  });

  setInterval(() => {
    data.setUser((usr) => usr.toUpperCase());
    data.setCount((c) => c + 1);
  }, 1000);

  return template(
    `
  <div>
    <h1 style="color: {{count % 2 === 0 ? "red" : "blue" }} ">
      {{user}}
      {{count}}
    </h1>
  </div>
  `
  ).with(data);
}

render(App({ count: 10 }), "#app");
