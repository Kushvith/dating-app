using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class Likeparams:PaginationParams
    {
        public int UserId { get; set; }
        public string predicate { get; set; }
    }
}