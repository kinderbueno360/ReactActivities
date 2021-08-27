import { getEnhancerFromOptions } from "mobx/dist/internal";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Icon, Message, Segment } from "semantic-ui-react";

interface Props {
    errors: string[];
}
export default function ValidationErrors({errors}: Props){
    return(
       <Message erros>
           {errors && (
               <Message.List>
                   {errors.map((err: any, i) => {
                       <Message.Item key={i}>{err}</Message.Item>
                   }

                   )}
               </Message.List>
           )

           }
       </Message>
    )
}