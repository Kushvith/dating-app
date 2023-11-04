using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOS
{
    public class LoginDTO
    {
        [Required]
        public String username { get; set; }
        [Required]
        public String password { get; set; }
    }
}