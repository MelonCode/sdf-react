import { Link, Outlet } from 'react-router-dom'
import styles from 'App.module.css'

export default function App() {
  return (
    <>
      <main className={styles.App}>
        <Outlet />
      </main>
    </>
  )
}
