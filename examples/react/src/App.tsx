import { notate } from 'animate-notation'
import { useEffect, useRef } from 'react'
import './App.css'

function App() {
  const target = useRef<HTMLDivElement>(null)
  const vite = useRef<ReturnType<typeof notate>>(null)
  const react = useRef<ReturnType<typeof notate>>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const animate = useRef<ReturnType<typeof notate>>(null)

  useEffect(() => {
    vite.current = notate(target.current!.children[0] as HTMLElement, 'o', {
      opacity: 0.6,
    })
    react.current = notate(target.current!.children[1] as HTMLElement, 'box', {
      opacity: 0.6,
    })
    animate.current = notate(title.current!, '=', {
      opacity: 0.1,
    })
    return () => {
      vite.current?.remove()
      react.current?.remove()
      animate.current?.remove()
    }
  }, [])

  return (
    <>
      <div ref={target} className="container">
        <a
          href="https://vite.dev"
          target="_blank"
          onMouseOver={() => vite.current?.show(600)}
          onMouseOut={() => vite.current?.hide(200)}
        >
          <h2>Vite</h2>
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          onMouseOver={() => react.current?.show(600)}
          onMouseOut={() => react.current?.hide(200)}
        >
          <h2>React</h2>
        </a>
      </div>
      <h1
        ref={title} className='title'
        onMouseOver={() => animate.current?.show(600)}
        onMouseOut={() => animate.current?.hide(200)}
      >
        Vite + React
      </h1>
    </>
  )
}

export default App
