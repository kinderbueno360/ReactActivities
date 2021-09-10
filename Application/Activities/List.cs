using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<IEnumerable<ActivityDto>>> { }

        public class Handler : IRequestHandler<Query, Result<IEnumerable<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                this.mapper = mapper;
            }

            public async Task<Result<IEnumerable<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
                => Result<IEnumerable<ActivityDto>>.Success(mapper.Map<IEnumerable<ActivityDto>>(await GetActivies(cancellationToken)));

            private async Task<IEnumerable<ActivityDto>> GetActivies(CancellationToken cancellationToken)
                => await _context.Activities
                                        .ProjectTo<ActivityDto>(mapper.ConfigurationProvider)
                                        .ToListAsync(cancellationToken);

        }
    }
}