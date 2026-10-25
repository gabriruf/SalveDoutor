import type { Route } from "./+types/home";
import { Register } from "../pages/register";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Salve, Doutor!" },
    { name: "description", content: "Página de cadastro de usuário do Salve, Doutor!" },
  ];
}

export default function Home() {
  return <Register />; 
}
