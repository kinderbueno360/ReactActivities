import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid } from 'uuid';

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loadding = false;
    loadingInitial = true;

    constructor(){
        makeAutoObservable(this)
    }
    
    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b)=> 
            Date.parse(a.date)- Date.parse(b.date));
    }

    loadActivities = async () => {
        try
        {
            const service =  await agent.Activities.list();
            
            service.forEach(activity=>{
                activity.date = activity.date.split('T')[0];
                this.activityRegistry.set(activity.id, activity);
            });
            this.setLoadingInitial(false);
            
        }
        catch(error)
        {
            console.log(error);
            this.setLoadingInitial(false);
            
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) =>{
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectedActivity = () =>{
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        console.log('close');
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loadding = true;
        activity.id = uuid();
        try
        {
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loadding= false;
            })
            
        }
        catch(error)
        {
            console.log(error);
            runInAction(()=>{
                this.loadding= false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loadding = true;
        try
        {
            await agent.Activities.update(activity);
            runInAction(()=>{
                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loadding= false;
            })
            
        }
        catch(error)
        {
            console.log(error);
            runInAction(()=>{
                this.loadding= false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loadding = true;
        try
        {
            await agent.Activities.delete(id);
            runInAction(()=>{
                this.activityRegistry.delete(id);
                if (this.selectedActivity?.id === id) this.cancelSelectedActivity();

                this.loadding= false;
            })
            
        }
        catch(error)
        {
            console.log(error);
            runInAction(()=>{
                this.loadding= false;
            })
        }
    }
}