# Backend Integration Guide

This guide provides everything you need to build your .NET backend and integrate it with the LockHaven frontend.

## 📋 Table of Contents

1. [API Endpoints](#api-endpoints)
2. [CORS Configuration](#cors-configuration)
3. [Authentication Setup](#authentication-setup)
4. [File Management](#file-management)
5. [Testing the Integration](#testing-the-integration)
6. [Security Considerations](#security-considerations)
7. [Deployment](#deployment)

## 🔗 API Endpoints

### Authentication Endpoints

#### `POST /api/auth/register`
**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### `POST /api/auth/login`
**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### `POST /api/auth/logout`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### `GET /api/auth/profile`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved",
  "user": {
    "id": "user-123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### File Management Endpoints

#### `GET /api/files`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "files": [
    {
      "id": "file-123",
      "name": "document.pdf",
      "size": 1024000,
      "uploadedAt": "2024-01-15T10:30:00Z",
      "status": "encrypted"
    }
  ]
}
```

#### `POST /api/files/upload`
**Headers:** `Authorization: Bearer <token>`
**Body:** `multipart/form-data`

**Request:**
```
Content-Type: multipart/form-data
file: [binary file data]
```

**Response:**
```json
{
  "success": true,
  "fileId": "file-123",
  "message": "File uploaded successfully"
}
```

#### `GET /api/files/{fileId}/download`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```
Content-Type: application/octet-stream
[encrypted file binary data]
```

#### `DELETE /api/files/{fileId}`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## 🌐 CORS Configuration

### .NET Core CORS Setup

Add to your `Program.cs` or `Startup.cs`:

```csharp
// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Use CORS middleware
app.UseCors("AllowFrontend");
```

### Production CORS Configuration

```csharp
// For production, add your domain
policy.WithOrigins(
    "http://localhost:3000",     // Development
    "https://yourdomain.com",    // Production
    "https://www.yourdomain.com" // Production with www
)
```

## 🔐 Authentication Setup

### JWT Configuration

```csharp
// Add JWT services
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };
    });

builder.Services.AddAuthorization();
```

### JWT Settings in `appsettings.json`

```json
{
  "Jwt": {
    "Key": "your-super-secret-key-at-least-32-characters-long",
    "Issuer": "LockHaven",
    "Audience": "LockHavenUsers",
    "ExpiryInMinutes": 60
  }
}
```

### Authentication Controller Example

```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IJwtService _jwtService;

    public AuthController(IUserService userService, IJwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Validate request
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if user exists
        var existingUser = await _userService.GetByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest(new { message = "User already exists" });

        // Create user
        var user = await _userService.CreateAsync(request);
        
        // Generate token
        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            success = true,
            message = "User registered successfully",
            token = token,
            user = new
            {
                id = user.Id,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Validate credentials
        var user = await _userService.ValidateCredentialsAsync(request.Email, request.Password);
        if (user == null)
            return Unauthorized(new { message = "Invalid credentials" });

        // Generate token
        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            success = true,
            message = "Login successful",
            token = token,
            user = new
            {
                id = user.Id,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName
            }
        });
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userService.GetByIdAsync(userId);

        return Ok(new
        {
            success = true,
            message = "Profile retrieved",
            user = new
            {
                id = user.Id,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName
            }
        });
    }
}
```

## 📁 File Management

### File Upload Controller

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FilesController : ControllerBase
{
    private readonly IFileService _fileService;

    public FilesController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFiles()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var files = await _fileService.GetUserFilesAsync(userId);

        return Ok(new { files = files });
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file provided" });

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var fileId = await _fileService.UploadFileAsync(file, userId);

        return Ok(new
        {
            success = true,
            fileId = fileId,
            message = "File uploaded successfully"
        });
    }

    [HttpGet("{fileId}/download")]
    public async Task<IActionResult> DownloadFile(string fileId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var fileData = await _fileService.DownloadFileAsync(fileId, userId);

        return File(fileData, "application/octet-stream");
    }

    [HttpDelete("{fileId}")]
    public async Task<IActionResult> DeleteFile(string fileId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _fileService.DeleteFileAsync(fileId, userId);

        return Ok(new { success = true, message = "File deleted successfully" });
    }
}
```

## 🧪 Testing the Integration

### Step 1: Start Your Backend

```bash
# Navigate to your .NET project
cd ../lockhaven-backend

# Run the backend
dotnet run
```

### Step 2: Test API Endpoints

#### Test Registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Step 3: Test Frontend Integration

1. **Start your frontend**: `npm run dev`
2. **Visit**: `http://localhost:3000`
3. **Test the AuthTest component** - should now work!
4. **Try login/register** - should succeed
5. **Visit dashboard** - should load with real data

### Step 4: Test File Operations

1. **Upload a file** through the dashboard
2. **Download the file** - should work
3. **Delete the file** - should work
4. **Check file list** - should update

## 🔒 Security Considerations

### 1. **Password Security**
```csharp
// Use BCrypt for password hashing
public string HashPassword(string password)
{
    return BCrypt.Net.BCrypt.HashPassword(password);
}

public bool VerifyPassword(string password, string hash)
{
    return BCrypt.Net.BCrypt.Verify(password, hash);
}
```

### 2. **File Encryption**
```csharp
// Encrypt files before storage
public byte[] EncryptFile(byte[] fileData, string key)
{
    using var aes = Aes.Create();
    aes.Key = Encoding.UTF8.GetBytes(key);
    aes.GenerateIV();

    using var encryptor = aes.CreateEncryptor();
    using var ms = new MemoryStream();
    using var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write);
    
    cs.Write(fileData, 0, fileData.Length);
    cs.FlushFinalBlock();
    
    return ms.ToArray();
}
```

### 3. **Input Validation**
```csharp
// Validate file uploads
public bool ValidateFile(IFormFile file)
{
    var maxSize = 100 * 1024 * 1024; // 100MB
    var allowedTypes = new[] { "pdf", "doc", "docx", "jpg", "png", "txt", "zip" };
    
    if (file.Length > maxSize)
        return false;
        
    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
    return allowedTypes.Contains(extension.TrimStart('.'));
}
```

### 4. **Rate Limiting**
```csharp
// Add rate limiting
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User.Identity?.Name ?? context.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            }));
});
```

## 🚀 Deployment

### Environment Variables

```bash
# Production settings
JWT__KEY=your-production-secret-key-here
JWT__ISSUER=LockHaven
JWT__AUDIENCE=LockHavenUsers
JWT__EXPIRYINMINUTES=60

# Database connection
ConnectionStrings__DefaultConnection=your-database-connection-string

# File storage
FileStorage__Path=/app/files
FileStorage__MaxSize=104857600
```

### Docker Configuration

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["LockHaven.API/LockHaven.API.csproj", "LockHaven.API/"]
RUN dotnet restore "LockHaven.API/LockHaven.API.csproj"
COPY . .
WORKDIR "/src/LockHaven.API"
RUN dotnet build "LockHaven.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LockHaven.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LockHaven.API.dll"]
```

## 📝 Checklist

### Backend Setup
- [ ] Create .NET Web API project
- [ ] Configure CORS for frontend domain
- [ ] Set up JWT authentication
- [ ] Implement user registration/login
- [ ] Create file upload/download endpoints
- [ ] Add input validation and security
- [ ] Set up database (SQL Server/PostgreSQL)
- [ ] Configure environment variables

### Integration Testing
- [ ] Test API endpoints with curl/Postman
- [ ] Verify CORS allows frontend requests
- [ ] Test authentication flow end-to-end
- [ ] Test file upload/download
- [ ] Verify error handling
- [ ] Test security measures

### Production Readiness
- [ ] Configure production environment variables
- [ ] Set up SSL/TLS certificates
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Test deployment process
- [ ] Configure CI/CD pipeline

## 🎯 Success Indicators

When integration is complete, you should see:

1. **Frontend tests pass**: No more CORS or network errors
2. **Authentication works**: Login/register functions properly
3. **File operations work**: Upload/download/delete files
4. **Dashboard loads**: Real data from backend
5. **Error handling**: Graceful error messages
6. **Security**: Proper authentication and authorization

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is configured for `localhost:3000`
2. **Authentication Failures**: Check JWT configuration and token validation
3. **File Upload Issues**: Verify file size limits and storage permissions
4. **Database Connection**: Check connection strings and database setup
5. **Environment Variables**: Ensure all required settings are configured

### Debug Steps

1. **Check backend logs** for detailed error messages
2. **Test API endpoints** directly with curl/Postman
3. **Verify CORS headers** in browser network tab
4. **Check authentication tokens** in browser storage
5. **Test database connectivity** and permissions

---
