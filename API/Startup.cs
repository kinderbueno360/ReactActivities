using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Persistence;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Application.Activities;
using Application.Core;
using FluentValidation.AspNetCore;
using API.Middleware;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            _config = configuration;
        }

        private IConfiguration _config { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            })
                        .AddDbContext<DataContext>(opt => {
                            opt.UseSqlite(_config.GetConnectionString("DefaultConnection"));
                        })
                        .AddCors(opt => {
                            opt.AddPolicy("CorsPolicy", policy =>
                            {
                                policy
                                .AllowAnyMethod()
                                .AllowAnyHeader()
                                .AllowAnyOrigin();
                            });
                        })
                        .AddMediatR(typeof(List.Handler).Assembly)
                        .AddAutoMapper(typeof(MappingProfiles).Assembly);

            services.AddControllers()
                    .AddFluentValidation(config=> {
                        config.RegisterValidatorsFromAssemblyContaining<Create>();
                    });

            //services.AddApplicationServices(_config);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            app.UseMiddleware<ExceptionMiddleware>();

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
