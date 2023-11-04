using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOS
{
    public class UserDTO
    {
          public string username { get; set; }
        public string Token { get; set; }
        public string PhotoUrl { get; set; }
        public string gender { get; set; }
    }
}