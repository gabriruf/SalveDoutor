import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/register", "routes/register.tsx"), // está com a mesma tela de login, por enquanto.
    route("/login", "routes/login.tsx")
] satisfies RouteConfig;
