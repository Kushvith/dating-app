using System;
using System.Collections.Generic;
using API.Entities;



namespace API.DTOS
{
    public class MemberDto
    {
   
        public int Id { get; set; }
        public string username { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public string photoUrl { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;
        public string Gender { get; set; } 
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
      
  
    }
}