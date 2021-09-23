import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Grid, Header, Icon, Image, Tab } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/store/store";

interface Props {
    profile: Profile;
}

export default observer(function ProfilePhotos({profile}: Props){
    const {profileStore: {isCurrentUser , uploadPhoto, uploading}} = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} >
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button floated='right' basic content={addPhotoMode ? 'Cancel' : 'Add Photo'} 
                        onClick={()=> setAddPhotoMode(!addPhotoMode)} />
                    )}
                </Grid.Column>
                <Grid.Column width={16} >
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload}  loading={uploading}/>
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(photo=>{
                                <Card>
                                    <Image src={photo.url} />
                                </Card>
                            })}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})