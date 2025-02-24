import { useState, useEffect } from "react";
import avtDefault from "../../assets/image/avatar_default.jpg";

export default function Avatar() {
    const [avatar, setAvatar] = useState(avtDefault);

    useEffect(() => {
        const storedUser = localStorage.getItem("User: ");
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                if (userData?.avatar) {
                    setAvatar(userData.avatar);
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    return (
        <div className="text-yellow-800 hover:text-yellow-600">
            <div className="w-10 h-10">
                <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full rounded-full border-2 border-yellow-500"
                />
            </div>
        </div>
    );
}
