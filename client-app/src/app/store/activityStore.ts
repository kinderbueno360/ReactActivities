import { makeAutoObservable,  runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

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

    get groupedActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity)=>{
                const date = activity.date;
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try
        {
            const service =  await agent.Activities.list();
            
            service.forEach(activity=>{
                this.setActivity(activity);
            });
            this.setLoadingInitial(false);
            
        }
        catch(error)
        {
            console.log(error);
            this.setLoadingInitial(false);
            
        }
    }

    loadActivity = async (id: string ) => {
        let activity = this.getActivity(id);
        if(activity){
            this.selectedActivity = activity;
            return activity;
        }else
        {
            this.setLoadingInitial(true);
            
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(()=>{
                    this.selectedActivity = activity;
                });
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string ) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) =>{
        this.selectedActivity = this.activityRegistry.get(id);
    }

    createActivity = async (activity: Activity) => {
        this.loadding = true;
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