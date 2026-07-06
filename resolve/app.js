/* ============================================================
   O CASO DA ESTRELA DO MAR — portal /resolve
   Modelo: UM código de caso desbloqueia todos os testemunhos.
   As pistas físicas estão no papel; as digitais são os testemunhos.
   100% no navegador (GitHub Pages).
   ============================================================ */

const CASE_CODE = "ESTRELA42";           // impresso como "ESTRELA-42" na Folha de Entrada
const norm = s => (s||"").toUpperCase().replace(/[^A-Z0-9]/g,"");

const el = html => { const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; };

/* ---------- Dados: os testemunhos ---------- */
const TESTEMUNHOS = [
  { slug:"rui", nome:"Rui Gelado", papel:"Dono da geladaria", emoji:"🍦", num:"969 555 121", lines:[
    ["Rui","Estou? É da geladaria O Cone Feliz! Ontem à noite vendi gelados no jardim até tarde, mas fechei a carrinha às nove e meia — tenho o recibo!"],
    ["Rui","Fui-me logo embora. Ah, e uma coisa: quando estava a arrumar, vi o Nando a passar com um escadote grande, em direção ao coreto. Achei estranho àquela hora…"],
  ]},
  { slug:"fina", nome:"Dona Fina Letra", papel:"Bibliotecária", emoji:"📚", num:"969 555 208", lines:[
    ["Fina","Biblioteca de Vila Solmar, boa tarde. Sim, eu digo e repito: aquela Estrela devia estar num museu, bem guardada!"],
    ["Fina","Tem cem anos, é frágil — já tinha uma ponta rachada há que tempos. Mas ontem estive na biblioteca até à meia-noite, no Serão de Contos. Está tudo no mural da vila."],
  ]},
  { slug:"beatriz", nome:"Beatriz Vaga", papel:"Campeã do ano passado", emoji:"🏆", num:"969 555 654", lines:[
    ["Beatriz","Sim, este ano a Estrela ia ser minha, admito que queria muito ganhar. Mas eu não lhe toquei!"],
    ["Beatriz","Estive a noite toda em direto nas redes a treinar — das oito da noite à uma da manhã, sem parar. Podem ver no mural, está lá tudo com as horas."],
  ]},
  { slug:"toze", nome:"Tó Zé Maré", papel:"Pescador reformado", emoji:"🎣", num:"969 555 337", lines:[
    ["Tó Zé","Quê? Quem fala? Ah… a Brigada. Onde é que eu estive? Fui à pesca, ora essa! Saí com o barco e só voltei de madrugada."],
    ["Tó Zé","Não vi nada, nem ninguém. Foi o que eu disse. Agora tenho que ir. Adeus!"],
  ]},
  { slug:"nando", nome:"Nando Fios", papel:"Eletricista da festa", emoji:"💡", num:"969 555 490", lines:[
    ["Nando","Es-estou? Ah… olá. Sim, montei as luzes do coreto ontem… quer dizer, um bocadinho. Depois fui-me logo embora."],
    ["Nando","Não toquei em nada! A Estrela estava lá quando eu saí, juro! … O quê? Ah, pois… tenho de desligar, está a tocar outro telefone. Adeus!"],
  ]},
];

/* ---------- Dados: resolver o caso ---------- */
const PERGUNTAS = [
  { q:"Quem levou a Estrela do Mar?",
    opts:["O Rui, o geladeiro","O Nando, o eletricista","A Dona Fina, a bibliotecária"], ok:1 },
  { q:"Como é que aconteceu?",
    opts:["Roubou-a para a vender","Foi um acidente — derrubou-a do escadote","Escondeu-a por inveja"], ok:1 },
  { q:"Porquê?",
    opts:["Para a reparar em segredo e salvar a festa","Para ganhar a festa deste ano","Para a guardar num museu"], ok:0 },
  { q:"Onde está a Estrela agora?",
    opts:["Escondida no farol","Na oficina do Tó Zé, no porto","No fundo do mar"], ok:1 },
];

/* ---------- Render ---------- */
function briefing(){
  return `<div class="card reveal">
    <div class="kicker">Rádio da Brigada</div>
    <div class="inspetora">
      <div class="avatar">👮‍♀️</div>
      <div class="bubble">
        <div class="who">Inspetora Aurora Bicho</div>
        <h3 style="font-family:var(--font-serif);margin:.2em 0 .4em">Bem-vindos à Brigada!</h3>
        <p>Olá, detetives! Esta manhã a <b>Estrela do Mar</b> — o troféu dourado de 100 anos — <b>desapareceu do coreto</b>. Sem ela, não há Festa do Mar!</p>
        <p>Têm as <b>provas em papel</b> à vossa frente e, aqui em baixo, os <b>testemunhos</b> dos 5 suspeitos. Cruzem tudo: comparem o que cada um diz com as provas e descubram <b>quem mente</b>.</p>
        <p>Quando tiverem a certeza, desçam até <b>«Resolver o Caso»</b>. Boa sorte! 🔍</p>
      </div>
    </div>
  </div>`;
}

function testemunho(t){
  const id="au-"+t.slug;
  const tr=t.lines.map(l=>`<div><b>${l[0]}:</b> ${l[1]}</div>`).join("");
  return `<div class="card reveal">
    <div class="kicker">Testemunho gravado</div>
    <audio id="${id}" src="audio/${t.slug}.mp3" preload="none"></audio>
    <div class="call">
      <button class="play" data-au="${id}">▶</button>
      <div><div class="who">${t.emoji} ${t.nome}</div><div class="num">📞 ${t.num} · ${t.papel}</div></div>
    </div>
    <div class="transcript">${tr}</div>
    <p class="audio-note" data-for="${id}" style="font-size:12.5px;color:#9fb6c9;margin:.6em 0 0">🎧 Carrega em ▶ para ouvir (ou lê a transcrição).</p>
  </div>`;
}

function solveCard(){
  const qs=PERGUNTAS.map((p,i)=>`
    <div class="qz" data-q="${i}">
      <div class="qz-h">${i+1}. ${p.q}</div>
      ${p.opts.map((o,j)=>`<label class="qz-o"><input type="radio" name="q${i}" value="${j}"><span>${o}</span></label>`).join("")}
    </div>`).join("");
  return `<div class="card reveal" id="solve" style="border-color:var(--brass)">
    <div class="kicker">Resolver o caso</div>
    <h3>🕵️ A acusação final</h3>
    <p style="margin-bottom:10px">Já decidiram? Respondam às 4 perguntas e carreguem em <b>Acusar!</b></p>
    ${qs}
    <button id="accuse" class="btn" style="margin-top:6px">Acusar!</button>
    <div id="solve-msg" class="msg"></div>
  </div>`;
}

function finale(){
  return `<div class="card reveal finale">
    <div class="kicker">Caso resolvido</div>
    <div class="confetti">🎉⭐🎉</div>
    <h3 style="font-family:var(--font-serif);font-size:26px;color:#fff">A verdade sobre a Estrela do Mar</h3>
    <p style="text-align:left">Não houve ladrão nenhum! Ontem à noite, o <b>Nando</b> estava em cima do escadote a acabar as luzes quando, sem querer, <b>derrubou a Estrela</b> — e partiu-se-lhe uma ponta. Cheio de medo de estragar a festa, levou-a a correr ao <b>Tó Zé</b>, que em novo foi <b>latoeiro</b> e a sabia arranjar.</p>
    <p style="text-align:left">Passaram a noite na <b>oficina do porto</b> a reparar a Estrela em segredo. O Tó Zé até mentiu sobre a "pesca" para guardar o segredo. E hoje… a Estrela voltou ao coreto <b>mais brilhante que nunca</b>! ✨</p>
    <div class="diploma" style="margin-top:18px">
      <div class="confetti">🕵️‍♂️🏅🕵️‍♀️</div>
      <h3>DIPLOMA DE DETETIVE</h3>
      <p style="color:var(--ink-soft)">A Brigada resolveu <b>O Caso da Estrela do Mar</b> e salvou a Festa do Mar de Vila Solmar. Parabéns, verdadeiros heróis!</p>
    </div>
    <p style="margin-top:16px"><b>A Festa do Mar está salva. Obrigada, Brigada!</b> — Inspetora Aurora Bicho</p>
  </div>`;
}

/* ---------- Motor ---------- */
const stage=document.getElementById("stage");
const gate=document.getElementById("gate");
const input=document.getElementById("code");
const msg=document.getElementById("msg");

function openCase(){
  gate.classList.add("unlocked");
  stage.innerHTML="";
  stage.appendChild(el(briefing()));
  const head=el(`<div class="section-head reveal"><span>📞 Testemunhos dos suspeitos</span><small>Ouve todos e compara com as provas em papel</small></div>`);
  stage.appendChild(head);
  TESTEMUNHOS.forEach(t=>stage.appendChild(el(testemunho(t))));
  stage.appendChild(el(solveCard()));
  localStorage.setItem("solmar_unlocked","1");
}

function tryCode(){
  const raw=norm(input.value);
  if(!raw) return;
  if(raw===CASE_CODE){
    msg.className="msg ok"; msg.textContent="✔ Caso desbloqueado! Boa investigação.";
    openCase();
    stage.scrollIntoView({behavior:"smooth",block:"start"});
  } else {
    msg.className="msg err"; msg.textContent="❌ Código errado. Confirma na Folha de Entrada do teu jogo.";
  }
}

document.getElementById("go").addEventListener("click",tryCode);
input.addEventListener("keydown",e=>{ if(e.key==="Enter") tryCode(); });

/* Resolver o caso + áudio (delegação) */
stage.addEventListener("click",e=>{
  // áudio
  const b=e.target.closest(".play");
  if(b){
    const audio=document.getElementById(b.dataset.au);
    const note=document.querySelector(`.audio-note[data-for="${b.dataset.au}"]`);
    if(audio){
      if(audio.paused){
        audio.play().then(()=>b.textContent="⏸").catch(()=>{ if(note) note.textContent="🎧 Áudio ainda não disponível — lê a transcrição."; });
        audio.onended=()=>b.textContent="▶";
      } else { audio.pause(); b.textContent="▶"; }
    }
    return;
  }
  // acusar
  if(e.target.id==="accuse"){
    const sm=document.getElementById("solve-msg");
    let todas=true, certas=true;
    PERGUNTAS.forEach((p,i)=>{
      const sel=document.querySelector(`input[name="q${i}"]:checked`);
      if(!sel){ todas=false; } else if(+sel.value!==p.ok){ certas=false; }
    });
    if(!todas){ sm.className="msg err"; sm.textContent="Respondam a todas as perguntas primeiro!"; return; }
    if(!certas){ sm.className="msg err"; sm.textContent="Hmm… ainda não é bem assim. Voltem a analisar as provas e os testemunhos!"; return; }
    sm.className="msg ok"; sm.textContent="✔ Acusação certeira!";
    document.getElementById("accuse").disabled=true;
    stage.appendChild(el(finale()));
    stage.lastElementChild.scrollIntoView({behavior:"smooth",block:"center"});
  }
});

/* Se já tinha desbloqueado antes, reabre. Pré-visualização: ?code=ESTRELA-42 */
const params=new URLSearchParams(location.search);
const pv=params.get("code");
if(pv){ input.value=pv; tryCode(); }
else if(localStorage.getItem("solmar_unlocked")==="1"){ openCase(); }
