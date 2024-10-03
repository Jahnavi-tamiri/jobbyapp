import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
console.log(salaryRangesList, employmentTypesList)
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class FilterJobs extends Component {
  state = {profileData: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.profile()
  }

  onclickReset = () => {
    this.profile()
  }

  profile = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      this.setState({
        profileData: data.profile_details,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  // Handle employment type change
  onEmploymentTypeChange = event => {
    const {updateEmploymentType} = this.props
    const {id, checked} = event.target

    updateEmploymentType(id, checked) // Pass selected type to parent
  }

  // Handle salary range change
  onSalaryRangeChange = event => {
    const {updateSalaryRange} = this.props
    updateSalaryRange(event.target.id) // Pass selected salary range to parent
  }

  onSuccess = () => {
    const {profileData} = this.state
    const {name, profile_image_url, short_bio} = profileData
    return (
      <div>
        <img src={profile_image_url} alt="profile" />
        <h1>{name}</h1>
        <p>{short_bio}</p>
      </div>
    )
  }

  onFailure = () => (
    <div>
      <button type="button" onClick={this.onclickReset} className="logout">
        Retry
      </button>
    </div>
  )

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  apistatusResult = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onSuccess()
      case apiStatusConstants.failure:
        return this.onFailure()
      case apiStatusConstants.loading:
        return this.onLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="filtering">
        <div>{this.apistatusResult()}</div>
        <hr />
        <div>
          <h1>Type of Employment</h1>
          <ul>
            {employmentTypesList.map(eachemp => (
              <li key={eachemp.employmentTypeId} className="empList">
                <input
                  type="checkbox"
                  className="check"
                  id={eachemp.employmentTypeId}
                  onChange={this.onEmploymentTypeChange}
                />
                <label htmlFor={eachemp.employmentTypeId} className="emp">
                  {eachemp.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <hr />
        <div>
          <h1>Salary Range</h1>
          <ul>
            {salaryRangesList.map(eachsal => (
              <li key={eachsal.salaryRangeId} className="empList">
                <input
                  type="radio"
                  name="salary" // Ensure only one is selected
                  className="check"
                  id={eachsal.salaryRangeId}
                  onChange={this.onSalaryRangeChange}
                />
                <label htmlFor={eachsal.salaryRangeId} className="emp">
                  {eachsal.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default FilterJobs
