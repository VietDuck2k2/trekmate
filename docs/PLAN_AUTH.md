# PLAN: Google Auth & Forgot Password

(Duplicate content for codebase documentation per workflow instruction)

## Tech Stack
- **Backend:** Node.js, Express, Passport.js, Nodemailer.
- **Frontend:** React, Tailwind CSS.

## Steps
1. Configure Google Cloud Console and obtain Client ID/Secret.
2. Backend:
   - Add User schema fields: `googleId`, `resetPasswordToken`, `resetPasswordExpires`.
   - Setup Passport Google Strategy.
   - Setup Nodemailer service.
   - Implement Auth routes.
3. Frontend:
   - Create Forgot/Reset Password pages.
   - Integrate with `/api/auth` endpoints.
   - Add Google sign-in button.
