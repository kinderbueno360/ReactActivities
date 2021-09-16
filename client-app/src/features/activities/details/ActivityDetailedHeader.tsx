import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import {Button, Header, Item, Segment, Image, Label} from 'semantic-ui-react'
import {Activity} from "../../../app/models/activity";
import { useStore } from '../../../app/store/store';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}

export default observer (function ActivityDetailedHeader({activity}: Props) {
    const {activityStore: { updateAttendance, cancelActivityToggle, loadding}} = useStore();
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                {activity.isCanceled &&
                    <Label style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20}}
                            ribbon color='red' content='Cancelled' />
                }
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(activity.date!, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by <strong><Link to={`/profiles/${activity.host?.userName}`}>{activity.host?.displayName}</Link> </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHost ? (
                    <>
                        <Button 
                            color={activity.isCanceled ? 'green' : 'red'}
                            floated='left'
                            basic
                            content={activity.isCanceled ? 'Re-activate Activity' : 'Cancel Activity'}
                            onClick={cancelActivityToggle}
                            loading={loadding}
                        />
                        <Button disabled={activity.isCanceled} as={Link} to={`/manage/${activity.id}`} color='orange' floated='right'>
                            Manage Event
                        </Button>
                    </>
                ) : activity.isGoing ? (
                    <Button loading={loadding} onClick={updateAttendance}>Cancel attendance</Button>
                ) : (
                    <Button  disabled={activity.isCanceled} loading={loadding} onClick={updateAttendance} color='teal'>Join Activity</Button>
                )}
                
                
                
            </Segment>
        </Segment.Group>
    )
})