// Temporarily replace this line in App.jsx
import ProfileEditFormDebug from './components/user/ProfileEditFormDebug';

// And change the route to:
<Route
  path="/profile/edit"
  element={
    <ProtectedRoute>
      <ProfileEditFormDebug />
    </ProtectedRoute>
  }
/>