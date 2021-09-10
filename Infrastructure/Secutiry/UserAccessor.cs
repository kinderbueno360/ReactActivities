using Application;
using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;

namespace Infrastructure
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
        }

        public string GetUserName() => httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
    }
}
