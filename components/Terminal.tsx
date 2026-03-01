import React, { useState, useEffect, useRef } from "react";
import Privacy from "./Privacy";
import Terms from "./Terms";

interface TerminalProps {
  onComplete: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onComplete }) => {
  const [page, setPage] = useState<"terminal" | "privacy" | "terms">("terminal");

  // If user clicked Privacy/Terms, show that page instead of the terminal
if (page === "privacy") return <div style={{color:"#fff", background:"#000", minHeight:"100vh", padding:24}}>PRIVACY PAGE SHOWING</div>;
if (page === "terms") return <div style={{color:"#fff", background:"#000", minHeight:"100vh", padding:24}}>TERMS PAGE SHOWING</div>;


  const [lines, setLines] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showLogo, setShowLogo] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialSequence = [
    "> INITIALIZING NEURAL UPLINK...",
    "> BYPASSING ENCRYPTION LAYERS...",
    "> CONNECTION ESTABLISHED [256-BIT AES]",
    "> LOCATING CORE ASSETS...",
    "",
    "WELCOME OPERATOR.",
    "TechTales Labs is a hands-on AI, Cyber, Tech, CS, Research platform where students easily build projects and portfolios.",
    "",
    'Type "init" to begin initialization sequence.',
  ];

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 300);

    let current = 0;
    const interval = setInterval(() => {
      if (current < initialSequence.length) {
        setLines((prev) => [...prev, initialSequence[current]]);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => {
      clearTimeout(logoTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const cmd = inputValue.toLowerCase().trim();
    setLines((prev) => [...prev, `guest@techtales-labs:~$ ${inputValue}`]);

    if (cmd === "init" || cmd === "start") {
      setLines((prev) => [
        ...prev,
        "> SYNCHRONIZING MODULES...",
        "> LOADING NEURAL INTERFACE...",
        "> ACCESS GRANTED.",
      ]);
      setTimeout(onComplete, 1200);
    } else if (cmd === "help") {
      setLines((prev) => [
        ...prev,
        "AVAILABLE COMMANDS:",
        "  init   - Start training sequence",
        "  status - Check system integrity",
        "  clear  - Wipe buffer",
      ]);
    } else if (cmd === "clear") {
      setLines([]);
    } else {
      setLines((prev) => [...prev, `ERR: Command "${cmd}" not recognized.`]);
    }

    setInputValue("");
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="flex flex-col h-screen bg-black text-white p-8 md:p-16 font-mono text-xs md:text-sm selection:bg-white selection:text-black cursor-text"
      onClick={handleTerminalClick}
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]"></div>

      <div className="flex-1 overflow-y-auto mb-6 scroll-smooth" ref={scrollRef}>
        <div className="max-w-4xl mx-auto">
          {/* Header Logo */}
          <div
            className={`mb-16 transition-all duration-1000 transform ${
              showLogo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <div className="flex items-baseline gap-1">
              <h1 className="text-4xl md:text-6xl font-extralight tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                <span className="opacity-40 font-thin mr-2">&gt;</span>
                TechTales Labs<span className="cursor-blink opacity-80">_</span>
              </h1>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-[1px] w-8 bg-zinc-800"></div>
              <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-[0.6em] font-medium">
                Operator Training Protocol
              </p>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="space-y-1.5 font-mono text-zinc-400">
            {lines.map((line, i) => (
              <div
                key={i}
                className="whitespace-pre-wrap leading-relaxed animate-in fade-in slide-in-from-left-2 duration-300"
              >
                {line}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleInput} className="relative flex mt-8 group items-center overflow-hidden">
            <div className="flex items-center text-zinc-600 font-mono mr-2 shrink-0">
              <span>guest@techtales-labs:~$</span>
            </div>

            <div className="relative flex items-center flex-1 min-w-0">
              <span className="text-white whitespace-pre break-all">{inputValue}</span>
              <span className="cursor-blink text-white flex-shrink-0">_</span>

              <input
                ref={inputRef}
                autoFocus
                className="absolute inset-0 w-full h-full bg-transparent border-none outline-none text-transparent caret-transparent opacity-0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-[10px] text-zinc-500 border-t border-zinc-900/50 pt-6 mt-auto">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <span className="uppercase tracking-[0.25em] text-zinc-700">[ STATUS: READY ]</span>
            <span className="uppercase tracking-[0.25em] text-zinc-700">[ SECURE_LINK: ACTIVE ]</span>
          </div>

          <span className="uppercase tracking-[0.25em] text-zinc-700">&copy; 2026 TechTales Labs</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 items-center justify-center">
            <a
            href="/privacy.html"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-white"
          >
            Privacy Policy
          </a>

          <span className="text-zinc-700">•</span>

         <a
            href="/terms.html"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-white"
          >
            Terms of Service
          </a>

          <span className="text-zinc-700">•</span>

          <a
            href="https://medium.com/@realtechtales"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-white"
          >
            Medium
          </a>

          <span className="text-zinc-700">•</span>

          <a
            href="https://discord.gg/cxA9nrn27H"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-white"
          >
            Discord
          </a>

          <span className="text-zinc-700">•</span>

          <a
            href="https://youtube.com/@realtechtales?si=wjnsPYY0RfGMTdg2"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-white"
          >
            YouTube
          </a>

          <span className="text-zinc-700">•</span>

          <a
            href="mailto:techtaleslabs@gmail.com"
            className="underline underline-offset-4 hover:text-white"
          >
            techtaleslabs@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Terminal;

