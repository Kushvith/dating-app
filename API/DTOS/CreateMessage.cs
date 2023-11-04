using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOS
{
    public class CreateMessage
    {
        public string ReciepientUsername { get; set; }
        public string Content { get; set; }
    }
}