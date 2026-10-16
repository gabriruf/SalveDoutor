import { Link } from "react-router";

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
        <MainNavBar />
    </main>
  );
}

// about.tsx ainda não existe
export function MainNavBar() {
    return (
        <nav className="bg-white dark:bg-gray-800 p-3">
            <img src="" alt="Logo do SalveDoutor" />
            <div className="flex flex-row">
                <Link to="/">
                    <h1>Salve, Doutor</h1>
                </Link>
                <Link to="/about">Sobre nós</Link> 
                <Link to="/register">Cadastro</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    )
}