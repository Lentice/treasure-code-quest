import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import AdminPage from './pages/AdminPage.jsx'
import PlayPage from './pages/PlayPage.jsx'
import './App.css'

function App() {
  return (
    <HashRouter>
      <div className="appShell">
        <header className="topBar">
          <div className="brand">
            <div className="brandTitle">寶藏解鎖</div>
            <div className="brandSubtitle">一起輸入密碼，打開寶箱！</div>
          </div>
          <nav className="nav">
            <NavLink
              to="/play"
              className={({ isActive }) =>
                `navLink${isActive ? ' navLinkActive' : ''}`
              }
            >
              遊玩
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `navLink${isActive ? ' navLinkActive' : ''}`
              }
            >
              管理
            </NavLink>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/play" replace />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/play" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
