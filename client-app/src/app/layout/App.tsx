import React, { Fragment, useEffect, useState } from 'react';
import logo from './logo.svg';
import './styles.css';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent' 
import Loadingcomponent from './LoadingComponent';
function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubimitting] = useState(false);

  useEffect(() => {
    agent.Activities.list()
        .then(response=>{
          let activities: Activity[] = [];
          response.forEach(activity=>{
            activity.date = activity.date.split('T')[0];
            activities.push(activity);
          });
          setLoading(false);
          setActivities(activities);
        })
  },[])
  
  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x=>x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    setSubimitting(true);
    if(activity.id)
    {
      agent.Activities.update(activity).then(()=>{
        setActivities([...activities.filter(x=> x.id !== activity.id), activity])
        setEditMode(false);
        setSelectedActivity(activity);
        setSubimitting(false);
      })
    }else
    {
      agent.Activities.create(activity).then(()=>{
        setActivities([...activities, activity]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubimitting(false);
      })
    }
  }

  function handleDeleteActivity (id: string){
    setSubimitting(true);
    agent.Activities.delete(id).then(()=>{
      setActivities([...activities.filter(x=>x.id !== id)]);
      setSubimitting(false);
    })    
  }

  if(loading) return <Loadingcomponent content='Loading app' />

  return (
    <>
      <NavBar openForm={handleFormOpen}  />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities} 
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
