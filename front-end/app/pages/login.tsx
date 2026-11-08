import { useState } from "react";
import { Link } from "react-router"; 
export function Login() {
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const aoEnviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const dados = new FormData(e.currentTarget);
        const email = dados.get("email");
        const senha = dados.get("senha");
        
        console.log({ tipoUsuario, email, senha });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-white min-h-screen">
            <div className="flex flex-col justify-center px-10 py-6">
                <h2 className="font-sans font-bold text-4xl lg:text-5xl text-[#0d5887] ml-3">Precisando de ajuda?</h2>
                <p className="font-sans text-[#0d5887] ml-3 mt-1">Faça login para ser atendido</p>
                
                <form className="flex flex-col ml-3 mt-4" onSubmit={aoEnviar}>
                    <div className="mt-4 mb-4">
                        <label htmlFor="tipoUsuario" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">
                            Você é
                        </label>
                        <select 
                            id="tipoUsuario"
                            name="tipoUsuario" 
                            value={tipoUsuario}
                            onChange={(e) => setTipoUsuario(e.target.value)}
                            required 
                            className="w-full max-w-120 border-2 p-2 rounded-2xl text-[#0d5887] border-[#6f9cca] outline-none focus:border-[#0483c8] bg-white">
                            <option value="" disabled>---Selecione uma opção---</option>
                            <option value="doutor">Doutor</option>
                            <option value="paciente">Paciente</option>
                        </select>
                    </div>

                    <div className="mt-2 mb-4">
                        <label htmlFor="email" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">E-mail</label>
                        <input
                            id="email"
                            name="email"
                            className="w-full max-w-120 border-2 p-2 rounded-2xl text-[#0d5887] border-[#6f9cca] outline-none focus:border-[#0483c8]"
                            type="email"
                            required
                        />
                    </div>

                    <div className="mt-2 mb-4">
                        <label htmlFor="senha" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">Senha</label>
                        <input
                            id="senha"
                            name="senha"
                            className="w-full max-w-120 border-2 p-2 rounded-2xl text-[#0d5887] border-[#6f9cca] outline-none focus:border-[#0483c8]"
                            type={mostrarSenha ? "text" : "password"}
                            required
                        />
                    </div>

                    <div className="mt-2 mb-4 flex items-center">
                        <input
                            className="ml-3 text-black cursor-pointer"
                            type="checkbox"
                            name="show-password"
                            id="show-password"
                            checked={mostrarSenha}
                            onChange={(e) => setMostrarSenha(e.target.checked)}
                        />
                        <label htmlFor="show-password" className="ml-2 text-sm text-[#0d5887] cursor-pointer">
                            Mostrar senha
                        </label>
                    </div>

                    <div className="mb-4">
                        <Link className="ml-3 underline text-[#005c92] font-bold hover:text-[#0483c8] text-sm" to="/forgot-password">
                            Esqueci minha senha
                        </Link>
                    </div>

                    <div className="mt-2 mb-4">
                        <button type="submit" className="rounded-2xl w-full max-w-120 py-2 px-5 bg-[#3aa2ff] hover:bg-[#308bdb] font-bold text-2xl text-white text-center uppercase cursor-pointer transition">
                            Entrar
                        </button>
                    </div>

                    <p className="text-[#005c92] ml-3">
                        <span>Ainda não tem uma conta?</span>&ensp;
                        <Link to="/register" className="underline font-bold hover:text-[#0483c8]">Crie agora!</Link>
                    </p>
                </form>
            </div>

            <div className="hidden lg:flex flex-row flex-1 overflow-hidden bg-[#ccfaff]">
                <img src="../artwork-login-cadastro.png" alt="" className="w-full h-full object-cover object-center" />
            </div>
        </div>
    );
}