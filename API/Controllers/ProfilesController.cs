using Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username) => HandleResult(await Mediator.Send(new Details.Query { UserName = username }));

        [HttpPut]
        public async Task<IActionResult> Edit(Edit.Command command) =>  HandleResult(await Mediator.Send(command));
    }
}
