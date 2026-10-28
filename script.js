(() => {
            "use strict";
            const canvas = document.querySelector("#game"), ctx = canvas.getContext("2d");
            const W = 800, H = 500, T = 25, LEVEL_SCALE = 1.5, WORLD_W = W * LEVEL_SCALE, $ = id => document.getElementById(id);
            let cameraX = 0;
            const C = {
                bg: "#101c28", white: "#e8f1d4", mint: "#a8e6cf", pink: "#ff536b",
                yellow: "#ffd166", blue: "#5b8cff", purple: "#a28aff",
                gray: "#64788a", dark: "#243447"
            };
            const UNSTABLE_WARNING_TIME = 20, UNSTABLE_DURATION = 55, UNSTABLE_WIDTH = 2;
            const LEVEL_NAMES = ["BOOT SECTOR", "CACHE MISS", "FIREWALL", "STACK OVERFLOW", "DARK NETWORK", "KERNEL PANIC", "MECÂNICA - SOBRECARGA", "CAMPO DE GRAVIDADE", "REDE FANTASMA", "NÚCLEO FINAL", "TUTORIAL"];
            const TUTORIAL_LEVEL_INDEX = 10;
            const LEVELS = [
                {
                    spawn: [2, 16], exit: [29, 16], platforms: [
                        [0, 18, 32, 2, 0], [0, 18, 32, 2, 1], [2, 15, 6, 1, 0], [9, 14, 5, 1, 1], [15, 12, 5, 1, 0], [21, 10, 5, 1, 1], [26, 7, 4, 1, 0], [7, 11, UNSTABLE_WIDTH, 1, 2, "unstable"], [23, 5, UNSTABLE_WIDTH, 1, 2, "unstable"]],
                    bits: [[7, 13], [17, 10], [27, 5]], hazards: [[11, 17, 2, 1, 2], [20, 17, 2, 1, 2]]
                },
                {
                    spawn: [2, 16], exit: [29, 4], platforms: [
                        [0, 18, 7, 2, 0], [0, 18, 7, 2, 1], [7, 15, 4, 1, 0], [12, 12, 4, 1, 1], [18, 9, 4, 1, 0], [24, 6, 5, 1, 1], [9, 8, UNSTABLE_WIDTH, 1, 2, "moving"], [15, 6, UNSTABLE_WIDTH, 1, 2, "unstable"], [20, 13, UNSTABLE_WIDTH, 1, 2, "moving"], [22, 4, UNSTABLE_WIDTH, 1, 2, "unstable"]],
                    bits: [[9, 13], [19, 7], [27, 4]], hazards: [[13, 17, 2, 1, 2], [22, 17, 2, 1, 2]]
                },
                {
                    spawn: [2, 16], exit: [29, 4], platforms: [
                        [0, 18, 32, 2, 0], [0, 18, 32, 2, 1], [2, 15, 5, 1, 0], [8, 12, 4, 1, 1], [14, 9, 4, 1, 0], [20, 6, 4, 1, 1], [26, 4, 4, 1, 0], [7, 9, UNSTABLE_WIDTH, 1, 2, "unstable"], [13, 6, UNSTABLE_WIDTH, 1, 2, "unstable"], [19, 12, UNSTABLE_WIDTH, 1, 2, "moving"], [23, 9, UNSTABLE_WIDTH, 1, 2, "unstable"]],
                    bits: [[9, 10], [21, 4], [27, 2]], hazards: [[5, 17, 2, 1, 2], [16, 17, 3, 1, 2], [25, 17, 2, 1, 2]]
                },
                {
                    spawn: [2, 16], exit: [29, 3], platforms: [
                        [0, 18, 6, 2, 0], [0, 18, 6, 2, 1], [6, 15, 4, 1, 0], [12, 12, 4, 1, 1], [18, 9, 4, 1, 0], [24, 6, 5, 1, 1], [14, 7, UNSTABLE_WIDTH, 1, 2, "unstable"], [19, 5, UNSTABLE_WIDTH, 1, 2, "moving"], [26, 3, UNSTABLE_WIDTH, 1, 2, "unstable"], [8, 10, UNSTABLE_WIDTH, 1, 2, "unstable"]],
                    bits: [[8, 13], [20, 7], [27, 2]], hazards: [[10, 17, 2, 1, 2], [17, 17, 2, 1, 2], [24, 17, 2, 1, 2]]
                },
                {
                    spawn: [2, 16], exit: [29, 3], platforms: [
                        [0, 18, 32, 2, 0], [0, 18, 32, 2, 1], [2, 15, 5, 1, 0], [8, 13, 4, 1, 1], [14, 10, 4, 1, 0], [20, 7, 4, 1, 1], [26, 4, 4, 1, 0], [7, 9, UNSTABLE_WIDTH, 1, 2, "moving"], [12, 6, UNSTABLE_WIDTH, 1, 2, "unstable"], [18, 13, UNSTABLE_WIDTH, 1, 2, "unstable"], [23, 10, UNSTABLE_WIDTH, 1, 2, "moving"], [17, 4, UNSTABLE_WIDTH, 1, 2, "unstable"]],
                    bits: [[9, 11], [21, 5], [27, 2]], hazards: [[5, 17, 2, 1, 2], [15, 17, 2, 1, 2], [25, 17, 2, 1, 2]]
                },
                {
                    spawn: [2, 16], exit: [29, 3], platforms: [
                        [0, 18, 32, 2, 0], [0, 18, 32, 2, 1], [2, 15, 4, 1, 0], [7, 12, 4, 1, 1], [12, 9, 4, 1, 0], [17, 6, 4, 1, 1], [23, 9, 3, 1, 0], [27, 4, 4, 1, 1], [6, 8, UNSTABLE_WIDTH, 1, 2, "unstable"], [11, 5, UNSTABLE_WIDTH, 1, 2, "moving"], [17, 12, UNSTABLE_WIDTH, 1, 2, "unstable"], [22, 6, UNSTABLE_WIDTH, 1, 2, "unstable"], [25, 13, UNSTABLE_WIDTH, 1, 2, "moving"], [20, 3, UNSTABLE_WIDTH, 1, 2, "unstable"]],
                    bits: [[8, 10], [18, 4], [28, 2]], hazards: [[5, 17, 2, 1, 2], [13, 17, 2, 1, 2], [21, 17, 2, 1, 2], [28, 17, 2, 1, 2]]
                },
                {
                    // Fase 7: lasers temporizados; REAL e GLITCH têm barreiras alternadas.
                    spawn: [2, 16], exit: [29, 4], platforms: [
                        [0, 18, 8, 2, 0], [0, 18, 8, 2, 1], [8, 15, 4, 1, 0], [12, 12, 4, 1, 1],
                        [17, 10, 4, 1, 0], [22, 7, 4, 1, 1], [27, 4, 4, 1, 0],
                        [6, 12, UNSTABLE_WIDTH, 1, 2, "unstable"], [15, 8, UNSTABLE_WIDTH, 1, 2, "moving"], [23, 11, UNSTABLE_WIDTH, 1, 2, "unstable"]
                    ],
                    bits: [[9, 12], [18, 7], [28, 2]],
                    hazards: [
                        [8.4, 12, .18, 4, 0, "laser", 50, 180, 112],
                        [8.9, 12, .18, 4, 1, "laser", 0, 180, 112],
                        [15.2, 9, .18, 4, 1, "laser", 20, 160, 96],
                        [15.7, 9, .18, 4, 0, "laser", 96, 160, 96],
                        [22.4, 6, .18, 4, 0, "laser", 55, 150, 88],
                        [22.9, 6, .18, 4, 1, "laser", 118, 150, 88],
                        [25, 17, 2, 1, 2]
                    ]
                },
                {
                    // Fase 8: plataformas móveis atravessam um campo de gravidade instável.
                    spawn: [2, 16], exit: [29, 4], platforms: [
                        [0, 18, 7, 2, 0], [0, 18, 7, 2, 1], [6, 15, 4, 1, 0], [11, 12, 4, 1, 1],
                        [16, 9, 4, 1, 0], [22, 6, 4, 1, 1], [27, 4, 4, 1, 0],
                        [8, 11, 3, 1, 2, "moving"], [14, 7, 3, 1, 2, "moving"], [20, 12, 3, 1, 2, "unstable"], [25, 9, 2, 1, 2, "moving"]
                    ],
                    bits: [[8, 12], [18, 6], [28, 2]], hazards: [[9, 17, 2, 1, 1], [17, 17, 2, 1, 0], [24, 17, 2, 1, 1]]
                },
                {
                    // Fase 9: plataformas alternadas e passagens estreitas pela rede fantasma.
                    spawn: [2, 16], exit: [29, 3], platforms: [
                        [0, 18, 6, 2, 0], [0, 18, 6, 2, 1], [5, 15, 4, 1, 1], [9, 12, 4, 1, 0],
                        [13, 9, 4, 1, 1], [17, 6, 4, 1, 0], [21, 9, 3, 1, 1], [25, 6, 4, 1, 0], [28, 3, 3, 1, 1],
                        [7, 10, 2, 1, 2, "unstable"], [12, 6, 2, 1, 2, "moving"], [18, 12, 2, 1, 2, "unstable"], [23, 4, 2, 1, 2, "moving"]
                    ],
                    bits: [[7, 12], [18, 3], [27, 3]], hazards: [[6, 17, 2, 1, 0], [14, 17, 2, 1, 1], [22, 17, 2, 1, 0], [27, 17, 2, 1, 1]]
                },
                {
                    // Fase 10: percurso final com plataformas móveis, instáveis e riscos nas duas realidades.
                    spawn: [2, 16], exit: [29, 3], platforms: [
                        [0, 18, 5, 2, 0], [0, 18, 5, 2, 1], [4, 15, 4, 1, 0], [8, 12, 4, 1, 1],
                        [12, 9, 4, 1, 0], [16, 6, 4, 1, 1], [20, 9, 4, 1, 0], [24, 6, 3, 1, 1], [28, 3, 3, 1, 0],
                        [6, 11, 2, 1, 2, "unstable"], [11, 6, 2, 1, 2, "moving"], [15, 12, 2, 1, 2, "unstable"], [19, 4, 2, 1, 2, "moving"], [23, 11, 2, 1, 2, "unstable"], [26, 4, 2, 1, 2, "moving"]
                    ],
                    bits: [[6, 12], [17, 3], [28, 1]], hazards: [[5, 17, 2, 1, 2], [12, 17, 2, 1, 0], [18, 17, 2, 1, 1], [24, 17, 2, 1, 2], [29, 17, 2, 1, 2]]
                },
                {
                    // Tutorial: chão contínuo e compartilhado pelas duas realidades.
                    spawn: [2, 16], exit: [27, 16], platforms: [
                        [0, 18, 32, 2, 2],
                        [3, 14, 3, 1, 0], [9, 14, 3, 1, 1], [15, 14, 3, 1, 0], [21, 14, 3, 1, 1],
                        [7, 11, 2, 1, 2, "unstable"]
                    ],
                    bits: [[4, 12], [11, 12], [19, 12]], hazards: []
                }
            ];
            let tutorialMode = false;
            let overlayAction = null;
            let level = 0, lives = 3, score = 0, bitsCollected = 0, reality = 0, frame = 0, state = "menu", message = "", messageTimer = 0, shake = 0, keys = {}, particles = [], player = null, platforms = [], hazards = [], bits = [], exit = null, wasJump = false;
            const LEVEL_TIME_SECONDS = [30, 27, 24, 21, 18, 16, 21, 20, 19, 18, 999];
            let timeLeft = 50 * 60, entity = null;

            function box(x, y, w, h, color) {
                ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
            }
            function glow(x, y, w, h, color, blur = 12) {
                ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = blur; box(x, y, w, h, color); ctx.restore();
            }
            function label(s, x, y, size = 12, color = C.white) {
                ctx.font = `bold ${size}px monospace`; ctx.fillStyle = color; ctx.fillText(s, x, y);
            }
            function say(s, t = 90) { message = s; messageTimer = t; }
            function solid(p) { return p.type === "normal" || p.type === "unstable" || p.type === "moving"; }
            function active(p) { return p.phase === 2 || p.phase === reality; }
            function hazardActive(h) {
                const inReality = h.phase === 2 || h.phase === reality;
                const inCycle = h.kind !== "laser" || !h.cycle || (frame + h.offset) % h.cycle < h.onFrames;
                return inReality && inCycle;
            }
            function burst(x, y, color, n = 10) {
                for (let i = 0; i < n; i++)particles.push({ x, y, vx: (Math.random() - .5) * 5, vy: (Math.random() - .5) * 5, life: 18 + Math.random() * 18, color, size: 2 + Math.random() * 3 });
            }
            function updateHUD() {
                $("lv").textContent = tutorialMode ? "T" : level + 1; $("bits").textContent = bitsCollected; $("lives").textContent = lives; $("score").textContent = score; $("timer").textContent = Math.ceil(timeLeft / 60);
            }
            function loadLevel(n) {
                level = n; reality = 0; bitsCollected = 0; document.body.classList.remove("entity-active"); timeLeft = LEVEL_TIME_SECONDS[n] * 60; entity = null;
                if (tutorialMode) timeLeft = 999 * 60;
                const d = LEVELS[n];
                platforms = d.platforms.map((a, i) => ({ x: a[0] * T * LEVEL_SCALE, y: a[1] * T, w: a[2] * T * LEVEL_SCALE, h: a[3] * T, phase: a[4], type: a[5] || "normal", id: i, originX: a[0] * T * LEVEL_SCALE, originY: a[1] * T, timer: 0, warning: false, dx: 0, dy: 0, offset: Math.random() * 10, cooldown: 0 }));
                hazards = d.hazards.map(a => ({ x: a[0] * T * LEVEL_SCALE, y: a[1] * T, w: a[2] * T, h: a[3] * T, phase: a[4], kind: a[5] || "spike", offset: a[6] || 0, cycle: a[7] || 0, onFrames: a[8] || 0 }));
                bits = d.bits.map((a, i) => ({ x: a[0] * T * LEVEL_SCALE, y: a[1] * T, got: false, phase: i * 2 }));
                exit = { x: d.exit[0] * T * LEVEL_SCALE, y: d.exit[1] * T, w: 24, h: 32 };
                player = { x: d.spawn[0] * T * LEVEL_SCALE, y: d.spawn[1] * T - 22, w: 18, h: 22, vx: 0, vy: 0, on: false, inv: 60, dir: 1, walk: 0, flip: 0 };
                cameraX = Math.max(0, Math.min(WORLD_W - W, player.x - W * 0.35));
                particles = []; updateHUD();
                say(n === 6 ? "LASERS EM CICLO: SHIFT ALTERNA AS BARREIRAS" : LEVEL_NAMES[n], n === 6 ? 180 : 120);
            }
            function overlay(title, desc, button, action = null) {
                $("title").textContent = title;
                $("desc").textContent = desc;
                $("desc").style.display = "none";
                $("start").textContent = button;
                $("menuButtons").style.display = "none";
                $("start").style.display = "inline-block";
                $("menuReturn").style.display = "none";
                $("menuHint").style.display = "none";
                $("menuExtra").style.display = "none";
                $("overlay").style.display = "flex";
                overlayAction = action;
            }
            function showMenu() {
                state = "menu"; tutorialMode = false; entity = null; document.body.classList.remove("entity-active");
                $("title").innerHTML = "GLITCH<br>///SHIFT";
                $("desc").textContent = "Alterne entre REAL e GLITCH. Colete 3 bits e encontre a saída.";
                $("menuExtra").textContent = "10 fases · Caso o tempo acabe, ELE vira ate voce.";
                $("menuButtons").style.display = "flex"; $("start").style.display = "none";
                $("menuHint").style.display = "block"; $("menuExtra").style.display = "block";
                $("overlay").style.display = "flex"; overlayAction = null;
            }
            function start() {
                tutorialMode = false; lives = 3; score = 0; frame = 0; state = "play"; wasJump = false; keys = {}; loadLevel(0); $("overlay").style.display = "none";
            }
            function startTutorial() {
                tutorialMode = true; lives = 99; score = 0; frame = 0; state = "play"; wasJump = false; keys = {};
                loadLevel(TUTORIAL_LEVEL_INDEX); $("overlay").style.display = "none"; say("TUTORIAL: COLETE OS 3 BITS", 180);
            }
            function showControls() {
                overlay("CONTROLES", `TECLADO
MOVIMENTAR  —  A e D
PULAR  —  BARRA DE ESPAÇO e W
TROCAR REALIDADE  —  SHIFT

OBJETIVO
Colete os 3 bits para desbloquear a saída.
Evite os perigos.

CELULAR
Use ◀ e ▶ para andar, PULAR para saltar e
TROCAR REALIDADE para alternar os mundos.`, "VOLTAR AO MENU", showMenu);
                $("desc").style.display = "block";
                $("desc").style.whiteSpace = "pre-line";
                $("desc").style.maxWidth = "560px";
                $("desc").style.margin = "18px auto 22px";
                $("desc").style.lineHeight = "1.65";
                $("desc").style.fontSize = "16px";
                $("desc").style.color = "#eaf3ff";
                $("panel").style.width = "min(620px, 100%)";
            }
            function die() {
                if (player.inv > 0) return;
                lives--; updateHUD(); burst(player.x + 9, player.y + 10, C.pink, 20); shake = 9;
                if (lives <= 0) {
                    state = "dead"; document.body.classList.remove("entity-active"); overlay("GAME OVER", "Suas vidas acabaram. Pontuação: " + score, "TENTAR NOVAMENTE ↻"); $("menuReturn").style.display = "block";
                } else {
                    const d = LEVELS[level]; player.x = d.spawn[0] * T * LEVEL_SCALE; player.y = d.spawn[1] * T - 22; cameraX = Math.max(0, Math.min(WORLD_W - W, player.x - W * 0.35)); player.vx = player.vy = 0; player.inv = 75; say("REINICIANDO PROCESSO", 80);
                }
            }
            function shift() {
                if (state !== "play") return;
                reality = 1 - reality; burst(player.x + 9, player.y + 11, reality ? C.blue : C.mint, 22); player.flip = 12; shake = 4; say(reality ? "REALIDADE GLITCH" : "REALIDADE REAL", 60);
            }
            function jump() {
                if (state !== "play" || !player.on) return;
                player.vy = -9.2; player.on = false; burst(player.x + 9, player.y + 22, C.yellow, 7);
            }
            function updatePlatforms() {
                for (const p of platforms) {
                    p.dx = 0; p.dy = 0;
                    if (p.type === "moving") {
                        const ox = p.x, oy = p.y; p.x = p.originX + Math.sin(frame * .025 + p.offset) * 42; p.y = p.originY + Math.sin(frame * .018 + p.offset) * 8; p.dx = p.x - ox; p.dy = p.y - oy;
                    }
                    if (p.type === "unstable" && active(p) && player && player.x < p.x + p.w && player.x + player.w > p.x && Math.abs(player.y + player.h - p.y) < 4 && player.vy >= 0 && p.timer === 0) p.timer = 1;
                    if (p.timer > 0) {
                        p.timer++;
                        if (p.timer > UNSTABLE_WARNING_TIME) p.warning = true;
                        if (p.timer > UNSTABLE_WARNING_TIME + UNSTABLE_DURATION) { p.timer = 0; p.warning = false; p.cooldown = 90; burst(p.x + p.w / 2, p.y, C.pink, 8); }
                    }
                    if (p.cooldown > 0) p.cooldown--;
                }
            }
            function update() {
                frame++; if (state !== "play") return;
                updatePlatforms();
                if (timeLeft > 0) {
                    timeLeft--;
                    if (timeLeft === 0) {
                        if (tutorialMode) {
                            timeLeft = 999 * 60;
                        } else {
                            entity = { x: player.x < WORLD_W / 2 ? WORLD_W - 42 : 8, y: 38, w: 36, h: 42, speed: 2.25 + level * .22, pulse: 0 };
                            document.body.classList.add("entity-active");
                            say("ALERTA: ENTIDADE DETECTOU VOCÊ!", 180);
                            burst(entity.x + entity.w / 2, entity.y + entity.h / 2, C.pink, 28);
                            shake = 7;
                        }
                    }
                    $("timer").textContent = Math.ceil(timeLeft / 60);
                }
                if (entity) {
                    entity.pulse++;
                    // A entidade acelera enquanto a perseguição continua, até um limite.
                    entity.speed = Math.min(4.0, entity.speed + 0.003);
                    const dx = (player.x + player.w / 2) - (entity.x + entity.w / 2);
                    const dy = (player.y + player.h / 2) - (entity.y + entity.h / 2);
                    const dist = Math.max(1, Math.hypot(dx, dy));
                    entity.x += dx / dist * entity.speed;
                    entity.y += dy / dist * entity.speed * .78;
                    entity.x = Math.max(-8, Math.min(WORLD_W - entity.w + 8, entity.x));
                    entity.y = Math.max(30, Math.min(H - entity.h, entity.y));
                    if (player.x < entity.x + entity.w && player.x + player.w > entity.x &&
                        player.y < entity.y + entity.h && player.y + player.h > entity.y) {
                        die();
                        if (state !== "play") return;
                    }
                }
                const axis = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
                player.vx = axis * 2.7; if (axis) { player.dir = axis; player.walk += .16; }
                const j = !!(keys.Space || keys.ArrowUp || keys.KeyW); if (j && !wasJump) jump(); wasJump = j;
                player.vy = Math.min(9, player.vy + .38); player.x = Math.max(0, Math.min(WORLD_W - player.w, player.x + player.vx));
                cameraX = Math.max(0, Math.min(WORLD_W - W, player.x - W * 0.35));
                const oldY = player.y; player.y += player.vy; player.on = false;
                for (const p of platforms) {
                    if (!active(p) || !solid(p) || p.cooldown > 0) continue;
                    if (player.x < p.x + p.w && player.x + player.w > p.x && oldY + player.h <= p.y + 5 && player.y + player.h >= p.y && player.vy >= 0) {
                        player.y = p.y - player.h; player.vy = 0; player.on = true;
                        if (p.type === "moving") { player.x += p.dx; player.y += p.dy; }
                        if (p.type === "unstable" && p.timer === 0) p.timer = 1;
                    }
                }
                if (player.y > H + 30) { die(); return; }
                for (const h of hazards) {
                    if (!hazardActive(h)) continue;
                    if (player.x < h.x + h.w && player.x + player.w > h.x && player.y < h.y + h.h && player.y + player.h > h.y) { die(); if (state !== "play") return; break; }
                }
                for (const b of bits) {
                    if (!b.got && player.x < b.x + 16 && player.x + player.w > b.x && player.y < b.y + 16 && player.y + player.h > b.y) {
                        b.got = true; bitsCollected++; score += 100; updateHUD(); burst(b.x + 7, b.y + 7, C.yellow, 16); say("BIT RECUPERADO +100", 50);
                    }
                }
                if (player.x < exit.x + exit.w && player.x + player.w > exit.x && player.y < exit.y + exit.h && player.y + player.h > exit.y) {
                    if (bitsCollected === 3) {
                        score += 250;
                        if (tutorialMode) {
                            state = "tutorialDone";
                            overlay("TUTORIAL CONCLUÍDO!", "Muito bem! Você aprendeu a andar, pular, alternar entre REAL e GLITCH e coletar os bits. Agora está pronto para as dez fases principais.", "VOLTAR AO MENU", showMenu);
                        } else if (level === 9) { state = "won"; overlay("SISTEMA RESTAURADO", "Você recuperou os fragmentos das dez fases! Pontuação: " + score, "JOGAR NOVAMENTE ↻"); }
                        else loadLevel(level + 1);
                        return;
                    } else say("FALTAM " + (3 - bitsCollected) + " BITS", 40);
                }
                if (player.inv > 0) player.inv--; if (player.flip > 0) player.flip--; if (shake > 0) shake *= .8; if (messageTimer > 0) messageTimer--;
                for (const p of particles) { p.x += p.vx; p.y += p.vy; p.vy += .08; p.life--; }
                particles = particles.filter(p => p.life > 0);
            }

            /* CENÁRIO: profundidade, estruturas de circuito e estrelas */
            function background() {
                const themes = [
                    { top: "#102b3d", mid: "#173d4b", low: "#25505a", accent: "#54e0c2", glow: "#57b8d5", ridge: "#173543" },
                    { top: "#24172f", mid: "#49304a", low: "#76505a", accent: "#ffb36b", glow: "#d87273", ridge: "#2b2035" },
                    { top: "#111c35", mid: "#263d61", low: "#52617c", accent: "#9dd9ff", glow: "#648bd0", ridge: "#202b46" },
                    { top: "#250d1c", mid: "#52172a", low: "#80263b", accent: "#ff596d", glow: "#e53758", ridge: "#351321" },
                    { top: "#131329", mid: "#29284e", low: "#44436a", accent: "#c19aff", glow: "#8057d4", ridge: "#201d39" },
                    { top: "#1b2028", mid: "#373b40", low: "#665343", accent: "#ffb34d", glow: "#da773b", ridge: "#282b31" },
                    { top: "#101d2d", mid: "#263c58", low: "#41617a", accent: "#77e5ff", glow: "#668af0", ridge: "#172c45" },
                    { top: "#0a1026", mid: "#17264b", low: "#2b4070", accent: "#b5a4ff", glow: "#5379dc", ridge: "#111e3e" },
                    { top: "#211222", mid: "#4c2037", low: "#765044", accent: "#ffcf6e", glow: "#ff694f", ridge: "#331b30" },
                    { top: "#102a32", mid: "#1d3944", low: "#315462", accent: "#a8e6cf", glow: "#5b8cff", ridge: "#20384a" }
                ];
                const theme = themes[level] || themes[0];
                const grad = ctx.createLinearGradient(0, 0, 0, H);
                grad.addColorStop(0, reality ? "#100c27" : theme.top);
                grad.addColorStop(.48, reality ? "#211936" : theme.mid);
                grad.addColorStop(1, reality ? "#30192f" : theme.low);
                box(0, 0, W, H, grad);
                const accent = reality ? "#b879ff" : theme.accent;

                const horizonGlow = ctx.createRadialGradient(W * .72, H * .47, 8, W * .72, H * .47, H * .42);
                horizonGlow.addColorStop(0, reality ? "#a243d044" : `${theme.glow}44`);
                horizonGlow.addColorStop(1, "#00000000");
                ctx.fillStyle = horizonGlow; ctx.fillRect(0, 0, W, H);
                ctx.save(); ctx.globalAlpha = reality ? .32 : .58;
                ctx.shadowColor = accent; ctx.shadowBlur = 28; ctx.fillStyle = reality ? "#8a4ac8" : theme.glow;
                ctx.beginPath(); ctx.arc(W * .72 - cameraX * .025, H * .42, 42 + Math.sin(frame * .025) * 2, 0, Math.PI * 2); ctx.fill();
                ctx.restore();

                // Grade tecnológica
                ctx.strokeStyle = reality ? "#5368b522" : "#72d6b522"; ctx.lineWidth = 1;
                for (let x = 0; x < W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 28); ctx.lineTo(x, H); ctx.stroke(); }
                for (let y = 30; y < H; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

                // Montanhas digitais ao fundo
                for (let layer = 0; layer < 3; layer++) {
                    ctx.fillStyle = layer === 0 ? "#20384a55" : layer === 1 ? "#172b3a88" : "#0b1825cc";
                    ctx.beginPath(); ctx.moveTo(0, H);
                    for (let x = 0; x <= W; x += 50) {
                        const yy = 300 + layer * 42 + Math.sin(x * .025 + layer * 3 + level) * 22 + Math.sin(x * .071 + layer) * 13;
                        ctx.lineTo(x, yy);
                    }
                    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
                }
                // Silhuetas em paralaxe criam um horizonte diferente em cada fase.
                ctx.save(); ctx.globalAlpha = reality ? .5 : .82;
                const skylineY = H * .69, drift = cameraX * .12;
                for (let i = -2; i < 18; i++) {
                    const bw = 46 + ((i * 17 + level * 11) % 34);
                    const bx = ((i * 73 - drift) % (W + 100) + W + 100) % (W + 100) - 55;
                    const bh = 48 + Math.abs((i * 37 + level * 19) % 125);
                    ctx.fillStyle = i % 2 ? "#0a1727bb" : "#14283bdd";
                    ctx.fillRect(bx, skylineY - bh, bw, bh + H - skylineY);
                    ctx.fillStyle = accent; ctx.globalAlpha = reality ? .2 : .42;
                    for (let wy = skylineY - bh + 12; wy < skylineY - 8; wy += 17) {
                        for (let wx = bx + 8; wx < bx + bw - 5; wx += 13) {
                            if ((Math.floor(wx + wy + i) % 4) === 0) ctx.fillRect(wx, wy, 3, 5);
                        }
                    }
                    ctx.globalAlpha = reality ? .5 : .82;
                }
                ctx.restore();

                // Marcos temáticos sutis no horizonte, sem alterar personagens, plataformas ou itens.
                ctx.save(); ctx.globalAlpha = reality ? .32 : .56; ctx.strokeStyle = accent; ctx.fillStyle = accent; ctx.lineWidth = 3;
                const lx = W * .78 - cameraX * .055, ly = H * .66;
                if (level === 0 || tutorialMode) {
                    ctx.fillRect(lx, ly - 118, 5, 118); ctx.beginPath(); ctx.arc(lx + 2, ly - 118, 13, 0, Math.PI * 2); ctx.stroke();
                    for (let n = 1; n < 4; n++) { ctx.beginPath(); ctx.ellipse(lx + 2, ly - 118, 18 + n * 13, 5 + n * 4, 0, 0, Math.PI * 2); ctx.stroke(); }
                } else if (level === 1) {
                    for (let n = 0; n < 3; n++) { const px = lx + n * 28; ctx.fillRect(px, ly - 86 + (n % 2) * 17, 8, 86); ctx.fillRect(px - 7, ly - 87 + (n % 2) * 17, 22, 6); }
                    ctx.fillRect(lx + 6, ly - 88, 55, 5);
                } else if (level === 2) {
                    ctx.fillRect(lx, ly - 104, 6, 104); ctx.fillRect(lx + 54, ly - 104, 6, 104);
                    for (let n = 0; n < 5; n++) { const py = ly - 96 + n * 21; ctx.fillRect(lx + 7, py, 46, 3); ctx.fillRect(lx + 15 + (n % 2) * 12, py - 7, 3, 10); }
                } else if (level === 3) {
                    for (let n = 0; n < 7; n++) { const px = lx + (n % 3) * 18, py = ly - 24 - n * 14; ctx.fillRect(px, py, 15, 12); }
                } else if (level === 4) {
                    const nodes = [[4, -82], [38, -112], [70, -76], [31, -44], [82, -25]];
                    ctx.beginPath(); ctx.moveTo(lx + nodes[0][0], ly + nodes[0][1]);
                    for (const [nx, ny] of nodes.slice(1)) ctx.lineTo(lx + nx, ly + ny);
                    ctx.stroke();
                    for (const [nx, ny] of nodes) { ctx.beginPath(); ctx.arc(lx + nx, ly + ny, 5, 0, Math.PI * 2); ctx.fill(); }
                } else if (level === 6) {
                    ctx.fillRect(lx + 12, ly - 82, 74, 7); ctx.fillRect(lx + 20, ly - 34, 62, 7);
                    for (let n = 0; n < 4; n++) {
                        const gx = lx + 18 + n * 20, gy = ly - 58;
                        ctx.beginPath(); ctx.arc(gx, gy, 11, 0, Math.PI * 2); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(gx - 15, gy); ctx.lineTo(gx + 15, gy); ctx.moveTo(gx, gy - 15); ctx.lineTo(gx, gy + 15); ctx.stroke();
                    }
                    ctx.fillRect(lx + 3, ly - 112, 5, 112); ctx.fillRect(lx + 91, ly - 112, 5, 112);
                } else if (level === 7) {
                    for (let n = 0; n < 5; n++) { ctx.beginPath(); ctx.ellipse(lx + 40, ly - 58, 18 + n * 12, 7 + n * 5, -.28, 0, Math.PI * 2); ctx.stroke(); }
                    ctx.beginPath(); ctx.arc(lx + 40, ly - 58, 8, 0, Math.PI * 2); ctx.fill();
                } else if (level === 8) {
                    const ghostNodes = [[0, -35], [22, -78], [48, -96], [72, -58], [96, -82], [115, -32]];
                    ctx.beginPath(); ctx.moveTo(lx + ghostNodes[0][0], ly + ghostNodes[0][1]);
                    for (const [nx, ny] of ghostNodes.slice(1)) ctx.lineTo(lx + nx, ly + ny);
                    ctx.stroke();
                    for (const [nx, ny] of ghostNodes) { ctx.beginPath(); ctx.arc(lx + nx, ly + ny, 5, 0, Math.PI * 2); ctx.fill(); }
                } else if (level === 9) {
                    ctx.beginPath(); ctx.arc(lx + 46, ly - 65, 18, 0, Math.PI * 2); ctx.fill();
                    for (let n = 0; n < 5; n++) { ctx.beginPath(); ctx.ellipse(lx + 46, ly - 65, 28 + n * 12, 10 + n * 5, n * .12, 0, Math.PI * 2); ctx.stroke(); }
                } else {
                    ctx.fillRect(lx + 35, ly - 120, 5, 120);
                    for (let n = 0; n < 4; n++) { ctx.beginPath(); ctx.ellipse(lx + 37, ly - 72, 20 + n * 12, 7 + n * 5, -.18, 0, Math.PI * 2); ctx.stroke(); }
                }
                ctx.restore();
                // Circuitos laterais
                ctx.strokeStyle = accent; ctx.globalAlpha = .65; ctx.lineWidth = 2;
                for (let i = 0; i < 10; i++) {
                    const x = (i * 97 + 20) % W, y = 65 + (i * 43) % 330;
                    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 18, y); ctx.lineTo(x + 18, y + 12); ctx.lineTo(x + 34, y + 12); ctx.stroke();
                    box(x + 30, y + 8, 5, 5, accent);
                }
                ctx.globalAlpha = 1;

                for (let i = 0; i < 48; i++) {
                    const x = (i * 137 + frame * (i % 3 + 1) * .12) % W;
                    const y = (i * 71 + Math.sin(frame * .02 + i) * 8) % H;
                    box(x, y, 2, 2, i % 3 === 0 ? C.mint : accent);
                }
                // Linhas CRT sutis
                ctx.fillStyle = "#03081216";
                for (let y = 0; y < H; y += 4)ctx.fillRect(0, y, W, 1);
                // Vinheta
                const v = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 470);
                v.addColorStop(0, "#00000000"); v.addColorStop(1, "#02050bb0");
                ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
            }

            function drawPlatforms() {
                for (const p of platforms) {
                    if (!active(p) || p.cooldown > 0) continue;
                    const col = p.phase === 2 ? C.gray : p.phase === 0 ? C.mint : C.blue;
                    const unstable = p.type === "unstable", moving = p.type === "moving";
                    if (unstable) {
                        const warning = p.timer > UNSTABLE_WARNING_TIME, pulse = (Math.sin(frame * .32) + 1) / 2;
                        const uc = warning ? (pulse > .5 ? C.pink : C.yellow) : "#ff9e43";
                        glow(p.x - 2, p.y - 2, p.w + 4, p.h + 4, uc, warning ? 14 : 8);
                        box(p.x - 1, p.y - 1, p.w + 2, p.h + 2, "#fff5");
                        box(p.x, p.y, p.w, p.h, uc);
                        box(p.x, p.y, p.w, 3, C.white);
                        for (let xx = p.x + 3; xx < p.x + p.w - 2; xx += 9)box(xx, p.y + 6, 4, 3, C.dark);
                        label(warning ? "!!" : "!", p.x + p.w / 2 - 3, p.y - 6, 10, C.white);
                        if (p.timer > 0) {
                            const total = UNSTABLE_WARNING_TIME + UNSTABLE_DURATION, remain = Math.max(0, total - p.timer);
                            box(p.x, p.y - 9, p.w, 3, "#42232b"); box(p.x, p.y - 9, p.w * remain / total, 3, C.yellow);
                        }
                    } else {
                        glow(p.x, p.y, p.w, p.h, col, 5);
                        box(p.x, p.y, p.w, p.h, C.dark);
                        box(p.x, p.y, p.w, 3, col);
                        box(p.x, p.y + 3, p.w, p.h - 3, p.phase === 0 ? "#244c49" : "#263c68");
                        // Painel metálico e rebites
                        box(p.x + 2, p.y + 5, p.w - 4, 2, col);
                        for (let xx = p.x + 5; xx < p.x + p.w - 3; xx += 12) {
                            box(xx, p.y + 9, 6, 3, "#101b2b"); box(xx, p.y + 9, 2, 1, col);
                        }
                        box(p.x, p.y + p.h - 2, p.w, 2, col);
                        if (moving) {
                            glow(p.x + 4, p.y - 3, p.w - 8, 2, C.yellow, 8);
                            box(p.x + 4, p.y - 3, p.w - 8, 2, C.yellow);
                        }
                    }
                }
            }

            function drawHazards() {
                for (const h of hazards) {
                    if (h.kind === "laser") {
                        const inReality = h.phase === 2 || h.phase === reality;
                        const activeNow = hazardActive(h);
                        const color = h.phase === 1 ? C.blue : C.pink;
                        ctx.save();
                        ctx.globalAlpha = inReality ? 1 : .28;
                        box(h.x - 5, h.y - 4, h.w + 10, 8, "#172332");
                        box(h.x - 3, h.y - 2, h.w + 6, 4, inReality ? color : "#506070");
                        ctx.restore();
                        if (activeNow) {
                            glow(h.x, h.y, h.w, h.h, color, 14);
                            box(h.x, h.y, h.w, h.h, color);
                            box(h.x - 2, h.y, h.w + 4, h.h, "#ffffff66");
                        } else if (inReality) {
                            ctx.save(); ctx.globalAlpha = .18;
                            box(h.x, h.y, h.w, h.h, color);
                            ctx.restore();
                        }
                        continue;
                    }
                    if (h.phase !== 2 && h.phase !== reality) continue;
                    const pulse = (Math.sin(frame * .2) + 1) / 2;
                    glow(h.x, h.y, h.w, h.h, C.pink, 7);
                    box(h.x, h.y + 3, h.w, h.h - 3, "#6d233e");
                    box(h.x + 2, h.y + 2, h.w - 4, 4, C.pink);
                    box(h.x + 3, h.y + 5, 5, 4, C.dark); box(h.x + h.w - 8, h.y + 5, 5, 4, C.dark);
                    box(h.x + 2, h.y + h.h - 3, h.w - 4, 3, pulse > .5 ? C.yellow : C.pink);
                    for (let i = 0; i < Math.floor(h.w / 8); i++)box(h.x + 4 + i * 8, h.y - 2, 3, 2, C.pink);
                }
            }

            function drawBits() {
                for (const b of bits) {
                    if (b.got) continue;
                    const bob = Math.sin(frame * .1 + b.phase) * 4, y = b.y + bob;
                    const pulse = (Math.sin(frame * .14 + b.phase) + 1) / 2;
                    glow(b.x + 1, y - 1, 12, 16, C.yellow, 8 + pulse * 8);
                    box(b.x, y + 2, 14, 12, "#9b671d");
                    box(b.x + 2, y, 10, 14, C.yellow);
                    box(b.x + 5, y - 3, 4, 20, C.white);
                    box(b.x + 3, y + 3, 2, 7, "#fff4b0");
                    box(b.x + 6, y + 4, 2, 5, "#c98c24");
                    box(b.x + 2, y + 13, 10, 2, "#fff0a0");
                }
            }

            function drawExit() {
                const pulse = (Math.sin(frame * .12) + 1) / 2, ready = bitsCollected === 3;
                const col = ready ? C.mint : C.pink;
                glow(exit.x - 4, exit.y - 4, 32, 40, col, ready ? 18 : 7);
                box(exit.x - 4, exit.y - 4, 32, 40, col);
                box(exit.x, exit.y, 24, 32, "#101b2b");
                box(exit.x + 3, exit.y + 3, 18, 26, ready ? "#387b70" : "#49365f");
                box(exit.x + 5, exit.y + 5, 14, 22, ready ? C.mint : C.purple);
                box(exit.x + 8 + Math.floor(pulse * 5), exit.y + 9, 3, 14, C.dark);
                box(exit.x + 6, exit.y + 5, 2, 22, C.white);
                label("EXIT", exit.x - 3, exit.y - 8, 9, C.white);
                if (ready) {
                    box(exit.x + 5, exit.y + 34, 14, 2, C.mint);
                } else {
                    label("LOCK", exit.x - 3, exit.y + 43, 8, C.pink);
                }
            }

            function drawPlayer() {
                if (player.inv > 0 && frame % 6 < 3) return;
                const x = Math.round(player.x), y = Math.round(player.y);
                const col = reality ? C.blue : C.mint;
                const bob = player.on && Math.abs(player.vx) > .1 ? Math.sin(player.walk * 2) * 2 : 0;
                const px = x + 2, py = y + bob;
                // Sombra no chão
                if (player.on) {
                    ctx.globalAlpha = .28; box(x + 1, y + 22, 17, 3, "#000"); ctx.globalAlpha = 1;
                }
                // Trilha de movimento
                if (Math.abs(player.vx) > 0 && player.on && frame % 3 === 0) {
                    particles.push({ x: x + 9, y: y + 18, vx: -player.dir * .6, vy: -.2, life: 8, color: col, size: 2 });
                }
                // Cabeça e capacete
                glow(px + 2, py + 2, 13, 7, C.white, 4);
                box(px + 2, py + 2, 13, 6, "#b9c8d0");
                box(px + 4, py - 2, 8, 5, C.yellow);
                box(px + 3, py + 3, 11, 2, C.white);
                // Corpo com contorno e placas
                box(px, py + 8, 16, 10, "#09121e");
                box(px + 2, py + 8, 12, 9, col);
                box(px + 4, py + 10, 8, 4, "#172b3d");
                box(px + 5, py + 10, 5, 2, C.white);
                box(px + 6, py + 13, 3, 2, C.yellow);
                // Olho direcional
                box(player.dir > 0 ? px + 11 : px + 3, py + 5, 3, 3, C.white);
                box(player.dir > 0 ? px + 12 : px + 3, py + 6, 2, 2, C.blue);
                // Braços animados
                const arm = Math.sin(player.walk * 3) * 2;
                box(px - 2, py + 10 + arm, 4, 5, C.white);
                box(px + 14, py + 10 - arm, 4, 5, C.white);
                // Pernas animadas
                if (player.on && Math.abs(player.vx) > .1) {
                    const step = Math.sin(player.walk * 3) * 3;
                    box(px + 3, py + 17, 4, 4, C.white);
                    box(px + 10, py + 17, 4, 4, C.white);
                    box(px + 2 + step, py + 20, 5, 2, col);
                    box(px + 10 - step, py + 20, 5, 2, col);
                } else {
                    box(px + 3, py + 17, 4, 4, C.white); box(px + 10, py + 17, 4, 4, C.white);
                    box(px + 2, py + 20, 5, 2, col); box(px + 10, py + 20, 5, 2, col);
                }
                if (player.flip > 0) {
                    glow(x - 5, y + 4, 3, 14, C.blue, 9); glow(x + 20, y + 4, 3, 14, C.mint, 9);
                    box(x - 5, y + 4, 3, 14, C.blue); box(x + 20, y + 4, 3, 14, C.mint);
                }
            }

            function drawEntity() {
                if (!entity) return;
                const x = Math.round(entity.x), y = Math.round(entity.y);
                const pulse = (Math.sin(entity.pulse * .25) + 1) / 2;
                const glitchX = Math.sin(entity.pulse * .8) * (1 + pulse * 3);
                ctx.save();
                // Aura escura, com pulsação lenta e pequenos ecos vermelhos/roxos.
                ctx.globalAlpha = .30 + pulse * .16;
                glow(x - 20, y - 16, entity.w + 40, entity.h + 32, "#020207", 30);
                ctx.globalAlpha = .16 + pulse * .10;
                glow(x - 11, y - 9, entity.w + 22, entity.h + 18, "#7d071b", 19);
                ctx.globalAlpha = 1;
                ctx.translate(x, y);
                ctx.scale(1.3, 1.3);
                // Silhueta quase preta, com detalhes vermelhos e poucos fragmentos roxos.
                glow(4, 3, 20, 25, "#8e1024", 10);
                box(7 + glitchX, -5, 4, 10, "#100b12");
                box(18 - glitchX, -5, 4, 10, "#100b12");
                box(8 + glitchX, -2, 3, 7, "#d21f36");
                box(19 - glitchX, -2, 3, 7, "#d21f36");
                box(5, 3, 20, 5, "#09080d");
                box(3, 6, 22, 17, "#09090e");
                box(6, 5, 16, 17, "#171019");
                box(5, 10, 18, 8, "#050509");
                // Olhos vermelhos intensos.
                glow(7, 10, 5, 5, "#ff203f", 9);
                glow(17, 10, 5, 5, "#ff203f", 9);
                box(8, 11, 3, 4, "#ff314b");
                box(18, 11, 3, 4, "#ff314b");
                box(8, 22, 4, 8, "#0b090f");
                box(17, 21, 4, 9, "#0b090f");
                box(8, 24, 3, 3, "#8f1428");
                box(18, 24, 3, 3, "#8f1428");
                box(-3 - glitchX, 8, 6, 3, "#d21f36");
                box(24 + glitchX, 15, 7, 3, "#a01931");
                box(2, 27, 5, 3, "#d21f36");
                box(22, 27, 5, 3, pulse > .65 ? "#a45bdb" : "#8f1428");
                // Poucos pixels roxos para sugerir corrupção digital.
                if (pulse > .58) {
                    box(-7, 3 + glitchX, 4, 2, "#9b55d4");
                    box(28, 22 - glitchX, 5, 2, "#7e42b4");
                }
                // Partículas negras e vermelhas na borda da aura.
                ctx.globalAlpha = .55 + pulse * .25;
                box(-10, 13 + glitchX, 3, 5, "#170710");
                box(31, 5 - glitchX, 4, 3, "#4d0a18");
                ctx.restore();
                if (timeLeft === 0 && frame % 90 < 45) {
                    label("CAÇANDO", Math.max(4, Math.min(W - 75, x - 20)), y - 13, 10, "#ff314b");
                }
            }

            function drawParticles() {
                for (const p of particles) {
                    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 15));
                    glow(p.x, p.y, p.size, p.size, p.color, 3);
                    box(p.x, p.y, p.size, p.size, p.color);
                    ctx.globalAlpha = 1;
                }
            }
            function drawHUD() {
                box(0, 0, W, 28, "#070e18eF");
                box(0, 26, W, 2, reality ? C.blue : C.mint);
                label(LEVEL_NAMES[level] + " / " + (reality ? "GLITCH" : "REAL"), 12, 18, 12, reality ? C.blue : C.mint);
                // Indicador de bits
                for (let i = 0; i < 3; i++) {
                    const x = W - 83 + i * 23;
                    box(x, 8, 12, 12, i < bitsCollected ? C.yellow : "#29394a");
                    if (i < bitsCollected) box(x + 4, 5, 4, 18, C.white);
                    else box(x + 3, 11, 6, 5, "#101b2b");
                }
                if (messageTimer > 0) {
                    box(205, 36, 390, 25, "#080f18");
                    box(205, 36, 3, 25, reality ? C.blue : C.mint);
                    label(message, 215, 53, 11, C.yellow);
                }
            }

            function draw() {
                ctx.save();
                if (shake > 1) ctx.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake);
                background();
                // O cenário se desloca horizontalmente para acompanhar o jogador.
                ctx.save();
                ctx.translate(-cameraX, 0);
                drawPlatforms(); drawHazards(); drawBits(); drawExit(); drawEntity(); drawPlayer(); drawParticles();
                ctx.restore();
                drawHUD();
                ctx.restore();
            }

            $("menuReturn").addEventListener("click", showMenu);
            $("playButton").addEventListener("click", start);
            $("controlsButton").addEventListener("click", showControls);
            $("tutorialButton").addEventListener("click", startTutorial);
            $("exitButton").addEventListener("click", () => overlay("FIM DE SESSÃO", "Obrigado por jogar GLITCH//SHIFT! Você pode fechar esta aba com segurança.", "VOLTAR AO MENU", showMenu));
            $("start").addEventListener("click", () => {
                const action = overlayAction;
                overlayAction = null;
                if (typeof action === "function") action();
                else start();
            });
            window.addEventListener("keydown", e => {
                if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "ShiftLeft", "ShiftRight"].includes(e.code)) e.preventDefault();
                if (e.code === "KeyR" && state === "dead") { start(); return; }
                if (e.code === "Enter" && state !== "play") { if (state === "menu") start(); else if (state === "dead" || state === "won") start(); return; }
                keys[e.code] = true;
                if ((e.code === "ShiftLeft" || e.code === "ShiftRight") && !e.repeat) shift();
            });
            window.addEventListener("keyup", e => keys[e.code] = false);
            $("jump").addEventListener("pointerdown", e => { e.preventDefault(); jump(); });
            $("shift").addEventListener("pointerdown", e => { e.preventDefault(); shift(); });
            document.querySelectorAll("[data-key]").forEach(b => {
                const k = b.dataset.key;
                b.addEventListener("pointerdown", e => { e.preventDefault(); keys[k] = true; if (k === "ArrowUp") jump(); });
                for (const ev of ["pointerup", "pointerleave", "pointercancel"]) b.addEventListener(ev, e => { e.preventDefault(); keys[k] = false; });
            });
            tutorialMode = false; loadLevel(0); showMenu();
            function loop() { update(); draw(); requestAnimationFrame(loop); }
            requestAnimationFrame(loop);
        })();
