using Application.Photos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Add.Command command) 
            => HandleResult(await Mediator.Send(command));


        [HttpDelete("id")]
        public async Task<IActionResult> Delete(string Id)
            => HandleResult(await Mediator.Send(new Delete.Command { Id = Id  }));


        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMain(string id)
            => HandleResult(await Mediator.Send(new SetMain.Command { Id = id }));
    }
}
