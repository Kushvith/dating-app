using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiException
    {
        public ApiException(int statusCode, String details=null,String message=null) 
        {
            StatusCode = statusCode;
            Details = details;
            Message = message;
        }
        public int StatusCode { get; set; }
        public String Message { get; set; }
        public String Details {get;set;}
    }
}