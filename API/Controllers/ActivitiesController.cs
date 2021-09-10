using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application;
using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Application.Activities.Create;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities() 
            => HandleResult(await Mediator.Send(new List.Query()));
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id) 
            => HandleResult(await Mediator.Send(new Details.Query{ Id = id}));

        [HttpPost]
        public async Task<IActionResult> CreateActivity(ActivityRequest activity)
            => HandleResult(await Mediator.Send(new Create.Command{ Activity = activity}));

            
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, ActivityRequest activity)
            => HandleResult(await Mediator.Send(new Edit.Command{ Id= id, Activity = activity}));

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
            => HandleResult(await Mediator.Send(new Delete.Command{ Id= id}));

      
    }
}