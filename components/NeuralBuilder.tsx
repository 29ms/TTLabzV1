import React, { useState } from 'react';
import { certificateService } from '../services/certificateService';
import { UserCertificate } from '../types';

interface ToolCard {
  title: string;
  type: 'INTRO' | 'CONCEPT' | 'PSEUDOCODE' | 'EXPLANATION' | 'MID_QUIZ' | 'CODE' | 'CODE_EXPLAIN' | 'FUN_FACT' | 'ETHICS' | 'FINAL_QUIZ';
  content: string;
  codeSnippet?: string;
  quiz?: {
    question: string;
    isTrueFalse?: boolean;
    answer: boolean | number;
    options?: string[];
    explanation: string;
  };
}

interface ToolDeck {
  id: string;
  name: string;
  shortDesc: string;
  cards: ToolCard[];
}

const createToolDeck = (
  id: string, 
  name: string, 
  desc: string, 
  pseudo: string, 
  actual: string, 
  fact: string, 
  midQ: string, 
  midA: boolean, 
  finalQ: string, 
  finalOpts: string[], 
  finalA: number
): ToolDeck => ({
  id,
  name,
  shortDesc: desc,
  cards: [
    { title: "The Mission", type: 'INTRO', content: `What is a ${name}? In simple terms: ${desc}` },
    { title: "The Concept", type: 'CONCEPT', content: `Imagine you are a ${id.startsWith('r') ? 'locksmith' : 'security guard'}. Instead of checking things one by one with your hands, you use ${name} to let the computer do it for you a million times faster.` },
    { title: "Human Logic", type: 'PSEUDOCODE', content: "Here is how a human would explain the tool's goal to a computer:", codeSnippet: pseudo },
    { title: "How It Works", type: 'EXPLANATION', content: "Computers aren't smart—they just follow a list of steps. This tool takes your goal and turns it into a 'loop' where it tries every possibility until it finds what it's looking for." },
    { title: "Director's Gate", type: 'MID_QUIZ', content: "The Office of Research is monitoring. Verify your intelligence sync...", quiz: { question: midQ, isTrueFalse: true, answer: midA, explanation: "Failure detected. The Director has reset your training node." } },
    { title: "Technical Snippet", type: 'CODE', content: "This is what the actual command looks like. It might look like code, but it's just a specialized sentence.", codeSnippet: actual },
    { title: "Snippet Breakdown", type: 'CODE_EXPLAIN', content: "The words like 'connect' or 'scan' are built-in instructions. The numbers and web addresses are the 'targets' we give the computer to focus on." },
    { title: "Intel Fact", type: 'FUN_FACT', content: fact },
    { title: "Code of Ethics", type: 'ETHICS', content: `Always remember: A ${name} is just a tool. It's the human behind it that makes it good or bad. Only use these in labs you own or have permission for!` },
    { title: "Final Mastery", type: 'FINAL_QUIZ', content: "Prove your technical understanding of this module to the Director.", quiz: { question: finalQ, options: finalOpts, answer: finalA, explanation: "Certification failed. Unit resetting for mastery." } }
  ]
});

const RED_TEAM_TOOLS: ToolDeck[] = [
  createToolDeck('r1', 'Nmap (Port Scanner)', 'Knocking on every digital door to see who is home.', 'FOR every port: TRY to connect. IF success: SAY "Door is open".', 'nmap -sV target.com', 'Nmap was featured in the movie "The Matrix Reloaded"—it is that real!', 'Does Nmap automatically break into the computer?', false, 'What is the primary output of Nmap?', ['A list of open ports', 'The user\'s password', 'A computer virus'], 0),
  createToolDeck('r2', 'Hydra (Brute Forcer)', 'Guessing passwords faster than any human.', 'WHILE password is wrong: TRY next word in the list.', 'hydra -l admin -P passlist.txt target.com ssh', 'The most common password in the world is still "123456". Hydra finds it in milliseconds.', 'Is a 4-digit PIN safe from Hydra?', false, 'What does Hydra need to work?', ['A long list of potential passwords', 'A physical key', 'A faster internet cable'], 0),
  createToolDeck('r3', 'Sqlmap (Database Tool)', 'Finding weak spots in a website\'s memory.', 'IF I type a special character: DOES the database leak info?', 'sqlmap -u "site.com/id=1" --dbs', 'SQL Injection has been the #1 web bug for over 15 years!', 'Can Sqlmap delete data from a weak website?', true, 'Where does Sqlmap look for bugs?', ['In the website\'s database', 'In the user\'s keyboard', 'In the Wi-Fi router'], 0),
  createToolDeck('r4', 'Metasploit', 'A swiss-army knife for exploits.', 'TRY exploit #42. IF it works: GIVE me control.', 'use exploit/windows/smb/ms17_010_eternalblue', 'Metasploit contains thousands of pre-made "skeleton keys" for computers.', 'Is Metasploit only for old computers?', false, 'What is a "payload" in Metasploit?', ['The code that runs after getting in', 'A heavy computer', 'A monthly bill'], 0),
  createToolDeck('r5', 'Wireshark (Offense)', 'Listening to every conversation on a network.', 'CAPTURE every packet. READ what it says.', 'tshark -i eth0 -f "tcp port 80"', 'Wireshark can see passwords if they aren\'t "scrambled" (encrypted).', 'Can Wireshark see everything you type on a private site?', false, 'What is a "packet"?', ['A tiny piece of data traveling the web', 'A cardboard box', 'A software update'], 0),
  createToolDeck('r6', 'John the Ripper', 'Cracking encrypted files offline.', 'WHILE hash is unknown: TRY to match it with a guess.', 'john --wordlist=passwords.txt hashfile', 'It is called "the Ripper" because it tears through security locks!', 'Can John crack a password if you don\'t have the file?', false, 'What is a "hash"?', ['A scrambled version of a password', 'A type of potato', 'A computer virus'], 0),
  createToolDeck('r7', 'Burp Suite', 'A tool that sits between you and a website.', 'WAIT for user to click. CHANGE the data before it leaves.', 'Intercept -> Change "Price: 100" to "Price: 1"', 'Professional bug hunters use Burp Suite to find million-dollar mistakes.', 'Does Burp Suite work on mobile apps?', true, 'What is a "Proxy"?', ['A middle-man for data', 'A fast computer', 'A type of screen'], 0),
  createToolDeck('r8', 'BeEF (XSS Framework)', 'Taking control of a web browser.', 'IF user visits my link: HOOK their browser to my control.', 'hook.js -> shell_execute("alert(\'Hacked\')")', 'BeEF stands for Browser Exploitation Framework.', 'Can BeEF turn on a user\'s camera if they visit a site?', true, 'What is a "Hook"?', ['A script that links the browser to you', 'A physical fishing tool', 'A type of Wi-Fi'], 0),
  createToolDeck('r9', 'Mimikatz', 'Searching a computer\'s memory for passwords.', 'SEARCH RAM: FIND plain text passwords.', 'sekurlsa::logonpasswords', 'The creator of Mimikatz didn\'t speak English when he first released it!', 'Does Mimikatz need to be on the target computer?', true, 'Where does Mimikatz look?', ['In the computer\'s temporary memory (RAM)', 'In the trash bin', 'On the internet'], 0),
  createToolDeck('r10', 'Hashcat', 'The world\'s fastest password cracker.', 'USE the graphics card (GPU) to guess passwords.', 'hashcat -m 0 -a 0 hash.txt dict.txt', 'Hashcat can guess billions of passwords every single second.', 'Is a graphics card better than a normal chip for cracking?', true, 'What is a "Wordlist"?', ['A dictionary of common passwords', 'A spelling book', 'A list of names'], 0),
  createToolDeck('r11', 'Responder', 'Tricking computers into sharing their secrets.', 'WAIT for a computer to ask "Who is the printer?". SAY "I am!".', 'python3 Responder.py -I eth0', 'Responder preys on old Windows settings that are often left on.', 'Does Responder work on home Wi-Fi?', true, 'What is "Poisoning"?', ['Giving a computer fake information', 'Putting a virus in a file', 'Breaking the screen'], 0),
  createToolDeck('r12', 'Gophish', 'Simulating fake emails to test employees.', 'SEND fake "Reset Password" email. TRACK who clicks.', 'Create Landing Page -> Launch Campaign', 'Most real hacks start with a simple fake email, not a fancy code.', 'Is phishing the same as hacking a server?', false, 'What is a "Phishing Campaign"?', ['A planned set of fake emails', 'A trip to the ocean', 'A software sale'], 0),
  createToolDeck('r13', 'Aircrack-ng', 'Auditing and cracking Wi-Fi passwords.', 'CAPTURE the "handshake". CRACK the Wi-Fi key.', 'aircrack-ng -w wordlist.txt capture.cap', 'Aircrack can find a Wi-Fi password in minutes if it is weak.', 'Can Aircrack crack any Wi-Fi in 5 seconds?', false, 'What is a "Handshake"?', ['The moment a device links to Wi-Fi', 'A polite greeting', 'A software update'], 0),
  createToolDeck('r14', 'Cobalt Strike', 'A professional tool for "Red Teaming".', 'DEPLOY a "Beacon". WAIT for commands.', 'beacon> shell whoami', 'Real-world hackers often use Cobalt Strike because it looks so "normal".', 'Is Cobalt Strike used for defense?', false, 'What is a "Beacon"?', ['A tiny program that talks to the hacker', 'A lighthouse', 'A loud siren'], 0),
  createToolDeck('r15', 'Evilginx', 'Stealing session cookies to bypass 2FA.', 'ACT as the real site. STEAL the login "cookie".', 'evilginx2 -p target_site', 'Evilginx can steal your login even if you have a code on your phone!', 'Does Evilginx need your actual password?', true, 'What is a "Session Cookie"?', ['A digital pass that says you are logged in', 'A snack', 'A computer virus'], 0)
];

const BLUE_TEAM_TOOLS: ToolDeck[] = [
  createToolDeck('b1', 'pfSense (Firewall)', 'The digital bouncer for your whole network.', 'IF IP is blocked: DENY. ELSE: ALLOW.', 'iptables -A INPUT -s 1.2.3.4 -j DROP', 'pfSense is so powerful it runs on the same software as massive data centers.', 'Does a firewall scan for viruses inside every file?', false, 'What is a "Blacklist"?', ['A list of bad IPs that can\'t enter', 'A dark screen', 'A high-speed port'], 0),
  createToolDeck('b2', 'Snort (IDS)', 'An alarm system that smells trouble.', 'IF traffic looks like a hack: ALERT the team.', 'alert tcp any any -> any 80 (msg:"Possible SQLi";)', 'Snort has been the world\'s favorite "sniffer" for over 20 years.', 'Does Snort stop the attack automatically?', false, 'What is an "IDS"?', ['Intrusion Detection System', 'Internet Data Sync', 'Inner Digital Security'], 0),
  createToolDeck('b3', 'Splunk (SIEM)', 'The ultimate digital detective diary.', 'COLLECT every log. SEARCH for 100 failed logins.', 'index=main status=403 | stats count by user', 'Big companies pay millions for Splunk to help them find hackers.', 'Are logs useful before a hack happens?', true, 'What is "SIEM"?', ['Security Information and Event Manager', 'A brand of lock', 'A fast browser'], 0),
  createToolDeck('b4', 'Wazuh (EDR)', 'A doctor checking the health of every computer.', 'MONITOR files. IF file changes: ALERT admin.', 'wazuh-agent -c config.xml', 'Wazuh can detect if a hacker is currently typing on a laptop.', 'Does EDR only protect the Wi-Fi?', false, 'What is an "Endpoint"?', ['A computer, phone, or tablet', 'The end of a cable', 'A finish line'], 0),
  createToolDeck('b5', 'Wireshark (Defense)', 'Analyzing the "DNA" of network traffic.', 'FILTER for weird patterns. FIND the hacker\'s source.', 'ip.addr == 192.168.1.1', 'Analyzing traffic is like being a digital CSI investigator.', 'Is Wireshark used to delete viruses?', false, 'What is a "Protocol"?', ['A set of rules for how data talks', 'A secret password', 'A computer brand'], 0),
  createToolDeck('b6', 'Fail2Ban', 'Banning anyone who guesses too many times.', 'IF login fails 5 times: BLOCK IP for 1 hour.', 'fail2ban-client set sshd banip 1.2.3.4', 'Fail2Ban is like a lock that freezes for an hour if you try the wrong key too often.', 'Does Fail2Ban only work for passwords?', true, 'What is a "Brute Force" attack?', ['Guessing every possible password', 'A very strong computer', 'A large file'], 0),
  createToolDeck('b7', 'ModSecurity (WAF)', 'A specialized shield for websites.', 'IF someone types code into a form: STRIP it out.', 'SecRule REQUEST_FILENAME "@contains login"', 'ModSecurity is like a filter that cleans water before you drink it.', 'Does a WAF protect your home Wi-Fi?', false, 'What is a "WAF"?', ['Web Application Firewall', 'Wide Area Feed', 'Wireless Access Filter'], 0),
  createToolDeck('b8', 'CrowdStrike (Antivirus)', 'Cloud-powered protection that learns from everyone.', 'IF a new virus is seen in Japan: PROTECT my PC now.', 'falconctl stats', 'CrowdStrike uses AI to "predict" what a virus will look like before it exists.', 'Is modern antivirus just a list of bad files?', false, 'What is "Heuristic Analysis"?', ['Looking for bad behavior, not just names', 'A fast scan', 'A type of file'], 0),
  createToolDeck('b9', 'OpenVAS', 'A scanner that finds "cracks" in your walls.', 'TEST every setting. LIST every weak spot.', 'omp -u admin -p admin -G', 'Running a scan is like having a professional burglar test your house for free.', 'Should you run a scanner every day?', true, 'What is a "Vulnerability"?', ['A weakness or hole in security', 'A type of computer', 'A strong password'], 0),
  createToolDeck('b10', 'HoneyPot (Cowrie)', 'A fake vault designed to be hacked.', 'PRETEND to be weak. RECORD what the hacker does.', 'cowrie -c etc/cowrie.cfg', 'Honey Pots help us learn about new hacker tricks without losing real data.', 'Do Honey Pots store real company data?', false, 'Why use a Honey Pot?', ['To distract and study hackers', 'To save power', 'To store backups'], 0),
  createToolDeck('b11', 'VeraCrypt', 'Creating invisible, unbreakable vaults.', 'ENCRYPT the whole disk. LOCK with a key.', 'veracrypt --create-container vault.hc', 'VeraCrypt can make a "hidden" drive that even a pro can\'t find.', 'Is encryption just a normal password?', false, 'What is "AES"?', ['A very strong way to scramble data', 'A type of cable', 'An internet speed'], 0),
  createToolDeck('b12', 'Pi-hole', 'Blocking ads and trackers at the source.', 'IF site is an ad server: DON\'T let it load.', 'pihole -b doubleclick.net', 'Pi-hole can speed up your whole home internet by stopping ads.', 'Does Pi-hole only work on one computer?', false, 'What is "DNS"?', ['An address book for the internet', 'A type of virus', 'A fast cable'], 0),
  createToolDeck('b13', 'Zeek', 'Watching every "handshake" in the building.', 'RECORD every network event. ANALYZE later.', 'zeek -i eth0', 'Zeek doesn\'t just see data—it understands "who said what to whom".', 'Is Zeek the same as a firewall?', false, 'What is "Metadata"?', ['Data about data (like a call log)', 'A large file', 'A type of metal'], 0),
  createToolDeck('b14', 'OpenVPN', 'A tunnel that keeps your data private.', 'WRAP data in a secure shell. HIDE it from snoops.', 'openvpn --config client.ovpn', 'A VPN is like a secret tunnel through a public park.', 'Does a VPN make you 100% untraceable?', false, 'What is "Tunneling"?', ['Encapsulating data inside a secure connection', 'Digging a hole', 'A fast download'], 0),
  createToolDeck('b15', 'CrowdSec', 'A community-powered firewall.', 'IF someone attacks a user in France: BLOCK them here.', 'cscli decisions list', 'CrowdSec is like a neighborhood watch program for the whole internet.', 'Do you have to pay to contribute to the defense?', false, 'What is "Collective Intelligence"?', ['Learning from a large group of people', 'A smart computer', 'A secret book'], 0)
];

interface NeuralBuilderProps {
  isPremium: boolean;
  operatorName: string;
  onComplete: (cert: UserCertificate) => void;
  onExit: () => void;
  onUpdateOperatorName: (name: string) => void;
}

const NeuralBuilder: React.FC<NeuralBuilderProps> = ({ isPremium, operatorName, onComplete, onExit, onUpdateOperatorName }) => {
  const [section, setSection] = useState<'RED' | 'BLUE' | null>(null);
  const [activeTool, setActiveTool] = useState<ToolDeck | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [completedTools, setCompletedTools] = useState<Set<string>>(new Set());
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [showNameGate, setShowNameGate] = useState(false);
  const [tempName, setTempName] = useState(operatorName);

  const tools = section === 'RED' ? RED_TEAM_TOOLS : BLUE_TEAM_TOOLS;
  const currentCard = activeTool?.cards[cardIndex];

  const handleQuiz = async (choice: boolean | number) => {
    if (!currentCard?.quiz) return;
    
    const isCorrect = choice === currentCard.quiz.answer;
    if (isCorrect) {
      setFeedback({ msg: "Integrity Verified. Synchronization complete.", type: 'success' });
      setTimeout(async () => {
        setFeedback(null);
        if (cardIndex === 9) {
          const newSet = new Set(completedTools);
          newSet.add(activeTool!.id);
          setCompletedTools(newSet);
          
          if (newSet.size >= 15) {
            // Need a name before cert generation
            if (!operatorName) {
              setShowNameGate(true);
            } else {
              initiateCertGeneration(operatorName);
            }
          }
          setActiveTool(null);
          setCardIndex(0);
        } else {
          setCardIndex(prev => prev + 1);
        }
      }, 1500);
    } else {
      setFeedback({ msg: currentCard.quiz.explanation, type: 'error' });
      setTimeout(() => {
        setFeedback(null);
        setCardIndex(0); // Reset on fail
      }, 2500);
    }
  };

  const initiateCertGeneration = async (name: string) => {
    setIsGeneratingCert(true);
    try {
      const cert = await certificateService.generateCertificate({
        fullName: name,
        title: section === 'RED' ? 'Red Operative' : 'Blue Architect',
        theater: section!
      });
      onComplete(cert);
    } catch (e) {
      console.error("Accreditation synthesis failure", e);
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim().length > 2) {
      onUpdateOperatorName(tempName.trim());
      setShowNameGate(false);
      initiateCertGeneration(tempName.trim());
    }
  };

  if (showNameGate) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 space-y-10 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-light text-white uppercase tracking-tighter">Identity Confirmation Required</h2>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest max-w-md mx-auto">
            The Director of Research requires your verified legal name for permanent accreditation records.
          </p>
        </div>
        <form onSubmit={handleNameSubmit} className="w-full max-w-sm space-y-6">
          <input 
            type="text" 
            autoFocus
            placeholder="FULL LEGAL NAME"
            className="w-full bg-black border border-zinc-800 p-5 text-center font-mono text-xs tracking-widest text-white outline-none focus:border-white transition-all uppercase rounded-xl"
            value={tempName}
            onChange={e => setTempName(e.target.value)}
          />
          <button className="w-full bg-white text-black py-5 font-mono text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-200 transition-all rounded-xl shadow-xl">Confirm Identity</button>
        </form>
      </div>
    );
  }

  if (isGeneratingCert) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 space-y-12 animate-in fade-in duration-1000 text-center">
        <div className="relative">
          <div className="w-24 h-24 border border-zinc-800 rounded-full animate-pulse flex items-center justify-center">
             <div className="w-16 h-16 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="absolute -top-4 -right-4 bg-white text-black text-[9px] font-mono px-3 py-1 uppercase tracking-widest">Mastery Detected</div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-light uppercase tracking-[0.2em] text-white">Synthesizing_Credential</h2>
          <div className="flex flex-col items-center gap-2">
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Office of the Director of Research: Authentication in progress...</p>
            <div className="w-64 h-[1px] bg-zinc-900 mt-4 overflow-hidden relative">
               <div className="absolute inset-0 bg-white animate-[loading_3s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
        <style>{`@keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 space-y-16 animate-in fade-in duration-1000">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-light tracking-tighter uppercase text-white">Select_Theater</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Cyber Intelligence Lab // Curated by the Director of Research</p>
        </div>
        <div className="flex flex-col md:flex-row gap-12">
          <button onClick={() => setSection('RED')} className="group w-80 h-96 border border-zinc-900 bg-black hover:border-red-900/50 transition-all rounded-[3rem] overflow-hidden flex flex-col items-center justify-center space-y-8 relative shadow-2xl">
            <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-6xl group-hover:scale-110 transition-transform">🏴‍☠️</span>
            <div className="text-center">
              <h3 className="text-2xl font-light text-zinc-100 uppercase tracking-tight">Red Team</h3>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-2">Offensive Mastery Sequence</p>
            </div>
          </button>
          <button onClick={() => setSection('BLUE')} className="group w-80 h-96 border border-zinc-900 bg-black hover:border-blue-900/50 transition-all rounded-[3rem] overflow-hidden flex flex-col items-center justify-center space-y-8 relative shadow-2xl">
            <div className="absolute inset-0 bg-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-6xl group-hover:scale-110 transition-transform">🛡️</span>
            <div className="text-center">
              <h3 className="text-2xl font-light text-zinc-100 uppercase tracking-tight">Blue Team</h3>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-2">Defensive Architecture Hub</p>
            </div>
          </button>
        </div>
        <button onClick={onExit} className="text-zinc-700 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors">Abort_Sequence</button>
      </div>
    );
  }

  if (activeTool && currentCard) {
    const isRed = section === 'RED';
    return (
      <div className={`h-full flex flex-col items-center justify-center p-6 md:p-12 transition-all duration-700 ${isRed ? 'bg-red-950/5' : 'bg-blue-950/5'}`}>
        <div className="w-full max-w-2xl space-y-8">
          <header className="flex justify-between items-end border-b border-zinc-900 pb-4">
            <div>
              <span className={`text-[9px] font-mono uppercase tracking-[0.4em] ${isRed ? 'text-red-500' : 'text-blue-500'}`}>{section}_NODE // {activeTool.name}</span>
              <h2 className="text-2xl font-light text-white uppercase tracking-tighter mt-1">{currentCard.title}</h2>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Verification {cardIndex + 1} / 10</span>
              <div className="flex gap-1 mt-2">
                {Array.from({length: 10}).map((_, i) => (
                  <div key={i} className={`h-1 w-4 rounded-full transition-all duration-500 ${i <= cardIndex ? (isRed ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]') : 'bg-zinc-900'}`} />
                ))}
              </div>
            </div>
          </header>

          <div className={`relative min-h-[480px] border border-zinc-800 bg-zinc-950/90 p-10 md:p-16 flex flex-col justify-center items-center text-center shadow-2xl rounded-[3rem] overflow-hidden group transition-all duration-500 ${isRed ? 'hover:shadow-red-900/20' : 'hover:shadow-blue-900/20'}`}>
            <div className={`absolute top-0 left-0 w-2 h-full ${isRed ? 'bg-red-900/40' : 'bg-blue-900/40'}`}></div>
            
            {feedback ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className={`text-6xl ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {feedback.type === 'success' ? '✓' : '⚠️'}
                </div>
                <p className={`text-xl font-mono uppercase tracking-widest ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback.msg}
                </p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                <p className="text-lg md:text-xl font-light text-zinc-200 leading-relaxed italic">
                  {currentCard.content}
                </p>

                {currentCard.codeSnippet && (
                  <div className="w-full text-left">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2 block">{currentCard.type === 'PSEUDOCODE' ? 'Human_Logic' : 'Technical_Snippet'}</span>
                    <pre className={`p-6 rounded-[2rem] font-mono text-sm overflow-x-auto border ${isRed ? 'bg-red-950/20 border-red-900/40 text-red-100' : 'bg-blue-950/20 border-blue-900/40 text-blue-100'}`}>
                      {currentCard.codeSnippet}
                    </pre>
                  </div>
                )}

                {currentCard.quiz ? (
                  <div className="w-full space-y-6 pt-4">
                    <p className="text-lg font-medium text-white">{currentCard.quiz.question}</p>
                    {currentCard.quiz.isTrueFalse ? (
                      <div className="flex gap-4 justify-center">
                        <button onClick={() => handleQuiz(true)} className="flex-1 bg-white text-black py-4 rounded-2xl font-mono text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all">True</button>
                        <button onClick={() => handleQuiz(false)} className="flex-1 border border-zinc-800 text-white py-4 rounded-2xl font-mono text-xs uppercase tracking-widest hover:border-white transition-all">False</button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {currentCard.quiz.options?.map((opt, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleQuiz(i)} 
                            className="w-full text-left p-4 rounded-2xl border border-zinc-800 text-zinc-400 hover:border-zinc-100 hover:text-white transition-all font-mono text-[11px] uppercase tracking-tight"
                          >
                            {i + 1}. {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => setCardIndex(prev => prev + 1)}
                    className={`bg-white text-black py-4 px-12 rounded-2xl font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-xl active:scale-95`}
                  >
                    Validate & Advance
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-700 uppercase tracking-widest px-4">
            <button onClick={() => setActiveTool(null)} className="hover:text-white transition-colors">← ABORT_UNIT</button>
            <div className="text-zinc-800">Uplink Active // Director Monitoring</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full p-8 md:p-12 overflow-y-auto transition-all duration-1000 ${section === 'RED' ? 'bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.03)_0%,transparent_100%)]' : 'bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.03)_0%,transparent_100%)]'}`}>
      <div className="max-w-6xl mx-auto space-y-12 pb-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-10">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <button onClick={() => setSection(null)} className="text-[10px] font-mono text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">← Return_to_Select</button>
              <div className={`h-[1px] w-6 ${section === 'RED' ? 'bg-red-900' : 'bg-blue-900'}`} />
              <span className={`text-[10px] font-mono uppercase tracking-[0.4em] ${section === 'RED' ? 'text-red-500' : 'text-blue-500'}`}>{section}_OPERATIONS</span>
            </div>
            <h1 className="text-4xl font-light text-white uppercase tracking-tighter">Cyber_Intelligence_Lab</h1>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Director's Clearance Status</p>
             <div className="flex gap-1.5">
                {Array.from({length: 15}).map((_, i) => (
                  <div key={i} className={`w-5 h-1.5 rounded-full transition-all duration-500 ${completedTools.size > i ? (section === 'RED' ? 'bg-red-500' : 'bg-blue-500') : 'bg-zinc-900'}`} />
                ))}
             </div>
             <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter mt-2">{completedTools.size} / 15 Authentic Units Mastered</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool)}
              className={`text-left border p-6 flex flex-col justify-between h-56 transition-all duration-500 group relative rounded-[2rem] overflow-hidden ${completedTools.has(tool.id) ? 'border-zinc-800 opacity-40 grayscale' : 'border-zinc-900 bg-zinc-950/20 hover:border-zinc-600 shadow-xl'}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${section === 'RED' ? 'bg-red-900' : 'bg-blue-900'}`}></div>
              <div>
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3 block">ID: {tool.id}</span>
                <h3 className="text-lg font-light text-zinc-100 uppercase leading-tight group-hover:tracking-tight transition-all">{tool.name}</h3>
                <p className="text-[10px] text-zinc-500 mt-2 font-light line-clamp-3 italic">"{tool.shortDesc}"</p>
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-zinc-700 group-hover:text-zinc-400 pt-4 border-t border-zinc-900">
                <span>{completedTools.has(tool.id) ? 'AUTHENTICATED' : 'INITIATE'}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeuralBuilder;
