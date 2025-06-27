const a = document.querySelector('.world');
const b = [
    document.getElementById('canvas-act1'),
    document.getElementById('canvas-act2'),
    document.getElementById('canvas-act3'),
    document.getElementById('canvas-act4')
];
const c = b.map(d => d.getContext('2d'));

let d = 0;
let e = { x: null, y: null };
let f = { x: null, y: null };
let g = false;
const h = 1000;

function i() {
    b.forEach(j => {
        j.width = window.innerWidth;
        j.height = window.innerHeight;
    });
    a.style.width = `${b.length * window.innerWidth}px`;
}

window.addEventListener('resize', () => {
    i();
    k();
    m();
    q();
});

window.addEventListener('mousemove', (l) => {
    e.x = l.clientX;
    e.y = l.clientY;
    if (g) return;
    g = true;
    const n = 50;
    if (e.x > window.innerWidth - n && d < 3) {
        d++;
        o();
    } else if (e.x < n && d > 0) {
        d--;
        o();
    } else {
        g = false;
    }
});

window.addEventListener('mouseout', () => { e.x = null; e.y = null; });

function o() {
    g = true;
    a.style.transform = `translateX(-${d * 100}vw)`;
    setTimeout(() => { g = false; }, h);
}

// --- Act 1: The Grid ---
let p = [];
function k() {
    p = [];
    const r = 20;
    for (let s = 0; s < window.innerHeight; s += r) {
        for (let t = 0; t < window.innerWidth; t += r) {
            p.push(new u(t, s));
        }
    }
}
class u {
    constructor(x, y) { this.x = x; this.y = y; this.size = 2; this.baseX = x; this.baseY = y; this.density = (Math.random() * 30) + 1; }
    draw(v) { v.fillStyle = '#fff'; v.fillRect(this.x, this.y, this.size, this.size); }
    update() {
        if (f.x === null) { this.x -= (this.x - this.baseX) / 10; this.y -= (this.y - this.baseY) / 10; return; }
        let w = f.x - this.x;
        let x = f.y - this.y;
        let y = Math.sqrt(w * w + x * x);
        let z = 100;
        if (y < z) {
            let A = (z - y) / z;
            this.x -= (w / y) * A * this.density;
            this.y -= (x / y) * A * this.density;
        } else {
            if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 10;
            if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 10;
        }
    }
}
function B() {
    c[0].clearRect(0, 0, window.innerWidth, window.innerHeight);
    p.forEach(q => { q.update(); q.draw(c[0]); });
}

// --- Act 2: The Swarm ---
let C = [];
function m() {
    C = [];
    for (let D = 0; D < 200; D++) { C.push(new E(Math.random() * window.innerWidth, Math.random() * window.innerHeight)); }
}
class E {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
    }
    draw(F) { F.fillStyle = '#fff'; F.beginPath(); F.arc(this.x, this.y, this.size, 0, Math.PI * 2); F.fill(); }
    update(G) {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.99;
        this.vy *= 0.99;
        if (G && G.x !== null) {
            let H = G.x - this.x;
            let I = G.y - this.y;
            let J = Math.sqrt(H * H + I * I);
            if (J < 300) {
                let K = Math.atan2(I, H);
                let L = (300 - J) / 300;
                this.vx += Math.cos(K) * 0.3 * L;
                this.vy += Math.sin(K) * 0.3 * L;
            }
        }
        if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
    }
}
function M() {
    c[1].clearRect(0, 0, window.innerWidth, window.innerHeight);
    let N = { x: null, y: null };
    if (d === 1 && e.x !== null && e.y !== null) {
        N.x = e.x;
        N.y = e.y;
    }
    C.forEach(O => { O.update(N); O.draw(c[1]); });
}

// --- Act 3: The 3D Cube ---
const P = [
    {x:-1, y:-1, z:-1}, {x:1, y:-1, z:-1}, {x:1, y:1, z:-1}, {x:-1, y:1, z:-1},
    {x:-1, y:-1, z:1}, {x:1, y:-1, z:1}, {x:1, y:1, z:1}, {x:-1, y:1, z:1}
];
const Q = [
    [0,1], [1,2], [2,3], [3,0], [4,5], [5,6], [6,7], [7,4],
    [0,4], [1,5], [2,6], [3,7]
];
let R = 0, S = 0;
function T() {
    const U = c[2];
    const V = b[2];
    U.clearRect(0, 0, V.width, V.height);
    const W = (a, b, t) => a + (b - a) * t;
    let X, Y;
    if (f.x !== null) {
        Y = (f.x - V.width / 2) / V.width * 2 * Math.PI;
        X = (f.y - V.height / 2) / V.height * 2 * Math.PI;
    } else {
        X = R + 0.001;
        Y = S + 0.001;
    }
    R = W(R, X, 0.1);
    S = W(S, Y, 0.1);
    const Z = P.map(v => {
        let aa = { ...v };
        let ab = aa.x * Math.cos(S) - aa.z * Math.sin(S);
        let ac = aa.x * Math.sin(S) + aa.z * Math.cos(S);
        aa.x = ab; aa.z = ac;
        let ad = aa.y * Math.cos(R) - aa.z * Math.sin(R);
        ac = aa.y * Math.sin(R) + aa.z * Math.cos(R);
        aa.y = ad; aa.z = ac;
        return aa;
    });
    const ae = Z.map(v => {
        const af = 200;
        const ag = 250;
        const ah = ag / (ag + v.z * af * 0.5);
        return { x: v.x * af * ah + V.width / 2, y: v.y * af * ah + V.height / 2 };
    });
    U.strokeStyle = '#fff';
    U.lineWidth = 2;
    Q.forEach(ai => {
        const aj = ae[ai[0]];
        const ak = ae[ai[1]];
        U.beginPath();
        U.moveTo(aj.x, aj.y);
        U.lineTo(ak.x, ak.y);
        U.stroke();
    });
}

// --- Act 4: The Constellation ---
let al = [];
const am = 120;
const an = 300;
const ao = 120;
const ap = ao * ao;
const aq = 180;
const ar = aq * aq;

function q() {
    al = [];
    for (let as = 0; as < am; as++) {
        al.push(new at(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight
        ));
    }
}

class at {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.size = 1.5 + Math.random() * 1.5;
        this.alpha = 0.7 + Math.random() * 0.3;
    }
    update(au, av, aw, ax) {
        if (d === 3 && aw !== null && ax !== null) {
            let ay = aw - this.x;
            let az = ax - this.y;
            let ba = ay * ay + az * az;
            if (ba < ar && ba > 0.01) {
                let bb = Math.sqrt(ba);
                let bc = (aq - bb) / aq * 0.04;
                this.vx += ay / bb * bc;
                this.vy += az / bb * bc;
            }
        }
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        if (this.x < 0) this.x = au;
        if (this.x > au) this.x = 0;
        if (this.y < 0) this.y = av;
        if (this.y > av) this.y = 0;
    }
    draw(bd) {
        bd.save();
        bd.globalAlpha = this.alpha;
        bd.beginPath();
        bd.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        bd.fillStyle = '#fff';
        bd.shadowColor = '#fff';
        bd.shadowBlur = 8;
        bd.fill();
        bd.restore();
    }
}

function be() {
    const bf = c[3];
    const bg = b[3];
    const bh = bg.width;
    const bi = bg.height;
    bf.clearRect(0, 0, bh, bi);
    for (let bj = 0; bj < al.length; bj++) {
        let bk = al[bj];
        for (let bl = bj + 1; bl < al.length; bl++) {
            let bm = al[bl];
            let bn = bk.x - bm.x;
            let bo = bk.y - bm.y;
            let bp = bn * bn + bo * bo;
            if (bp < ap) {
                let bq = 0.18 * (1 - Math.sqrt(bp) / ao);
                bf.save();
                bf.globalAlpha = bq;
                bf.strokeStyle = '#fff';
                bf.beginPath();
                bf.moveTo(bk.x, bk.y);
                bf.lineTo(bm.x, bm.y);
                bf.stroke();
                bf.restore();
            }
        }
    }
    for (let br of al) {
        br.update(bh, bi, e.x, e.y);
        br.draw(bf);
    }
}

window.addEventListener('click', () => {
    if (d === 3 && e.x !== null && e.y !== null) {
        for (let bs = 0; bs < 18; bs++) {
            if (al.length < an) {
                let bt = Math.random() * Math.PI * 2;
                let bu = 10 + Math.random() * 30;
                let bv = e.x + Math.cos(bt) * bu;
                let bw = e.y + Math.sin(bt) * bu;
                let bx = new at(bv, bw);
                bx.vx = Math.cos(bt) * (1.5 + Math.random());
                bx.vy = Math.sin(bt) * (1.5 + Math.random());
                al.push(bx);
            }
        }
    }
});

(function() {
    let ce = null;
    let cf = false;
    function cg() {
        if (d !== 0 || cf) return;
        cf = true;
        const ch = document.querySelector('.world');
        ch.style.transition = 'transform 0.5s cubic-bezier(0.7,0,0.3,1)';
        ch.style.transform = 'translateX(-5vw)';
        setTimeout(() => {
            ch.style.transform = 'translateX(0vw)';
            setTimeout(() => {}, 600);
        }, 600);
    }
    window.addEventListener('DOMContentLoaded', function() {
        ce = setTimeout(cg, 5000);
    });
    window.addEventListener('mousemove', function() {
        if (d !== 0 && ce) {
            clearTimeout(ce);
            ce = null;
        }
    });
    window.addEventListener('mousedown', function() {
        if (d !== 0 && ce) {
            clearTimeout(ce);
            ce = null;
        }
    });
})();

function ci() {
    if (e.x !== null) {
        f.x = e.x - (d * window.innerWidth);
        f.y = e.y;
    } else {
        f.x = null;
        f.y = null;
    }
    if (d === 0) B();
    else if (d === 1) M();
    else if (d === 2) T();
    else if (d === 3) be();
    requestAnimationFrame(ci);
}

i();
k();
m();
q();
ci();