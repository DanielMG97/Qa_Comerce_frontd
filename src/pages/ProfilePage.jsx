import { useEffect, useState } from "react";
import { getProfile } from "../api/endpoints";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        async function fetchProfile() {
            try {
                const { data } = await getProfile();
                if (active) setProfile(data);
            } catch (err) {
                if (active) setError("No se pudo cargar el perfil.");
            } finally {
                if (active) setLoading(false);
            }
        }
        fetchProfile();
        return () => {
            active = false;
        };
    }, []);

    if (loading) return <p className="state-msg">Cargando perfil...</p>;
    if (error) return <p className="state-msg state-msg--error">{error}</p>;
    if (!profile) return null;

    return (
        <div className="profile-page">
            <h1>Mi perfil</h1>
            <p>
                <strong>Nombre:</strong> {profile.firstName} {profile.lastName}
            </p>
            <p>
                <strong>Email:</strong> {profile.email}
            </p>
            <p>
                <strong>Teléfono:</strong> {profile.phone}
            </p>
        </div>
    );
}
