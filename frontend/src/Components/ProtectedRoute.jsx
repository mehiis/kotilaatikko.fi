// ProtectedRoute.jsx
import { Navigate } from 'react-router';
import { useUserContext } from '../Hooks/contextHooks';

const ProtectedRoute = ({ children }) => {
    const { user } = useUserContext();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export { ProtectedRoute };
