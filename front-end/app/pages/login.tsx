export function Login() {
    return (
        <div className="grid grid-cols-2 bg-white dark:bg-white max-h-fit">
            <div className="flex flex-col justify-center">
                <h2 className="font-sans font-bold text-5xl text-[#0d5887]">Precisando de ajuda?</h2>
                <p className="font-sans text-[#0d5887]">Faça login para ser atendido</p>
                <form className="flex flex-col ml-5">
                    <div className=" mt-5 mb-5">
                        <label className=" ml-3 mb-1 font-sans text-[#0d5887]">E-mail</label>
                        <input
                            className="flex flex-col w-120 border-2 p-2 ml-2 mr-2 rounded-4xl text-[#0d5887] border-[#6f9cca]"
                            type="email"
                        />
                    </div>
                    <div className="mt-5 mb-5">
                        <label className="ml-3 font-sans text-[#0d5887]">Senha</label>
                        <input
                            className="flex flex-col w-120 border-2 p-2 ml-2 mr-2 rounded-4xl text-[#0d5887] border-[#6f9cca]"
                            type="password"
                        />
                    </div>
                
                <div className="mt-5 mb-5">
                    <input
                        className="ml-3 text-black"
                        type="checkbox"
                        name="show-password"
                        id="show-password"
                        value="Mostrar senha" />
                    <label className="ml-3 text-[#0d5887]">Mostrar senha</label>
                </div>

                <a className="ml-3 underline text-[#005c92] font-bold hover:text-[#0483c8]" href="#">Esqueci minha senha</a>

                <div className="mt-5 mb-5">
                    <button className="rounded-2xl w-120 pt-2 pb-2 pl-5 pr-5 bg-[#3aa2ff] hover:bg-[#308bdb] font-bold text-2xl text-white text-center uppercase">Entrar</button>
                </div>
                <p className="text-[#005c92]">
                    <span>Ainda não tem uma conta?</span>&ensp;
                    <a href="/register" className="underline font-bold hover:text-[#0483c8]">Crie agora!</a>
                </p>
            </form>

            <div className="flex flex-row flex-1 overflow-hidden">
                <img src="../artwork-login-cadastro.png" alt="" className="w-full h-full object-cover object-center"/>
            </div>
        </div>
    );
}