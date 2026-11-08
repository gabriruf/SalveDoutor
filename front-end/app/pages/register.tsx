import { useState } from "react";
import { Link } from "react-router";

function validaCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D+/g, "");
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto: number;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

function validaData(valor: string): string {
    const partes = valor.split("/");
    if (partes.length !== 3 || valor.length !== 10) return "Data inválida. Use o formato DD/MM/AAAA.";

    const dia = Number(partes[0]);
    const mes = Number(partes[1]);
    const ano = Number(partes[2]);

    if (ano < 1900) return "Data inválida.";

    const data = new Date(ano, mes - 1, dia);
    const existe =
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia;
    if (!existe) return "Data inválida. Essa data não existe.";

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (data > hoje) return "Data inválida. A data não pode ser no futuro.";

    return "";
}

function validaSenha(senha: string): string {
    if (senha.length < 8) return "A senha deve ter no mínimo 8 caracteres.";
    if (!/\d/.test(senha)) return "A senha deve ter pelo menos 1 número.";
    if (!/[A-Z]/.test(senha)) return "A senha deve ter pelo menos 1 letra maiúscula.";
    if (!/[a-z]/.test(senha)) return "A senha deve ter pelo menos 1 letra minúscula.";
    return "";
}

function formataCRM(valor: string): string {
    return valor
        .toUpperCase() 
        .replace(/[^0-9A-Z]/g, "")
        .slice(0, 8)
        .replace(/^(\d{1,6})([A-Z]{0,2})$/, "$1/$2");
}

export function Register() {
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [erroCpf, setErroCpf] = useState("");
    const [erroCrm, setErroCrm] = useState("");
    const [erroData, setErroData] = useState("");
    const [erroSenha, setErroSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const aoEnviar = (e: React.FormEvent<HTMLFormElement>) => {
        const dados = new FormData(e.currentTarget);
        const nascimento = dados.get("nascimento") as string;
        const senha = dados.get("senha") as string;

        const msgData = validaData(nascimento);
        const msgSenha = validaSenha(senha);
        
        let cpfOk = true;
        if (tipoUsuario === "paciente") {
            const cpf = dados.get("cpf") as string;
            cpfOk = validaCPF(cpf);
            setErroCpf(cpfOk ? "" : "CPF inválido. Verifique o número digitado.");
        }

        setErroData(msgData);
        setErroSenha(msgSenha);

        if (msgData || (tipoUsuario === "paciente" && !cpfOk) || msgSenha) {
            e.preventDefault();
            const primeiroErro = msgData ? "nascimento" : (tipoUsuario === "paciente" && !cpfOk) ? "cpf" : "senha";
            document.getElementById(primeiroErro)?.focus();
        }
    };

    return (
        <div className="flex flex-row min-h-screen bg-white dark:bg-white">
            {/* Coluna esquerda: formulário */}
            <div className="flex flex-col justify-center px-10 py-6 w-full lg:w-[46%]">
                <img
                    src="/salveDr.png"
                    alt="Salve Doutor"
                    className="h-16 w-fit mb-2"
                />

                <h2 className="font-sans font-bold text-3xl text-[#0d5887] ml-3">Crie sua conta</h2>

                <form className="flex flex-col ml-3" onSubmit={aoEnviar}>
                    <div className="mt-4">
                        <label htmlFor="tipoUsuario" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">
                            Você é
                        </label>
                        <select 
                            id="tipoUsuario"
                            name="tipoUsuario" 
                            value={tipoUsuario}
                            onChange={(e) => setTipoUsuario(e.target.value)}
                            required 
                            className="w-full max-w-100 border-2 p-2 rounded-2xl text-[#0d5887] border-[#3aa2ff] outline-none focus:border-[#0483c8] bg-white">
                            <option value="" disabled>---Selecione uma opção---</option>
                            <option value="doutor">Doutor</option>
                            <option value="paciente">Paciente</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="nome" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">Nome Completo</label>
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            className="w-full max-w-100 border-2 p-2 rounded-2xl text-[#0d5887] border-[#3aa2ff] outline-none focus:border-[#0483c8]"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="nascimento" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">Data de Nascimento</label>
                        <input
                            id="nascimento"
                            name="nascimento"
                            type="text"
                            inputMode="numeric"
                            placeholder="DD/MM/AAAA"
                            maxLength={10}
                            onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value
                                    .replace(/\D/g, "")
                                    .slice(0, 8)
                                    .replace(/^(\d{2})(\d)/, "$1/$2")
                                    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
                                if (erroData) setErroData("");
                            }}
                            onBlur={(e) => {
                                if (e.currentTarget.value) setErroData(validaData(e.currentTarget.value));
                            }}
                            aria-invalid={!!erroData}
                            className={`w-full max-w-100 border-2 p-2 rounded-2xl text-[#0d5887] placeholder:text-[#0d5887]/50 outline-none ${
                                erroData
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-[#3aa2ff] focus:border-[#0483c8]"
                            }`}
                            required
                        />
                        {erroData && <p className="ml-3 mt-1 text-sm text-red-500">{erroData}</p>}
                    </div>

                    {tipoUsuario === "paciente" && (
                        <div className="mt-4">
                            <label htmlFor="cpf" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">CPF</label>
                            <input
                                id="cpf"
                                name="cpf"
                                type="text"
                                inputMode="numeric"
                                placeholder="999.999.999-99"
                                maxLength={14}
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value
                                        .replace(/\D/g, "")
                                        .slice(0, 11)
                                        .replace(/^(\d{3})(\d)/, "$1.$2")
                                        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                                        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
                                    if (erroCpf) setErroCpf("");
                                }}
                                onBlur={(e) => {
                                    if (e.currentTarget.value && !validaCPF(e.currentTarget.value)) {
                                        setErroCpf("CPF inválido. Verifique o número digitado.");
                                    }
                                }}
                                aria-invalid={!!erroCpf}
                                className={`w-full max-w-100 border-2 p-2 rounded-2xl text-[#0d5887] outline-none ${
                                    erroCpf
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-[#3aa2ff] focus:border-[#0483c8]"
                                }`}
                                required
                            />
                            {erroCpf && <p className="ml-3 mt-1 text-sm text-red-500">{erroCpf}</p>}
                        </div>
                    )}

                    {tipoUsuario === "doutor" && (
                        <div className="mt-4">
                            <label htmlFor="crm" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">CRM</label>
                            <input
                                id="crm"
                                name="crm"
                                type="text"
                                placeholder="123456/SP"
                                maxLength={10}
                                onInput={(e) => {
                                    e.currentTarget.value = formataCRM(e.currentTarget.value);
                                }}
                                className="w-full max-w-100 border-2 p-2 rounded-2xl text-[#0d5887] outline-none border-[#3aa2ff] focus:border-[#0483c8]"
                                required
                            />
                        </div>
                    )}

                    <div className="mt-4">
                        <label htmlFor="email" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">E-mail</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="w-full max-w-100 border-2 p-2 rounded-2xl text-[#0d5887] border-[#3aa2ff] outline-none focus:border-[#0483c8]"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="telefone" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">Telefone</label>
                        <input
                            id="telefone"
                            name="telefone"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            maxLength={15}
                            onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value
                                    .replace(/\D/g, "")
                                    .slice(0, 11)
                                    .replace(/^(\d{2})(\d)/, "($1) $2")
                                    .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
                            }}
                            className="w-full max-w-100 border-2 p-2 rounded-2xl text-[#0d5887] border-[#3aa2ff] outline-none focus:border-[#0483c8]"
                            required
                        />
                    </div>

                     <div className="mt-4">
                        <label htmlFor="senha" className="ml-3 mb-1 block font-sans text-sm text-[#0d5887]">
                            Senha
                        </label>
                        <input
                            id="senha"
                            name="senha"
                            type={mostrarSenha ? "text" : "password"}
                            onInput={() => {
                                if (erroSenha) setErroSenha(""); 
                            }}
                            onBlur={(e) => {
                                if (e.currentTarget.value) setErroSenha(validaSenha(e.currentTarget.value));
                            }}
                            aria-invalid={!!erroSenha}
                            className={`w-full max-w-100 border-2 p-2 rounded-2xl text-[#0d5887] outline-none ${
                                erroSenha
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-[#3aa2ff] focus:border-[#0483c8]"
                            }`}
                            required
                        />
                        {erroSenha && <p className="ml-3 mt-1 text-sm text-red-500">{erroSenha}</p>}

                        <div className="mt-2 ml-3 flex items-center">
                            <input
                                id="mostrar-senha"
                                type="checkbox"
                                checked={mostrarSenha}
                                onChange={(e) => setMostrarSenha(e.target.checked)}
                                className="cursor-pointer"
                            />
                            <label htmlFor="mostrar-senha" className="ml-2 text-sm text-[#0d5887] cursor-pointer">
                                Mostrar senha
                            </label>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="rounded-2xl w-full max-w-103 py-2 px-5 bg-[#3aa2ff] hover:bg-[#308bdb] font-bold text-2xl text-white text-center uppercase cursor-pointer transition"
                        >
                            Cadastrar
                        </button>
                    </div>

                    <p className="mt-3 w-full max-w-103 text-center text-[#005c92]">
                        <span>Já possui uma conta?</span>&ensp;
                        <Link to="/login" className="underline font-bold hover:text-[#0483c8]">Entre agora</Link>
                    </p>
                </form>
            </div>

            <div className="hidden lg:flex flex-1 bg-[#ccfaff]">
                <img
                    src="/artwork-login-cadastro.png"
                    alt=""
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}