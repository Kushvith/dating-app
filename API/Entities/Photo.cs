using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Entities
{
    [Table("photos")]
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public bool IsMain { get; set; }
        public AppUser appUser { get; set; }
        public int appUserId  { get; set; }
    }
}