import './style.css'
import starSvg from './star.svg?raw'

const cursorDot = document.querySelector('#cursor-dot')
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

function hideCursor() {
  document.body.classList.remove('custom-cursor')
}

window.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse' || !finePointer.matches) {
    hideCursor()
    return
  }
  cursorDot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`
  document.body.classList.add('custom-cursor')
}, { passive: true })
window.addEventListener('pointerdown', (event) => {
  if (event.pointerType !== 'mouse') hideCursor()
}, { passive: true })
document.documentElement.addEventListener('pointerleave', hideCursor)
window.addEventListener('blur', hideCursor)
finePointer.addEventListener('change', hideCursor)

const canvas = document.querySelector('#sparkles')
const ctx = canvas.getContext('2d')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const colors = ['#ff65bb', '#ff91c8', '#ffb4d9', '#f54fa5']
const sprites = []
const starImage = new Image()
starImage.onload = () => {
  for (const color of colors) {
    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = 96
    const spriteCtx = sprite.getContext('2d')
    spriteCtx.drawImage(starImage, 0, 0, 96, 96)
    spriteCtx.globalCompositeOperation = 'source-in'
    spriteCtx.fillStyle = color
    spriteCtx.fillRect(0, 0, 96, 96)
    sprites.push(sprite)
  }
}
starImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(starSvg)}`
const stars = []
let width = 0
let height = 0
let frame = 0
let previousTime = 0
let previousPointer = null

function resize() {
  width = window.innerWidth
  height = window.innerHeight
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(width * ratio)
  canvas.height = Math.round(height * ratio)
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
}

function addStar(x, y) {
  if (!sprites.length) return
  stars.push({
    x: x + (Math.random() - 0.5) * 90,
    y: y + (Math.random() - 0.5) * 90,
    vx: (Math.random() - 0.5) * 100,
    vy: -15 - Math.random() * 40,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 3,
    sprite: sprites[Math.floor(Math.random() * sprites.length)],
    age: 0,
    life: 0.55 + Math.random() * 0.55,
  })
  if (stars.length > 180) stars.shift()
}

function draw(time) {
  const dt = Math.min((time - previousTime) / 1000, 0.05)
  previousTime = time
  ctx.clearRect(0, 0, width, height)

  for (let i = stars.length - 1; i >= 0; i--) {
    const star = stars[i]
    star.age += dt
    if (star.age >= star.life) {
      stars.splice(i, 1)
      continue
    }
    star.x += star.vx * dt
    star.y += star.vy * dt
    star.vy += 85 * dt
    star.rotation += star.spin * dt
    const progress = star.age / star.life
    const size = star.size * (1 - progress * 0.65)

    ctx.save()
    ctx.translate(star.x, star.y)
    ctx.rotate(star.rotation)
    ctx.globalAlpha = Math.min(star.age / 0.06, 1) * (1 - progress) ** 1.5
    ctx.drawImage(star.sprite, -size, -size, size * 2, size * 2)
    ctx.restore()
  }

  frame = stars.length ? requestAnimationFrame(draw) : 0
}

function startAnimation() {
  if (frame) return
  previousTime = performance.now()
  frame = requestAnimationFrame(draw)
}

window.addEventListener('pointermove', (event) => {
  if (reducedMotion.matches || !event.isPrimary) return
  const now = performance.now()
  const current = { x: event.clientX, y: event.clientY, time: now }
  const previous = previousPointer && now - previousPointer.time < 150
    ? previousPointer : current
  const distance = Math.hypot(current.x - previous.x, current.y - previous.y)
  if (distance < 12 && previousPointer && now - previousPointer.time < 32) return
  const count = Math.min(finePointer.matches ? 7 : 3, Math.max(1, Math.floor(distance / 18)))
  for (let i = 1; i <= count; i++) {
    const t = i / count
    addStar(previous.x + (current.x - previous.x) * t,
      previous.y + (current.y - previous.y) * t)
  }
  previousPointer = current
  startAnimation()
}, { passive: true })

window.addEventListener('pointerdown', (event) => {
  if (reducedMotion.matches || !event.isPrimary) return
  previousPointer = { x: event.clientX, y: event.clientY, time: performance.now() }
  for (let i = 0; i < (event.pointerType === 'touch' ? 8 : 16); i++) addStar(event.clientX, event.clientY)
  startAnimation()
}, { passive: true })

window.addEventListener('pointerup', () => { previousPointer = null }, { passive: true })
window.addEventListener('pointercancel', () => { previousPointer = null }, { passive: true })

function reset() {
  cancelAnimationFrame(frame)
  frame = 0
  stars.length = 0
  previousPointer = null
  ctx.clearRect(0, 0, width, height)
}

window.addEventListener('resize', resize)
window.addEventListener('blur', () => { previousPointer = null })
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { reset(); hideCursor() }
})
reducedMotion.addEventListener('change', reset)
resize()





