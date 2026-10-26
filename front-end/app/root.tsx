import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { useState } from "react";
import type { link } from "fs";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const links = [
      { to: "/", icone: "/IconNavBar/home.png", texto: "Início" },
      { to: "/1", icone: "/IconNavBar/consulta.png", texto: "Consultas" },
      { to: "/1", icone: "/IconNavBar/exame.png", texto: "Exames" },
      { to: "/1", icone: "/IconNavBar/telemedicina.png", texto: "Telemedicina" },
    ];

    const tanapagina = ({isActive}: {isActive: boolean}) =>
      `flex flex-row items-center px-3 py-1 transition-colors ${
        isActive
          ? "text-[#005c92] font-bold border-b-2 border-[#005c92]"
          : "text-gray-500 hover:text-[#005c92]"
      }`;

  return (
    <>
      <header className="bg-white dark:bg-gray-800 p-1 ">
         <div className="MainNavBar bg-white dark:bg-gray-800 p-3 grid grid-cols-3 items-center">
            {/* Logo */}
            <div className="flex justify-self-start">
              <img className = "w-12" src="/favicon.svg" alt="Logotipo do Salvedoutor"/>
              <span className="ml-2  text-xl font-peacesans font-[1000] text-[#005c92] leading-tight">SALVE <br /> DOUTOR</span>
            </div>
            
            {/* Links */}
            <nav className="hidden md:flex flex-row justify-self-center">
              {links.map((i) => (
                  <NavLink key={i.to} to={i.to} end className={tanapagina}>
                    <img className="mr-2 w-8 h-8" src={i.icone} alt="" />
                    {i.texto}
                  </NavLink>
                ))
              }
            </nav>

            {/* Notificação/Usuário/ */}
            <div className="flex items-center gap-2 justify-self-end col-start-3">
              <button type="button" className="flex flex-row items-center rounded-full" aria-label="menu">
                <NavLink className={"flex flex-row items-center px-3 text-[#005c92]"} to="/login">
                  <img className="w-8 h-8 mr-3" src="/IconNavBar/notificacao.png" alt="" />
                  <img className="w-10 h-10 rounded-full" src="/IconNavBar/user.png" alt="" />
                </NavLink>
              </button>
            {/* botão que não sei para que serve */}
            <button
                type="button"
                onClick={() => setMenuAberto(!menuAberto)}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#005c92] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-controls="menu-mobile"
                aria-expanded={menuAberto}
              >
                <span className="sr-only">Abrir menu principal</span>
                <img className="w-6 sm-hidden sm:block" src="/IconNavBar/seta.png" alt="" />
              </button>
            </div>


            </div>
            
            {/* Menu mobile */}
            {menuAberto && (
              <nav id="menuzin" className="md:hidden flex flex-col border-t border-gray-200 px-3 pb-3">
              {links.map((i) => (
                  <NavLink key={i.to} to={i.to} onClick={() => setMenuAberto(false)} className={"flex flex-row items-center px-3 text-[#005c92]"}>
                    <img className="mr-2 w-8 h-8" src={i.icone} alt="" />
                    {i.texto}
                  </NavLink>
                ))}
            </nav>
            )}

      </header>
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
