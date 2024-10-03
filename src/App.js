import {Route, Redirect, Switch} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobDetails from './components/JobDetails'
import Login from './components/Login'
import NotFound from './components/NotFound'
import './App.css'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path='/login' component={Login} />
    <ProtectedRoute exact path='/' component={Home} />
    <ProtectedRoute exact path='/jobs' component={Jobs} />
    <ProtectedRoute exact path='/jobs/:id' component={JobDetails} />

    <Route path='/not-found' component={NotFound} />
    <Redirect to='not-found' />
  </Switch>
)

export default App
