import type { Route } from "./+types/home";
import { Login } from "../pages/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Salve, Doutor!" },
    { name: "description", content: "Página de log-in de usuário do Salve, Doutor!" },
  ];
}

export default function Home() {
  return <Login />;
}
