using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Request;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public ActivityRequest Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this.mapper = mapper;
                this.context = context;
            }


            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.FindAsync(request.Id);

                if (activity == null) return Result<Unit>.Failure("Failed to delete the activity");


                mapper.Map(request.Activity, activity);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                if (!result) return Result<Unit>.Failure("Failed to delete the activity");

                return Result < Unit >.Success(Unit.Value);
            }
        }
    }
}