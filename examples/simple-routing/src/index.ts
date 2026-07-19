import "./styles.css";
import { html, signal } from "cosuous";

interface RouteParams {
  readonly id?: string;
  readonly name?: string;
}

type View = (params: RouteParams) => Node;

const routes: Record<string, RegExp> = {
  Home: /^$/,
  Product: /^products\/(?<id>\d+)$/,
  User: /^users\/(?<name>\w+)$/,
};

const Home: View = () => html`<h2>Home</h2>`;
const Product: View = ({ id }) => html`<h2>Product ${id}</h2>`;
const User: View = ({ name }) => html`<h2>${name}'s Profile</h2>`;

const views: Record<string, View> = { Home, Product, User };

function resolve(path: string, apply: (name: string) => View): Node | undefined {
  for (const name in routes) {
    const result = path.match(routes[name]);
    if (result) {
      return apply(name)({ ...result.groups });
    }
  }
  return undefined;
}

const route = signal("");

const App = (): Node =>
  html`
    <div>
      <h1>Hello World</h1>
      <ul class="nav">
        <li><a href="#">Home</a></li>
        <li><a href="#users/bob">Bob's Profile</a></li>
        <li><a href="#products/123">Product 123</a></li>
      </ul>
      ${() => resolve(route(), (name) => views[name])}
    </div>
  `;

const updateRoute = (): void => route(location.hash.slice(1));
globalThis.addEventListener("hashchange", updateRoute);
updateRoute();

document.body.append(App());
