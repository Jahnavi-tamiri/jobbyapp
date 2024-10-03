import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onclickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <div className="navbar">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </Link>
        <ul className="head-ul">
          <li>
            <Link to="/" className="links-container">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="links-container">
              Jobs
            </Link>
          </li>
        </ul>

        <button type="button" onClick={onclickLogout} className="logout">
          <li>Logout</li>
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
