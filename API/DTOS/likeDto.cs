using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOS
{
    public class likeDto
    {
        public int id { get; set; }
        public string Username { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public string PhotoUrl { get; set; }
        public string City { get; set; }
    }
}