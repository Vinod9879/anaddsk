using System.ComponentModel.DataAnnotations;

namespace webApitest.Models
{
    public class UserUploadedDocuments
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        // Document file paths
        public string? ECPath { get; set; }
        public string? AadhaarPath { get; set; }
        public string? PANPath { get; set; }
        
        // Additional properties for verification and extracted data
        public string? ExtractedData { get; set; }
        public bool IsVerified { get; set; } = false;
        public string? VerificationStatus { get; set; } = "Pending";
        public decimal? RiskScore { get; set; }
        public string? SurveyNumber { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}