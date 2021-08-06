import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './styles.css';
import  axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios
        .get('https://localhost:5001/api/activities')
        .then(response=>{
          setActivities(response.data);
        })
  },[])
  
  return (
    <div className="App">
      <Header as='h2' icon='users'  content="Reactitivies"/>
      
      <List>
          {activities.map((activity: any)=>(
            <List.Item key={activity.id}>
              {activity.title}
            </List.Item>
          ))}
      </List>
        
    </div>
  );
}

export default App;
