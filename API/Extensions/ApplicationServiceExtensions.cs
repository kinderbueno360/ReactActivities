using Application.Activities;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) 
            => services.AddSwaggerGen(c =>
                        {
                            c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
                        })
                        .AddDbContext<DataContext>(opt => {
                        opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
                        })
                        .AddCors(opt=>{
                            opt.AddPolicy("CorsPolicy", policy=> 
                            {
                                policy
                                .AllowAnyMethod()
                                .AllowAnyHeader()
                                .WithOrigins("http://localhost:3000");
                            });
                        })
                        .AddMediatR(typeof(List.Handler).Assembly)
                        .AddAutoMapper(typeof(MappingProfiles).Assembly);        
    }
}