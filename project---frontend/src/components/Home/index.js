import NavBar from '../NavBar'
import { useEffect, useState } from "react"
import axios from 'axios'
import Cookies from "js-cookie"
import { jwtDecode } from 'jwt-decode';
const Home = () => {
  const [taskList, setTaskList] = useState()
  const jwtToken = Cookies.get("jwtToken")
  const userDetails = jwtDecode(jwtToken)
  const fetchData = async () => {
    const response = await axios.get(`http://localhost:3006/user/get/task/${userDetails.id}`, {
      headers: {
        "Authorization": `Bearer ${jwtToken}`
      }
    })
    if (response.data.status === "success") {
      setTaskList(response.data.taskList)
    } else {

    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div className='home-container'>
      <NavBar />
      <div>
        <ul>
          {taskList?.map((each) => <li key={each.id}>
            <p>{each.task_title}</p>
            <p>{each.status}</p>
          </li>)}
        </ul>
      </div>
    </div>
  )
}

export default Home
