namespace API.Controllers
{
    using API.DTOs;
    using API.Services;
    using Domain;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Security.Claims;
    using System.Threading.Tasks;

    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly TokenService tokenService;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
            => await (await userManager
                            .FindByEmailAsync(loginDto.Email))
                            .LoginHandle(signInManager, Unauthorized, tokenService.CreateToken, loginDto.Password);
        
        
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }
            if (await userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("userName", "UserName taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName,
            };

            return (await userManager.CreateAsync(user, registerDto.Password))
                        .RegisterResult(user, tokenService.CreateToken, BadRequest);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
            => (await userManager
                            .FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email)))
                            .ToUserDto(tokenService.CreateToken);

        
        
    }
    public static class AccountControllerExtensions
    {
        public static async Task<ActionResult<UserDto>> LoginHandle(this AppUser user, SignInManager<AppUser> signInManager, Func<ActionResult> unauthorizedFunc, Func<AppUser, string> tokenFunc, string password) =>
            (user == null)
                ? unauthorizedFunc()
                : await signInManager
                                .CheckPasswordSignInAsync(user, password, false)
                                .LoginResult(user,tokenFunc, unauthorizedFunc);


        public static ActionResult<UserDto> RegisterResult(this IdentityResult result, AppUser user , Func<AppUser, string> tokenFunc, Func<string, ActionResult> resultFunc ) 
            => (result.Succeeded) ?  
                    user.ToUserDto(tokenFunc) :
                    resultFunc("Problem registering user");

        public static async Task<ActionResult<UserDto>> LoginResult(this Task<Microsoft.AspNetCore.Identity.SignInResult> result, AppUser user, Func<AppUser, string> tokenFunc, Func<ActionResult> resultFunc)
            => ((await result).Succeeded) ?
                    user.ToUserDto(tokenFunc) :
                    resultFunc();


        public static UserDto ToUserDto(this AppUser user, Func<AppUser, string> tokenFunc) 
            => new UserDto
                    {
                        DisplayName = user.DisplayName,
                        Image = null,
                        Token = tokenFunc(user),
                        UserName = user.UserName
                    };

    }
}