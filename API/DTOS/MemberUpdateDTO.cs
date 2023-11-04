using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOS
{
    public class MemberUpdateDTO
    {
        public String Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public String City { get; set; }
        public string Country { get; set; }
    }
}