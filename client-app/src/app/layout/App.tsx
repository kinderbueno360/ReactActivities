import React, { Fragment, useEffect, useState } from 'react';
import logo from './logo.svg';
import './styles.css';
import  axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';


function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  useEffect(() => {
    axios
        .get<Activity[]>('https://localhost:5001/api/activities')
        .then(response=>{
          setActivities(response.data);
        })
  },[])
  
  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x=>x.id === id));
  }

  function handleCancelActivity() {
    setSelectedActivity(undefined);
  }

  return (
    <>
      <NavBar  />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities} 
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelActivity}
        />
      </Container>
    </>
  );
}

export default App;
