import { Link } from 'react-router-dom'
import { LifeBuoy } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <LifeBuoy className="h-16 w-16 animate-float text-brine-300" />
      <h1 className="mt-6 font-display text-4xl font-700 text-navy">
        Człowiek za burtą!
      </h1>
      <p className="lead mt-2">Ta strona zniknęła pod falami (404).</p>
      <Link to="/" className="btn-primary mt-6">
        Wróć do portu
      </Link>
    </div>
  )
}
