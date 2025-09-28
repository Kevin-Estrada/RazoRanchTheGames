(function () {
  const canvas = document.getElementById("smoke-embers-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  // --- Smoke Particles ---
  function SmokeParticle() {
    // Spawn from a random edge
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) {
      // top
      this.x = Math.random() * w;
      this.y = -60;
      this.dx = (Math.random() - 0.5) * 0.5;
      this.dy = 0.2 + Math.random() * 0.4;
    } else if (edge === 1) {
      // bottom
      this.x = Math.random() * w;
      this.y = h + 60;
      this.dx = (Math.random() - 0.5) * 0.5;
      this.dy = -0.2 - Math.random() * 0.4;
    } else if (edge === 2) {
      // left
      this.x = -60;
      this.y = Math.random() * h;
      this.dx = 0.2 + Math.random() * 0.4;
      this.dy = (Math.random() - 0.5) * 0.5;
    } else {
      // right
      this.x = w + 60;
      this.y = Math.random() * h;
      this.dx = -0.2 - Math.random() * 0.4;
      this.dy = (Math.random() - 0.5) * 0.5;
    }
    this.radius = 80 + Math.random() * 80;
    this.alpha = 0.13 + Math.random() * 0.13;
    this.life = 350 + Math.random() * 200;
    this.age = 0;
  }
  SmokeParticle.prototype.draw = function (ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha * (1 - this.age / this.life);
    let grad = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius * 0.2,
      this.x,
      this.y,
      this.radius
    );
    grad.addColorStop(0, "#fff");
    grad.addColorStop(0.3, "#f5e8e0");
    grad.addColorStop(1, "rgba(120,120,120,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  };

  // --- Ember Particles ---
  function EmberParticle() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.radius = 3.5 + Math.random() * 4.5;
    this.speed = 2.2 + Math.random() * 2.2;
    this.wind = (Math.random() - 0.5) * 1.2;
    this.alpha = 1.0;
    this.life = 90 + Math.random() * 60;
    this.age = Math.random() * this.life;
  }
  EmberParticle.prototype.draw = function (ctx) {
    let grad = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );
    grad.addColorStop(0, "rgba(255,255,240,1)");
    grad.addColorStop(0.12, "rgba(255,240,120,1)");
    grad.addColorStop(0.25, "rgba(255,200,0,1)");
    grad.addColorStop(0.5, "rgba(255,100,0,1)");
    grad.addColorStop(0.8, "rgba(255,0,0,0.9)");
    grad.addColorStop(1, "rgba(255,0,0,0.5)");
    ctx.save();
    ctx.globalAlpha =
      this.alpha * (1 - this.age / this.life) * (0.98 + 0.02 * Math.random());
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = grad;
    ctx.shadowColor = "#ff3c00";
    ctx.shadowBlur = 56;
    ctx.fill();
    ctx.restore();
  };

  // --- Particle Arrays ---
  let smokes = [];
  let embers = [];
  for (let i = 0; i < 60; i++) smokes.push(new SmokeParticle());
  for (let i = 0; i < 200; i++) embers.push(new EmberParticle());

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw and update smoke
    for (let s of smokes) {
      s.draw(ctx);
      s.x += s.dx;
      s.y += s.dy;
      s.age += 1;
      if (
        s.age > s.life ||
        s.x < -160 ||
        s.x > w + 160 ||
        s.y < -160 ||
        s.y > h + 160
      ) {
        // Respawn from a random edge
        SmokeParticle.call(s);
      }
    }

    // Draw and update embers
    for (let e of embers) {
      e.draw(ctx);
      e.x += e.wind;
      e.y -= e.speed;
      e.age += 1;
      // Fade out as they approach the top 70% of the page
      if (e.y < h * 0.7) {
        e.alpha -= 0.04;
      }
      if (
        e.alpha <= 0 ||
        e.age > e.life ||
        e.y < 0 ||
        e.x < -20 ||
        e.x > w + 20
      ) {
        e.x = Math.random() * w;
        e.y = h + 10;
        e.age = 0;
        e.alpha = 1.0;
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

// Set the date we're counting down to
var countDownDate = new Date("Aug 21, 2021 12:00:00").getTime();

// Update the count down every 1 second
// var x = setInterval(function () {
//   // Get today's date and time
//   var now = new Date().getTime();

//   // Find the distance between now and the count down date
//   var distance = countDownDate - now;

//   // Time calculations for days, hours, minutes and seconds
//   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//   // Display the result in the element with id="demo"
//   document.getElementById("countdowntimer").innerHTML =
//     days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

//   // If the count down is finished, write some text
//   if (distance < 0) {
//     clearInterval(x);
//     document.getElementById("countdowntimer").innerHTML = "GAMES ARE ON";
//   }
// }, 1000);

// Zombie Apocalypse Theme: Continuous Digital Glitch Timer
const glitchMessages = [
  "??d ??h ??m ??s",
  "##d ##h ##m ##s",
  "??:??:??:??",
  "##:##:##:##",
  "THE END IS NEAR",
  "BE READY...",
  "THE FOUR HORSEMEN...",
  "?<$%&#@!*%$<!",
];

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

// function randomTimerString() {
//   // 20% chance to show a glitch message
//   if (Math.random() < 0.2) {
//     return glitchMessages[randomInt(glitchMessages.length)];
//   } else {
//     var days = randomInt(100);
//     var hours = randomInt(24);
//     var minutes = randomInt(60);
//     var seconds = randomInt(60);
//     return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
//   }
// }

function randomTimerString() {
  // 20% chance to show a glitch message
  if (Math.random() < 0.2) {
    return glitchMessages[randomInt(glitchMessages.length)];
  } else {
    var countDownDate = new Date("Nov 29, 2025 12:00:00").getTime();
    var x = setInterval(function () {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      if (distance < 0) {
        clearInterval(x);
        return "THE GAMES ARE ON!";
      } else {
        return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
      }
    }, 1000);
  }
}

function shuffleDigits(str) {
  // Replace every digit with a random digit
  const chars = "0123456789";
  return str
    .split("")
    .map((c) => (/\d/.test(c) ? chars[randomInt(chars.length)] : c))
    .join("");
}

function continuousGlitchTimer() {
  var timerElem = document.getElementById("countdowntimer");
  if (!timerElem) return;

  let count = 0;
  let maxGlitchMsg = 2; // Show a glitch message every 5 cycles

  function getCountdownString() {
    var countDownDate = new Date("Nov 29, 2025 12:00:00").getTime();
    var now = new Date().getTime();
    var distance = countDownDate - now;
    if (distance < 0) {
      return "THE GAMES ARE ON!";
    } else {
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }
  }

  function loop() {
    let showGlitchMsg = count % maxGlitchMsg === 0 && Math.random() < 0.3;
    let baseStr = showGlitchMsg
      ? glitchMessages[randomInt(glitchMessages.length)]
      : getCountdownString();
    timerElem.innerHTML = baseStr;
    timerElem.classList.add("glitch");
    count++;
    setTimeout(loop, 700);
  }
  loop();
}

continuousGlitchTimer();

// Copyright year update (safe)
var copyrightElem = document.getElementById("copyright-year");
if (copyrightElem) {
  copyrightElem.innerText = new Date().getFullYear();
}
