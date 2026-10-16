import type { Route } from "./+types/home";
import { Welcome } from "../pages/welcome";
import { Login } from "../pages/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Salve, Doutor!" },
    { name: "description", content: "Bem-vindo ao Salve, Doutor!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
