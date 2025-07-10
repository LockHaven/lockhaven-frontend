# Backend Integration Guide

## Overview
This frontend is now ready to integrate with your .NET/C# backend. The authentication system is set up to work with RESTful APIs.

## API Endpoints Expected

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile

### File Management Endpoints (Future)
- `POST /api/files/upload` - Upload file
- `GET /api/files` - Get user files
- `GET /api/files/{id}/download` - Download file

## Request/Response Formats

### Register Request
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string"
}
```

### Login Request
```json
{
  "email": "string",
  "password": "string"
}
```

### Auth Response
```json
{
  "success": true,
  "message": "string",
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  }
}
```

## Environment Configuration

Create a `.env.local` file in the frontend root:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ENVIRONMENT=development
```

For production:
```
NEXT_PUBLIC_API_URL=https://your-api.azurewebsites.net/api
NEXT_PUBLIC_ENVIRONMENT=production
```

## CORS Configuration

Your .NET backend will need CORS configured to allow requests from the frontend:

```csharp
// In Program.cs or Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Frontend dev server
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// In middleware pipeline
app.UseCors("AllowFrontend");
```

## Testing the Integration

1. Start your .NET backend on `http://localhost:5000`
2. Start the frontend: `npm run dev`
3. Try registering a new user
4. Try logging in with the registered user
5. Check that the dashboard shows the user's name

## Security Considerations

- Use HTTPS in production
- Implement proper JWT token validation
- Add rate limiting to prevent brute force attacks
- Validate all inputs on both frontend and backend
- Use secure password hashing (bcrypt, Argon2, etc.)

## Next Steps

1. Implement the file upload/download functionality
2. Add file encryption/decryption
3. Implement user profile management
4. Add admin features
5. Set up Azure deployment 