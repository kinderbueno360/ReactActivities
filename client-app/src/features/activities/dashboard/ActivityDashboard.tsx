import { observer } from "mobx-react-lite";
import React from "react";  
import { Grid, List }  from "semantic-ui-react";
import { BooleanLiteral } from "typescript";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/store/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

export default observer(function ActivityDashboard(){

    const {activityStore} = useStore();
    const {selectedActivity, editMode} = activityStore;
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode &&
                <ActivityDetails /> }
                {editMode &&
                <ActivityForm />}
                
            </Grid.Column>
        </Grid>
    )
}) 