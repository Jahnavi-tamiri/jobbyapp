import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Cookies from 'js-cookie'
import JobItem from '../JobItem'
import FilterJobs from '../FilterJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobCard extends Component {
  state = {
    jobsList: [],
    employmentType: [],
    minimumPackage: '',
    search: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.jobslistDetails()
  }

  jobslistDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {employmentType, minimumPackage, search} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const employmentTypeQuery = employmentType.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({jobsList: data, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onchangeSearch = event => {
    this.setState({search: event.target.value})
  }

  onclickSearch = () => {
    this.jobslistDetails()
  }

  updateEmploymentType = (employmentTypeId, isChecked) => {
    this.setState(prevState => {
      const updatedEmploymentType = isChecked
        ? [...prevState.employmentType, employmentTypeId] // Add type if checked
        : prevState.employmentType.filter(type => type !== employmentTypeId) // Remove type if unchecked

      return {employmentType: updatedEmploymentType}
    }, this.jobslistDetails) // Fetch the jobs list after state update
  }

  // Update salary range based on the radio selection in FilterJobs component
  updateSalaryRange = minimumPackage => {
    this.setState({minimumPackage}, this.jobslistDetails) // Update and fetch the jobs list
  }

  onSuccessView = () => {
    const {jobsList} = this.state
    if (jobsList.jobs.length === 0) {
      return (
        <div className="no-jobs-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }
    return (
      <div>
        <ul>
          {jobsList.jobs.map(eachJob => (
            <JobItem jobDetails={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    )
  }

  onFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="fail-view-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button className="logout" type="button" onClick={this.jobslistDetails}>
        Retry
      </button>
    </div>
  )

  onLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  apistatusResult = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onSuccessView()
      case apiStatusConstants.failure:
        return this.onFailureView()
      case apiStatusConstants.loading:
        return this.onLoadingView()
      default:
        return null
    }
  }

  render() {
    const {search} = this.state
    return (
      <div className="bg-container jobs">
        <FilterJobs
          updateEmploymentType={this.updateEmploymentType}
          updateSalaryRange={this.updateSalaryRange}
        />
        <div className="jobitem">
          <div className="search">
            <input
              type="search"
              className="input-search"
              placeholder="Search"
              onChange={this.onchangeSearch}
              value={search}
            />
            <button
              type="button"
              className="searchbtn"
              data-testid="searchButton"
              onClick={this.onclickSearch}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div>{this.apistatusResult()}</div>
        </div>
      </div>
    )
  }
}

export default JobCard
