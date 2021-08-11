import { observer } from "mobx-react-lite";
import React from "react";  
import { useEffect } from "react";
import { Grid }  from "semantic-ui-react";
import Loadingcomponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/store/store";
import ActivityList from "./ActivityList";

export default observer(function ActivityDashboard(){

    const {activityStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;
    useEffect(() => {
        if(activityRegistry.size <= 1) loadActivities();
      },[activityRegistry.size,loadActivities])
    
    if(activityStore.loadingInitial) return <Loadingcomponent content='Loading app' />
      
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    )
}) 