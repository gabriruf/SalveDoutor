import type { Route } from "./+types/home";
import { Login } from "../pages/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Salve, Doutor!" },
    { name: "description", content: "Página de cadastro de usuário do Salve, Doutor!" },
  ];
}

export default function Home() {
  return <Login />; // ta usando a mesma página de login por que eu ainda não criei a página de cadastro.
}
