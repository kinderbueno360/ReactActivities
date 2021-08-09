using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Application.Request;
using Domain;
using Microsoft.AspNetCore.Mvc;
using static Application.Activities.Create;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IEnumerable<Activity>> GetActivities() 
            => await Mediator.Send(new List.Query());
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id) 
            => await Mediator.Send(new Details.Query{ Id = id});

        [HttpPost]
        public async Task<IActionResult> CreateActivity(ActivityRequest activity)
            => Ok(await Mediator.Send(new Create.Command{ Activity = activity}));

            
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, ActivityRequest activity)
            => Ok(await Mediator.Send(new Edit.Command{ Id= id, Activity = activity}));

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
            => Ok(await Mediator.Send(new Delete.Command{ Id= id}));
    }
}