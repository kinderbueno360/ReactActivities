using System.Threading;
using System.Threading.Tasks;
using Application.Request;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public ActivityRequest Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
           private readonly DataContext context;
            private readonly IMapper mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this.mapper = mapper;
                this.context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                context.Activities.Add(Create(request.Activity));   

                await context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
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