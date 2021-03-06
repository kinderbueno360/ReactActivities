import { thisTypeAnnotation } from "@babel/types";
import { format } from "date-fns";
import { roundToNearestMinutesWithOptions } from "date-fns/fp";
import { makeAutoObservable,  runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { Profile } from "../models/profile";
import { store } from "./store";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loadding = false;
    loadingInitial = false;

    constructor(){
        makeAutoObservable(this)
    }
    
    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b)=> 
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity)=>{
                const date = format(activity.date!, 'dd MMM yyyy');
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
        const user = store.userStore.user;
        if(user) {
            activity.isGoing = activity.attendees!.some(
                a => a.userName === user.userName
            )
            activity.isHost = activity.hostUserName === user.userName;
            activity.host = activity.attendees?.find(x=> x.userName === activity.hostUserName);

        }
        activity.date = new Date(activity.date!);
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

    createActivity = async (activity: ActivityFormValues) => {
        const user  = store.userStore.user;
        const attendee = new Profile(user!);
        try
        {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUserName = user!.userName;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(()=>{
                this.selectedActivity = newActivity;
            })
            
        }
        catch(error)
        {
            console.log(error);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
     
        try
        {
            await agent.Activities.update(activity);
            runInAction(()=>{
                if(activity.id) {
                    let updatedActivity = {...this.getActivity(activity.id), ...activity}
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
            
        }
        catch(error)
        {
            console.log(error);
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
            runInAction(()=>{  this.loadding= false;   })
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loadding = true;
        try
        {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                if(this.selectedActivity?.isGoing)
                {
                    this.selectedActivity.attendees = 
                            this.selectedActivity.attendees?.filter(a => a.userName !== user?.userName);

                    this.selectedActivity.isGoing = false;
                }
                else
                {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }

                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
            
        }
        catch(error)
        {
            console.log(error);
            runInAction(()=>{ this.loadding= false;  })
        } 
    }

    cancelActivityToggle = async () => {
        const user = store.userStore.user;
        this.loadding = true;
        try
        {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                this.selectedActivity!.isCanceled = !this.selectedActivity?.isCanceled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
            
        }
        catch(error)
        {
            console.log(error);
            runInAction(()=>{ this.loadding= false;  })
        } 

    }
}