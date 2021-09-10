using System.Threading;
using System.Threading.Tasks;
using Application;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using Microsoft.EntityFrameworkCore;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public ActivityRequest Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }


        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            private readonly IMapper mapper;
            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                this.mapper = mapper;
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await  context.Users.FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUserName());

                var attendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = Create(request.Activity),
                    IsHost = true
                };

                var activity = Create(request.Activity);
                activity.Attendees.Add(attendee);
                context.Activities.Add(activity);   

                var result = await context.SaveChangesAsync(cancellationToken) > 0;
             
                if (!result) Result<Unit>.Failure("Fails to create activity");

                return Result<Unit>.Success(Unit.Value);
            }

            private Activity Create(ActivityRequest request)  => Activity.Create(request.Title, 
                                                                                    request.Date, 
                                                                                    request.Description,
                                                                                    request.Category,
                                                                                    request.City,
                                                                                    request.Venue);
        }
    }
}