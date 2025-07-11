# Quick Reference - Backend Integration

## 🚀 Essential Steps

### 1. **CORS Configuration** (Most Important!)
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");
```

### 2. **JWT Authentication**
```csharp
// Program.cs
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
```

### 3. **appsettings.json**
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

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/profile` | ✅ | Get user profile |
| GET | `/api/files` | ✅ | List user files |
| POST | `/api/files/upload` | ✅ | Upload file |
| GET | `/api/files/{id}/download` | ✅ | Download file |
| DELETE | `/api/files/{id}` | ✅ | Delete file |

## 📝 Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Upload File
```bash
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [binary data]
```

## 🧪 Test Commands

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"SecurePass123!"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'
```

## ✅ Success Indicators

When integration works, you'll see:
- ✅ No CORS errors in browser console
- ✅ AuthTest component shows "Authenticated" status
- ✅ Login/Register buttons work without errors
- ✅ Dashboard loads with real data
- ✅ File upload/download works

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Add CORS policy for `localhost:3000` |
| 401 Unauthorized | Check JWT configuration and token |
| File upload fails | Verify file size limits and permissions |
| Database errors | Check connection string and migrations |

## 📋 Checklist

- [ ] CORS configured for `localhost:3000`
- [ ] JWT authentication set up
- [ ] Auth endpoints implemented
- [ ] File endpoints implemented
- [ ] Database configured
- [ ] Environment variables set
- [ ] Test with curl/Postman
- [ ] Test frontend integration

---

**Need the full guide?** See `BACKEND_INTEGRATION_GUIDE.md` for complete details. 