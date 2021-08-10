import React, { Fragment, useEffect, useState } from 'react';
import logo from './logo.svg';
import './styles.css';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loadingcomponent from './LoadingComponent';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../store/activityStore';

function App() {
  const {activityStore} = useStore();


  useEffect(() => {
    activityStore.loadActivities();
  },[activityStore])
  
  

  if(activityStore.loadingInitial) return <Loadingcomponent content='Loading app' />

  return (
    <>
      <NavBar  />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer(App);
