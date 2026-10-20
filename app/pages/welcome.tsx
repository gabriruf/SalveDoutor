import { useRef, useState } from "react";

export function Welcome() {
  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-800 flex flex-col font-sans">

      {/* Conteúdo Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Painel Esquerdo: Cards de Ações */}
        <section className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                Precisando de ajuda?
              </h1>
            </div>
            <p className="text-slate-400 text-base mt-1">
              Sua central de saúde online está te esperando.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card Agendar Consulta */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-sky-500/50 transition">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">📋</div>
                <div>
                  <h3 className="font-bold text-lg text-white">Agendar Consulta</h3>
                  <p className="text-slate-400 text-xs mt-1">Marque sua consulta com facilidade.</p>
                </div>
              </div>
              <button className="mt-5 w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2">
                Agendar agora ➔
              </button>
            </div>

            {/* Card Minhas Consultas */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-sky-500/50 transition">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">📅</div>
                <div>
                  <h3 className="font-bold text-lg text-white">Minhas Consultas</h3>
                  <p className="text-slate-400 text-xs mt-1">Acompanhe seus agendamentos.</p>
                </div>
              </div>
              <button className="mt-5 w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2">
                Ver detalhes ➔
              </button>
            </div>

            {/* Card Meus Exames */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-sky-500/50 transition">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">🩺</div>
                <div>
                  <h3 className="font-bold text-lg text-white">Meus Exames</h3>
                  <p className="text-slate-400 text-xs mt-1">Consulte seus resultados e laudos.</p>
                </div>
              </div>
              <button className="mt-5 w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2">
                Consultar ➔
              </button>
            </div>

            {/* Card Telemedicina */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-sky-500/50 transition">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">💻</div>
                <div>
                  <h3 className="font-bold text-lg text-white">Telemedicina</h3>
                  <p className="text-slate-400 text-xs mt-1">Atendimento médico online, rápido e seguro.</p>
                </div>
              </div>
              <button className="mt-5 w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2">
                Iniciar chamada ➔
              </button>
            </div>
          </div>

          {/* Dica de Saúde */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 flex gap-4 items-center">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl text-xl">💡</div>
            <div>
              <h4 className="text-amber-400 font-bold text-sm">Dica de Saúde do Dia</h4>
              <p className="text-slate-300 text-xs mt-0.5">
                Manter-se hidratado é essencial para o bom funcionamento do corpo e da mente.
              </p>
            </div>
          </div>
        </section>

        {/* Carrossel no Painel Direito com altura controlada */}
        <section className="lg:col-span-7 w-full self-center">
          <MainNavBar />
        </section>

      </main>
    </div>
  );
}

export function MainNavBar() {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  const imagens = [
    "/doutor.png",
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.png",
    "/5.png"
  ];

  const irParaSlide = (index: number) => {
    if (carrosselRef.current) {
      const larguraSlide = carrosselRef.current.offsetWidth;
      carrosselRef.current.scrollTo({
        left: index * larguraSlide,
        behavior: "smooth"
      });
      setIndiceAtivo(index);
    }
  };

  const scrollRight = () => {
    if (carrosselRef.current) {
      carrosselRef.current.scrollBy({ left: carrosselRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (carrosselRef.current) {
      carrosselRef.current.scrollBy({ left: -carrosselRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const lidarComScroll = () => {
    if (carrosselRef.current) {
      const scrollLeftPos = carrosselRef.current.scrollLeft;
      const larguraSlide = carrosselRef.current.offsetWidth;
      const novoIndice = Math.round(scrollLeftPos / larguraSlide);
      if (novoIndice !== indiceAtivo) {
        setIndiceAtivo(novoIndice);
      }
    }
  };

  return (
    <nav className="w-full h-[420px] p-0 bg-transparent relative overflow-hidden rounded-2xl shadow-2xl border border-slate-800">
      <div className="relative w-full h-full bg-slate-900">
        
        {/* Botão Anterior */}
        <button 
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full z-10 hover:bg-black/80 transition cursor-pointer text-lg backdrop-blur-md"
          aria-label="Anterior"
        >
          ❮
        </button>

        {/* Carrossel de Imagens */}
        <div 
          ref={carrosselRef}
          onScroll={lidarComScroll}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none gap-0 w-full h-full"
          style={{ scrollbarWidth: 'none' }}
        >
          {imagens.map((url, index) => (
            <div key={index} className="min-w-full h-full snap-start flex justify-center items-center relative bg-slate-900">
              <img 
                src={url} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full object-contain rounded-2xl" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Botão Próximo */}
        <button 
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full z-10 hover:bg-black/80 transition cursor-pointer text-lg backdrop-blur-md"
          aria-label="Próximo"
        >
          ❯
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
          {imagens.map((_, index) => (
            <button
              key={index}
              onClick={() => irParaSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                indiceAtivo === index 
                  ? "bg-sky-400 w-8" 
                  : "bg-white/40 w-2.5 hover:bg-white/70" 
              }`}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </nav>
  );
}