import classNames from 'classnames'
import { Link } from 'react-router-dom'
import utils from 'utils.module.css'

export const Loader = () => console.log('Route loader')
export const Action = () => console.log('Route action')

export const Pending = () => <div>Route pending</div>
export const Catch = () => <div>Route error</div>

// TODO Proper index page
export default function Index() {
  return (
    <div className={classNames(utils.center, utils.column)}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/sdf-2d-vis">Visualize distance field</Link>
        </li>
        <li>
          <Link to="/sdf-2d">2D Playground</Link>
        </li>
        <li>
          <Link to="/editor">Editor</Link>
        </li>
      </ul>
    </div>
  )
}
