import { Link } from 'react-router-dom'

export const Loader = () => console.log('Route loader')
export const Action = () => console.log('Route action')

export const Pending = () => <div>Route pending</div>
export const Catch = () => <div>Route error</div>

// TODO Proper index page
export default function Index() {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/sdf-2d">2D Playground</Link>
    </div>
  )
}
