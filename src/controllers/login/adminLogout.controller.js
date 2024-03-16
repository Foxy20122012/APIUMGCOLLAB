// adminLogout.controller.js
export const adminLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        // Limpiar las cookies de sesión
        res.clearCookie('sessionID');
        res.json({ message: 'Logout successful for admin' });
    });
};
