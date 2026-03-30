import Container from './Container'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <Container>
        <div className="flex h-14 items-center justify-between text-sm text-zinc-400">
          <span>
            <span className="font-medium text-zinc-700">Saeta</span>
            <span className="font-medium text-violet-600">IA</span>
            {' '}— Noticias de Inteligencia Artificial
          </span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </Container>
    </footer>
  )
}
