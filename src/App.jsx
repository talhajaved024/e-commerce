import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, MotionConfig } from 'framer-motion'

const spring = { type: 'spring', stiffness: 220, damping: 22, mass: 0.9 }
const soft = { type: 'spring', stiffness: 120, damping: 18, mass: 1.1 }

const products = [
  { id: 1, name: 'Fine-knit polo', color: 'Deep Navy', price: 120, img: 'polo' },
  { id: 2, name: 'Everyday tee', color: 'Warm Ivory', price: 48, img: 'tee' },
  { id: 3, name: 'Relaxed poplin shirt', color: 'Stone', price: 135, img: 'shirt' },
  { id: 4, name: 'Oversized white shirt', color: 'White', price: 140, img: 'oversized' },
]

const palette = [
  ['Warm Ivory', '#EAE7DF', 'Primary background'],
  ['Soft Charcoal', '#252522', 'Logo and typography'],
  ['Stone', '#A99F8E', 'Secondary backgrounds'],
  ['Muted Olive', '#737A65', 'Accent colour'],
  ['Soft Grey', '#D2D0C9', 'Supporting neutral'],
  ['Deep Navy', '#293B4B', 'Apparel and accent'],
]

function Nav({ count, open }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <motion.header className={`nav${scrolled ? ' scrolled' : ''}`} initial={{ y: -80 }} animate={{ y: 0 }} transition={{ ...soft, delay: 1.1 }}>
      <a href="#top" className="wordmark">TAVO</a>
      <nav>
        <a href="#collection">Collection</a>
        <a href="#philosophy">Philosophy</a>
        <a href="#palette">Palette</a>
      </nav>
      <motion.button className="bag" onClick={open} whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }} transition={spring}>
        Bag
        <motion.span key={count} className="count" initial={{ scale: 1.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>{count}</motion.span>
      </motion.button>
    </motion.header>
  )
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 140]), { stiffness: 90, damping: 20 })
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.9]), { stiffness: 90, damping: 20 })
  return (
    <section id="top" className="hero" ref={ref}>
      <motion.img src="/images/logo.png" alt="TAVO — Everyday, considered." className="hero-logo"
        style={{ y, scale }}
        initial={{ opacity: 0, scale: 1.18, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 14, mass: 1.6 }} />
      <motion.p className="hero-line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }}>
        Thoughtfully designed clothing, made to become part of your everyday.
      </motion.p>
    </section>
  )
}

function Philosophy() {
  const words = 'Clothing that asks very little of you, and gives a great deal back. Quiet colours, honest fabric, and a fit you stop thinking about.'.split(' ')
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] })
  return (
    <section id="philosophy" className="philosophy" ref={ref}>
      <p>
        {words.map((w, i) => {
          const s = i / words.length
          return <Word key={i} p={scrollYProgress} range={[s, s + 1 / words.length]}>{w}</Word>
        })}
      </p>
    </section>
  )
}
function Word({ children, p, range }) {
  const opacity = useSpring(useTransform(p, range, [0.18, 1]), { stiffness: 200, damping: 30 })
  return <motion.span style={{ opacity }}>{children} </motion.span>
}

function Card({ item, onAdd, i }) {
  const [added, setAdded] = useState(false)
  const add = () => { onAdd(item); setAdded(true); setTimeout(() => setAdded(false), 1400) }
  return (
    <motion.article className="card" initial="rest" whileHover="hover" whileInView="in" viewport={{ once: true, margin: '-60px' }}
      variants={{ rest: { opacity: 0, y: 60 }, in: { opacity: 1, y: 0, transition: { ...soft, delay: (i % 2) * 0.12 } } }}>
      <div className="frame">
        <motion.img src={`/images/${item.img}.png`} alt={item.name} variants={{ hover: { scale: 1.06 } }} transition={soft} />
      </div>
      <div className="meta">
        <div><h3>{item.name}</h3><span>{item.color}</span></div>
        <span>${item.price}</span>
      </div>
      <motion.button className="add" onClick={add} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} transition={spring}
        animate={{ backgroundColor: added ? '#737A65' : '#252522' }}>
        {added ? 'Added to bag' : 'Add to bag'}
      </motion.button>
    </motion.article>
  )
}

function Collection({ onAdd }) {
  return (
    <section id="collection" className="collection">
      <h2>The everyday collection</h2>
      <div className="grid">{products.map((p, i) => <Card key={p.id} item={p} i={i} onAdd={onAdd} />)}</div>
    </section>
  )
}

function Palette() {
  return (
    <section id="palette" className="palette">
      <h2>Six colours, chosen to sit together.</h2>
      <div className="swatches">
        {palette.map(([n, hex, role], i) => (
          <motion.div key={n} className="swatch" style={{ background: hex, color: i === 1 || i === 3 || i === 5 ? '#EAE7DF' : '#252522' }}
            initial={{ opacity: 0, y: 50, rotate: -3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }}
            transition={{ ...soft, delay: i * 0.07 }} whileHover={{ y: -12, rotate: 1.5, scale: 1.03 }}>
            <strong>{n}</strong><span>{hex}</span><em>{role}</em>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Bag({ items, close, remove, isOpen }) {
  const total = items.reduce((s, i) => s + i.price, 0)
  return (
    <AnimatePresence>
      {isOpen && (<>
        <motion.div className="veil" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.aside className="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
          <div className="drawer-head"><h3>Your bag</h3><button onClick={close}>Close</button></div>
          {items.length === 0 && <p className="empty">Your bag is empty. Add a piece from the collection.</p>}
          <AnimatePresence initial={false}>
            {items.map(it => (
              <motion.div layout key={it.key} className="line" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }} transition={spring}>
                <img src={`/images/${it.img}.png`} alt="" />
                <div><b>{it.name}</b><span>{it.color}</span></div>
                <span>${it.price}</span>
                <button onClick={() => remove(it.key)} aria-label={`Remove ${it.name}`}>Remove</button>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length > 0 && <div className="drawer-foot"><div><span>Total</span><b>${total}</b></div>
            <motion.button className="add" whileTap={{ scale: 0.96 }} transition={spring}>Checkout</motion.button></div>}
        </motion.aside>
      </>)}
    </AnimatePresence>
  )
}

export default function App() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const add = p => setItems(a => [...a, { ...p, key: crypto.randomUUID() }])
  const remove = k => setItems(a => a.filter(i => i.key !== k))
  return (
    <MotionConfig reducedMotion="user">
      <Nav count={items.length} open={() => setOpen(true)} />
      <main>
        <Hero /><Philosophy /><Collection onAdd={add} /><Palette />
      </main>
      <footer className="footer">
        <p>Thank you for choosing TAVO.</p>
        <span>Everyday, considered.</span>
      </footer>
      <Bag items={items} isOpen={open} close={() => setOpen(false)} remove={remove} />
    </MotionConfig>
  )
}
