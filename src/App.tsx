import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Teoria from './pages/Teoria'
import Locja from './pages/Locja'
import Meteorologia from './pages/Meteorologia'
import Budowa from './pages/Budowa'
import Przepisy from './pages/Przepisy'
import Wezly from './pages/Wezly'
import Quiz from './pages/Quiz'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="teoria" element={<Teoria />} />
        <Route path="locja" element={<Locja />} />
        <Route path="meteorologia" element={<Meteorologia />} />
        <Route path="budowa" element={<Budowa />} />
        <Route path="przepisy" element={<Przepisy />} />
        <Route path="wezly" element={<Wezly />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
